import { AppSpinner } from "@/components/app-spinner";
import { AboutTab } from '@/components/program-profile/about-tab';
import { HomeTab } from '@/components/program-profile/home-tab';
import { LiveTab } from '@/components/program-profile/live-tab';
import { ProgramProfileHeader } from '@/components/program-profile/profile-header';
import { VideosTab } from '@/components/program-profile/videos-tab';
import {
  useChannel,
  useChannelVideos,
} from "@/hooks/queries/useChannelQueries";
import { usePrograms } from "@/hooks/queries/useHomepageQueries";
import {
  useProgramSubscribe,
  useProgramSubscriptionStatus,
  useProgramUnsubscribe,
} from "@/hooks/queries/useProgramSubscriptionQueries";
import { styles } from '@/styles/program-profile.styles';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, Pressable, RefreshControl, ScrollView, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProgramProfileScreen() {
  const { id, channelId: channelIdParam, channelSlug: channelSlugParam } =
    useLocalSearchParams<{ id?: string; channelId?: string; channelSlug?: string }>();
  const [activeTab, setActiveTab] = useState<'Home' | 'Videos' | 'Live' | 'About'>('Home');
  const [refreshing, setRefreshing] = useState(false);
  const { data: programs = [], isLoading: isLoadingPrograms, refetch: refetchPrograms } = usePrograms(50);

  const selectedProgram = useMemo(
    () => programs.find((p) => p.id === id),
    [programs, id],
  );
  const selectedProgramId = selectedProgram?.id;
  const channelSlug = selectedProgram?.channel?.slug || channelSlugParam || "";
  const channelId = selectedProgram?.channel?.id || channelIdParam;

  const { data: channelDetail, refetch: refetchChannel } = useChannel(channelSlug);
  const { data: channelVideosData, refetch: refetchVideos } = useChannelVideos(
    channelSlug,
    1,
    50,
    selectedProgramId,
  );
  const { data: subscriptionStatus } =
    useProgramSubscriptionStatus(selectedProgramId);
  const subscribeMutation = useProgramSubscribe();
  const unsubscribeMutation = useProgramUnsubscribe();
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  useEffect(() => {
    if (subscriptionStatus?.isSubscribed !== undefined) {
      setIsSubscribed(subscriptionStatus.isSubscribed);
    }
  }, [subscriptionStatus]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetchPrograms(),
        refetchChannel(),
        refetchVideos(),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [refetchPrograms, refetchChannel, refetchVideos]);

  const handleBack = () => {
    router.back();
  };

  const handleSubscribe = async () => {
    if (!selectedProgramId) return;
    try {
      if (isSubscribed) {
        await unsubscribeMutation.mutateAsync(selectedProgramId);
        setIsSubscribed(false);
      } else {
        await subscribeMutation.mutateAsync(selectedProgramId);
        setIsSubscribed(true);
      }
    } catch {
      setIsSubscribed(subscriptionStatus?.isSubscribed ?? false);
    }
  };

  const programTitle = selectedProgram?.title || "Program";
  const channelName = selectedProgram?.channel?.name || "Program Channel";
  const subscriberCount =
    subscriptionStatus?.subscriberCount ??
    channelDetail?.channel?.subscriberCount ??
    0;
  const videoCount = channelVideosData?.total ?? 0;
  const description = selectedProgram?.description || "No description available.";
  const bannerImage = selectedProgram?.thumbnailUrl
    ? { uri: selectedProgram.thumbnailUrl }
    : selectedProgram?.channel?.coverImageUrl
      ? { uri: selectedProgram.channel.coverImageUrl }
      : require("@/assets/images/Image-11.png");
  const avatarImage = selectedProgram?.thumbnailUrl
    ? { uri: selectedProgram.thumbnailUrl }
    : selectedProgram?.channel?.logoUrl
      ? { uri: selectedProgram.channel.logoUrl }
      : require("@/assets/images/Image-11.png");
  const canSubscribe = Boolean(selectedProgramId);
  const isSubscribing =
    subscribeMutation.isPending || unsubscribeMutation.isPending;
  const channelVideos = channelVideosData?.videos || [];
  const handleVideoPress = (videoId: string) =>
    router.push(`/video?id=${videoId}&programName=${encodeURIComponent(programTitle)}`);

  if (isLoadingPrograms) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <AppSpinner size="small" color="#1A237E" />
      </SafeAreaView>
    );
  }

  if (id && !selectedProgram) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
          <Text style={{ color: "#666666", marginBottom: 12 }}>This program is no longer available.</Text>
          <Pressable onPress={() => router.replace("/(tabs)/schedule")}>
            <Text style={{ color: "#0000FF", fontWeight: "600" }}>Go to Schedule</Text>
          </Pressable>
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton} hitSlop={8}>
          <Image
            source={require('@/assets/Icons/back.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Program Profile Section */}
        <ProgramProfileHeader
          bannerImage={bannerImage}
          avatarImage={avatarImage}
          channelName={programTitle}
          subscriberCount={`${subscriberCount} subscribers`}
          videoCount={`${videoCount} videos`}
          description={description}
          isSubscribed={isSubscribed}
          isSubscribing={isSubscribing}
          subscribeDisabled={!canSubscribe}
          onSubscribe={handleSubscribe}
        />

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <Pressable
            style={[styles.tab, activeTab === 'Home' && styles.activeTab]}
            onPress={() => setActiveTab('Home')}
          >
            <Text style={[styles.tabText, activeTab === 'Home' && styles.activeTabText]}>
              Home
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tab, activeTab === 'Videos' && styles.activeTab]}
            onPress={() => setActiveTab('Videos')}
          >
            <Text style={[styles.tabText, activeTab === 'Videos' && styles.activeTabText]}>
              Videos
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tab, activeTab === 'Live' && styles.activeTab]}
            onPress={() => setActiveTab('Live')}
          >
            <Text style={[styles.tabText, activeTab === 'Live' && styles.activeTabText]}>
              Live
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tab, activeTab === 'About' && styles.activeTab]}
            onPress={() => setActiveTab('About')}
          >
            <Text style={[styles.tabText, activeTab === 'About' && styles.activeTabText]}>
              About
            </Text>
          </Pressable>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'Home' && (
            <HomeTab
              videos={channelVideos}
              channelName={programTitle}
              channelAvatarUrl={selectedProgram?.channel?.logoUrl}
              onVideoPress={handleVideoPress}
            />
          )}
          {activeTab === 'Videos' && (
            <VideosTab
              videos={channelVideos}
              channelName={programTitle}
              onVideoPress={handleVideoPress}
            />
          )}
          {activeTab === 'Live' && <LiveTab channelSlug={channelSlug} />}
          {activeTab === 'About' && (
            <AboutTab
              description={description}
              website={channelDetail?.channel?.websiteUrl}
              joinedDate={
                channelDetail?.channel?.joinedAt
                  ? `Joined ${new Date(channelDetail.channel.joinedAt).toLocaleDateString()}`
                  : undefined
              }
              subscriberCount={`${subscriberCount} subscribers`}
            />
          )}
        </View>
      </ScrollView>
      </SafeAreaView>
    </>
  );
}
