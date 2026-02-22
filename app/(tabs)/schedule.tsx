import { BottomNav } from '@/components/bottom-nav';
import { ScheduleChannelsList } from '@/components/schedule/channels-list';
import { ScheduleHeader } from '@/components/schedule/schedule-header';
import { ScheduleProgramCard } from '@/components/schedule/schedule-program-card';
import {
  useChannelSchedule,
  useChannelSubscriptionStatus,
} from '@/hooks/queries/useChannelQueries';
import { useChannels } from '@/hooks/queries/useHomepageQueries';
import { programSubscriptionService } from '@/services/program-subscription.service';
import { scheduleReminderNotificationService } from '@/services/schedule-reminder-notification.service';
import { FONTS } from '@/styles/global';
import { ChannelSchedule } from '@/types/api.types';
import { borderRadius, fs, hp, platformValue, spacing, wp } from '@/utils/responsive';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ScheduleScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const {
    data: channels = [],
    refetch: refetchChannels,
  } = useChannels(50);
  const [selectedChannelSlug, setSelectedChannelSlug] = useState('');

  useEffect(() => {
    if (!selectedChannelSlug && channels.length > 0) {
      setSelectedChannelSlug(channels[0].slug);
    }
  }, [channels, selectedChannelSlug]);
  const selectedChannel = useMemo(
    () => channels.find((channel) => channel.slug === selectedChannelSlug),
    [channels, selectedChannelSlug],
  );
  const selectedChannelId = selectedChannel?.id;
  const selectedChannelName = selectedChannel?.name;
  const { data: selectedChannelSubscription } =
    useChannelSubscriptionStatus(selectedChannelId);
  const selectedDateParam = useMemo(
    () => selectedDate.toISOString().split('T')[0],
    [selectedDate],
  );

  const {
    data: scheduleData = [],
    isLoading: isLoadingSchedule,
    refetch: refetchSchedule,
  } = useChannelSchedule(selectedChannelSlug, selectedDateParam, 50);
  const [reminderState, setReminderState] = useState<Record<string, boolean>>({});

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchChannels(), refetchSchedule()]);
    } finally {
      setRefreshing(false);
    }
  }, [refetchChannels, refetchSchedule]);

  const handleTabPress = (tab: string) => {
    if (tab === 'Home') {
      router.push('/(tabs)');
    } else if (tab === 'Discover') {
      router.push('/(tabs)/discover');
    } else if (tab === 'Profile') {
      router.push('/(tabs)/profile');
    } else if (tab === 'Schedule') {
      // Already on schedule
    }
  };

  const handleDateChange = (date: Date) => {
    // Prevent navigating to past dates
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const dateStart = new Date(date);
    dateStart.setHours(0, 0, 0, 0);
    if (dateStart < todayStart) return;
    setSelectedDate(date);
  };

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const now = new Date();
  const isToday = isSameDay(selectedDate, now);
  const isPastDate = !isToday && selectedDate < now;
  const currentHour = now.getHours();

  const visibleSchedule = useMemo(
    () =>
      scheduleData
        .filter((slot) => {
          const startHour = new Date(slot.startTime).getHours();
          const endHour = new Date(slot.endTime).getHours();
          if (!isToday) return true;
          return (
            endHour > currentHour ||
            (endHour === currentHour && startHour <= currentHour)
          );
        })
        .sort(
          (a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
        ),
    [scheduleData, isToday, currentHour],
  );
  const visibleScheduleSignature = useMemo(
    () =>
      visibleSchedule
        .map((slot) => `${slot.id}:${new Date(slot.startTime).toISOString()}`)
        .join('|'),
    [visibleSchedule],
  );
  const autoReminderRanRef = useRef<string>('');

  useEffect(() => {
    const loadReminderState = async () => {
      if (visibleSchedule.length === 0) {
        setReminderState((prev) =>
          Object.keys(prev).length === 0 ? prev : {},
        );
        return;
      }

      const data = visibleSchedule.map((slot) => ({
        slotId: slot.id,
        startTime: slot.startTime,
      }));
      const state = await scheduleReminderNotificationService.getReminderState(data);
      setReminderState((prev) => {
        const prevStr = JSON.stringify(prev);
        const nextStr = JSON.stringify(state);
        return prevStr === nextStr ? prev : state;
      });
    };

    loadReminderState();
  }, [visibleScheduleSignature]);

  useEffect(() => {
    const autoSetRemindersForSubscriptions = async () => {
      const runKey = `${visibleScheduleSignature}:${
        selectedChannelSubscription?.isSubscribed ? '1' : '0'
      }`;
      if (autoReminderRanRef.current === runKey) {
        return;
      }
      autoReminderRanRef.current = runKey;

      const upcomingSlots = visibleSchedule.filter(
        (slot) => new Date(slot.startTime).getTime() > Date.now() + 3000,
      );
      if (upcomingSlots.length === 0) return;

      const subscribedProgramMap: Record<string, boolean> = {};
      await Promise.all(
        upcomingSlots.map(async (slot) => {
          try {
            const response = await programSubscriptionService.getStatus(slot.id);
            subscribedProgramMap[slot.id] = !!response.data?.isSubscribed;
          } catch {
            subscribedProgramMap[slot.id] = false;
          }
        }),
      );

      const channelSubscribed = !!selectedChannelSubscription?.isSubscribed;
      const updates: Record<string, boolean> = {};

      await Promise.all(
        upcomingSlots.map(async (slot) => {
          const isProgramSubscribed = !!subscribedProgramMap[slot.id];
          if (!channelSubscribed && !isProgramSubscribed) return;

          const result = await scheduleReminderNotificationService.ensureProgramReminder({
            slotId: slot.id,
            title: slot.title,
            startTime: slot.startTime,
          });

          if (result.scheduled) {
            updates[result.key] = true;
          }
        }),
      );

      if (Object.keys(updates).length > 0) {
        setReminderState((prev) => ({ ...prev, ...updates }));
      }
    };

    autoSetRemindersForSubscriptions();
  }, [visibleScheduleSignature, selectedChannelSubscription?.isSubscribed]);

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

  const getDurationLabel = (program: ChannelSchedule) => {
    let minutes = program.durationInMinutes;
    if (!minutes || minutes <= 0) {
      minutes = Math.max(
        0,
        Math.round(
          (new Date(program.endTime).getTime() - new Date(program.startTime).getTime()) /
            (1000 * 60),
        ),
      );
    }
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    }
    return `${hours} hr${hours !== 1 ? 's' : ''} ${remainingMinutes} min`;
  };

  const getReminderKey = (slot: ChannelSchedule) =>
    `${slot.id}:${new Date(slot.startTime).toISOString()}`;

  const handleNotifyMePress = async (slot: ChannelSchedule) => {
    try {
      const result = await scheduleReminderNotificationService.toggleProgramReminder({
        slotId: slot.id,
        title: slot.title,
        startTime: slot.startTime,
      });

      setReminderState((prev) => ({
        ...prev,
        [result.key]: result.scheduled,
      }));

      Alert.alert(
        result.scheduled ? "Reminder set" : "Reminder removed",
        result.scheduled
          ? `You'll be notified when "${slot.title}" starts.`
          : `Reminder removed for "${slot.title}".`,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not set reminder.";

      if (message === "NOTIFICATION_PERMISSION_DENIED") {
        Alert.alert(
          "Notification permission needed",
          "Allow notifications to use Notify Me reminders.",
        );
        return;
      }

      if (message === "PROGRAM_ALREADY_STARTED") {
        Alert.alert("Program already started", "This reminder can no longer be set.");
        return;
      }

      if (message === "NOTIFICATIONS_UNAVAILABLE") {
        Alert.alert(
          "Notifications unavailable in Expo Go",
          "Use a development build to enable program reminders on Android.",
        );
        return;
      }

      console.error("Schedule reminder error:", error);
      Alert.alert("Reminder failed", "Unable to update reminder right now.");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Image
            source={require('@/assets/Icons/Discover.png')}
            style={styles.icon}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>Schedule</Text>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <ScheduleChannelsList
          selectedChannelSlug={selectedChannelSlug}
          onSelectChannel={setSelectedChannelSlug}
        />
        
        <ScheduleHeader 
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          channelName={selectedChannelName}
        />
        
        {/* Program Schedule List */}
        {isLoadingSchedule ? (
          <Text style={styles.emptyText}>Loading schedule...</Text>
        ) : visibleSchedule.length === 0 ? (
          <Text style={styles.emptyText}>No schedule available</Text>
        ) : (
          visibleSchedule.map((slot, index) => {
          const startDate = new Date(slot.startTime);
          const endDate = new Date(slot.endTime);
          const startHour = startDate.getHours();
          const endHour = endDate.getHours();
          const isCurrentHour =
            isToday &&
            startHour <= currentHour &&
            currentHour < endHour;
          const isUpcoming = new Date(slot.startTime).getTime() > Date.now();
          const isPast = isToday && new Date(slot.endTime).getTime() < Date.now();
          const reminderKey = getReminderKey(slot);
          const isReminderSet = reminderState[reminderKey] ?? false;
          const actionLabel = isCurrentHour
            ? 'Watch Now'
            : isPast
              ? ''
              : isReminderSet
                ? 'Reminder Set'
                : 'Notify Me';

          return (
            <ScheduleProgramCard
              key={`${slot.id}-${index}`}
              time={formatTime(slot.startTime)}
              duration={getDurationLabel(slot)}
              category={slot.category || 'Program'}
              title={slot.title}
              description={slot.description || ''}
              watchingCount={String(slot.viewerCount ?? 0)}
              isLive={isCurrentHour}
              isActionActive={!isCurrentHour && !isPast && isReminderSet}
              actionLabel={actionLabel}
              hideAction={isPast}
              onPress={() => console.log('Program card pressed')}
              onWatchNowPress={() => {
                if (isCurrentHour) {
                  router.push(
                    slot.liveStreamId
                      ? `/live-video?liveStreamId=${slot.liveStreamId}`
                      : '/live-video',
                  );
                  return;
                }
                if (!isPast) {
                  handleNotifyMePress(slot);
                }
              }}
            />
          );
        })
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav activeTab="Schedule" onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: platformValue(hp(49), hp(46)),
    paddingBottom: hp(8),
    paddingHorizontal: spacing.xl,
    backgroundColor: '#FFFFFF',
  },
  iconContainer: {
    width: wp(45),
    height: hp(45),
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: wp(24),
    height: hp(24),
    tintColor: '#000000',
  },
  title: {
    fontSize: fs(28),
    fontFamily: FONTS.bold,
    color: '#000000',
    marginLeft: spacing.md,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: hp(10),
  },
  emptyText: {
    fontSize: fs(14),
    fontFamily: FONTS.regular,
    color: '#666666',
    marginTop: hp(16),
    marginBottom: hp(8),
  },
});
