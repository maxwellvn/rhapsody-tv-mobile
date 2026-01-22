import { BottomNav } from '@/components/bottom-nav';
import { ScheduleChannelsList } from '@/components/schedule/channels-list';
import { ScheduleHeader } from '@/components/schedule/schedule-header';
import { ScheduleProgramCard } from '@/components/schedule/schedule-program-card';
import { FONTS } from '@/styles/global';
import { borderRadius, fs, hp, platformValue, spacing, wp } from '@/utils/responsive';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ScheduleScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

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
    setSelectedDate(date);
    console.log('Selected date:', date);
    // Here you would fetch schedule data for the selected date
  };

  return (
    <View style={styles.container}>
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
        <Text style={styles.title}>Discover</Text>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <ScheduleChannelsList />
        
        <ScheduleHeader 
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
        />
        
        {/* Program Schedule List */}
        <ScheduleProgramCard
          time="2:00 PM"
          duration="1 hrs"
          category="NEWS"
          title="RHAPATHON 2023 HIGHLIGHTS"
          description="Tune in for exclusive highlight content from the previous Rhapathon 2023 with Pastor Chris"
          hostCount={3}
          watchingCount="645"
          isLive={true}
          onPress={() => console.log('Program card pressed')}
          onWatchNowPress={() => router.push('/live-video')}
        />
        
        <ScheduleProgramCard
          time="3:00 PM"
          duration="1 hrs"
          category="NEWS"
          title="RHAPATHON 2023 HIGHLIGHTS"
          description="Tune in for exclusive highlight content from the previous Rhapathon 2023 with Pastor Chris"
          hostCount={3}
          watchingCount="100"
          isLive={false}
          onPress={() => console.log('Program card pressed')}
          onWatchNowPress={() => console.log('Notify Me pressed')}
        />
        
        <ScheduleProgramCard
          time="4:00 PM"
          duration="1 hrs"
          category="NEWS"
          title="RHAPATHON 2023 HIGHLIGHTS"
          description="Tune in for exclusive highlight content from the previous Rhapathon 2023 with Pastor Chris"
          hostCount={3}
          watchingCount="100"
          isLive={false}
          onPress={() => console.log('Program card pressed')}
          onWatchNowPress={() => console.log('Notify Me pressed')}
        />
        
        <ScheduleProgramCard
          time="5:00 PM"
          duration="3 hrs"
          category="NEWS"
          title="RHAPATHON 2023 HIGHLIGHTS"
          description="Tune in for exclusive highlight content from the previous Rhapathon 2023 with Pastor Chris"
          hostCount={3}
          watchingCount="100"
          isLive={false}
          onPress={() => console.log('Program card pressed')}
          onWatchNowPress={() => console.log('Notify Me pressed')}
        />
        
        <ScheduleProgramCard
          time="6:00 PM"
          duration="2 hrs"
          category="NEWS"
          title="RHAPATHON 2023 HIGHLIGHTS"
          description="Tune in for exclusive highlight content from the previous Rhapathon 2023 with Pastor Chris"
          hostCount={3}
          watchingCount="100"
          isLive={false}
          onPress={() => console.log('Program card pressed')}
          onWatchNowPress={() => console.log('Notify Me pressed')}
        />
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav activeTab="Schedule" onTabPress={handleTabPress} />
    </View>
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
});
