import { AppSpinner } from "@/components/app-spinner";
import { LiveChat } from "@/components/live-video/live-chat";
import { LiveChatModal } from "@/components/live-video/live-chat-modal";
import { VideoPlayer } from "@/components/video-player";
import { VideoRecommendationCard } from "@/components/video-recommendation-card";
import { DEFAULT_PROFILE_AVATAR } from "@/constants/avatar";
import {
  useChannelSubscriptionStatus,
  useChannelVideos,
  useSubscribe,
  useUnsubscribe,
} from "@/hooks/queries/useChannelQueries";

import { useVideoOverlay } from "@/context/VideoOverlayContext";
import { useWatchLivestream } from "@/hooks/queries/useHomepageQueries";
import { useLikeStatus, useToggleLike } from "@/hooks/queries/useVodQueries";
import { useLivestreamSocket } from "@/hooks/useLivestreamSocket";
import { styles } from "@/styles/live-video.styles";
import { formatNumber, formatRelativeTime } from "@/utils/formatters";
import { dimensions, fs } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LiveVideoScreen() {
  const { liveStreamId } = useLocalSearchParams<{
    liveStreamId?: string;
  }>();
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      if (!isChatOpen) return false;
      setTimeout(() => {
        setIsChatOpen(false);
      }, 0);
      return true;
    });

    return () => subscription.remove();
  }, [isChatOpen]);

  console.log("liveStreamId", liveStreamId);

  const {
    data: liveProgram,
    isLoading: isLoadingProgram,
    isError: isProgramError,
  } = useWatchLivestream(liveStreamId);

  console.log("liveProgram", liveProgram);

  // Socket integration
  const {
    comments,
    viewerCount,
    hasLiked: socketHasLiked,
    sendComment,
    toggleLike: toggleSocketLike,
    isConnected: isSocketConnected,
  } = useLivestreamSocket(liveStreamId);

  console.log(
    "Socket connected:",
    isSocketConnected,
    "HasLiked:",
    socketHasLiked,
  );

  // Get channel and video IDs from liveProgram
  const channelId = liveProgram?.channel?.id;
  const channelSlug = liveProgram?.channel?.slug;
  const videoId = liveProgram?.videoId;

  // Fetch subscription status on load
  const { data: subscriptionStatus, isLoading: isCheckingSubscription } =
    useChannelSubscriptionStatus(channelId);

  // Fetch channel videos for recommendations under livestream
  const { data: channelVideosData, isLoading: isLoadingChannelVideos } =
    useChannelVideos(channelSlug || "", 1, 8);

  // Subscribe/Unsubscribe mutations
  const subscribeMutation = useSubscribe();
  const unsubscribeMutation = useUnsubscribe();
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null);

  // Reset when channel changes
  useEffect(() => {
    setIsSubscribed(null);
  }, [channelId]);

  useEffect(() => {
    if (subscriptionStatus?.isSubscribed !== undefined) {
      setIsSubscribed(subscriptionStatus.isSubscribed);
    }
  }, [subscriptionStatus]);

  // Like status and toggle
  const { data: likeStatusData } = useLikeStatus(videoId);
  const toggleLikeMutation = useToggleLike();

  // Use socket like status if available, fallback to REST API status
  const isLiked = liveStreamId
    ? socketHasLiked
    : (likeStatusData?.isLiked ?? false);

  // Handle subscribe/unsubscribe
  const handleSubscribe = async () => {
    if (!channelId) return;

    try {
      if (isSubscribed) {
        await unsubscribeMutation.mutateAsync({
          id: channelId,
          slug: channelSlug,
        });
        setIsSubscribed(false);
      } else {
        await subscribeMutation.mutateAsync({
          id: channelId,
          slug: channelSlug,
        });
        setIsSubscribed(true);
      }
    } catch (err) {
      console.error("Subscription error:", err);
      setIsSubscribed(subscriptionStatus?.isSubscribed ?? false);
    }
  };

  // Handle like/unlike
  const handleLike = async () => {
    if (liveStreamId) {
      try {
        toggleSocketLike();
      } catch (err) {
        console.error("Error toggling like:", err);
      }
      return;
    }

    if (!videoId) return;

    try {
      await toggleLikeMutation.mutateAsync(videoId);
    } catch {
      // like state reverts via query refetch
    }
  };

  // Pause video when another screen is pushed on top of this one
  const [isScreenFocused, setIsScreenFocused] = useState(true);
  useFocusEffect(
    useCallback(() => {
      setIsScreenFocused(true);
      return () => {
        setIsScreenFocused(false);
      };
    }, [])
  );

  // Miniplayer Integration
  const { minimize, close, activeVideo } = useVideoOverlay();
  const router = useRouter();

  // Check for handover on mount
  useEffect(() => {
    if (activeVideo?.videoId === liveStreamId) {
      // We are entering the screen for the video that was playing in miniplayer
      close(); // Stop miniplayer so we can take over custom playback
    }
  }, [liveStreamId, activeVideo, close]);

  const handleMinimize = () => {
    if (!liveProgram) return;

    minimize({
      videoUri: liveProgram.playbackUrl || "",
      title: liveProgram.title,
      channelName: liveProgram.channel?.name,
      channelAvatar: liveProgram.channel?.logoUrl,
      isLive: true,
      videoId: liveStreamId,
      channelId: channelId,
      originalRoute: "/live-video",
    });

    router.back();
  };

  const isSubscribeLoading =
    subscribeMutation.isPending ||
    unsubscribeMutation.isPending ||
    isSubscribed === null ||
    isCheckingSubscription;
  const isLikeLoading = toggleLikeMutation.isPending;

  const recommendedVideos =
    channelVideosData?.videos?.filter((video) => video.id !== videoId) || [];

  // playbackUrl is the HLS/m3u8 stream for viewers; rtmpUrl is the ingest URL for broadcasters
  const videoUri = liveProgram?.playbackUrl || undefined;
  const isChatEnabled = liveProgram?.isChatEnabled ?? true;
  const isLoadingVideo = isLoadingProgram;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container} edges={["top"]}>
        <StatusBar style="light" />

        {/* Video Player - Always Visible */}
        {isLoadingVideo ? (
          <View style={styles.loadingContainer}>
            <AppSpinner size="large" color="#FFFFFF" />
            <Text style={styles.loadingText}>Loading video...</Text>
          </View>
        ) : (
          <VideoPlayer
            videoUri={videoUri}
            thumbnailSource={
              liveProgram?.thumbnailUrl
                ? { uri: liveProgram.thumbnailUrl }
                : require("@/assets/images/carusel-2.png")
            }
            isLive={true}
            onMinimize={handleMinimize}
            paused={!isScreenFocused}
          />
        )}

        {isChatOpen && isChatEnabled ? (
          /* Live Chat View */
          <LiveChatModal
            onClose={() => setIsChatOpen(false)}
            viewerCount={formatNumber(viewerCount)}
            comments={comments}
            onSendMessage={sendComment}
          />
        ) : (
          /* Regular Content */
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Video Details */}
            <View style={styles.detailsContainer}>
              {isLoadingProgram ? (
                <Text style={styles.loadingText}>Loading details...</Text>
              ) : (
                <Text style={styles.videoTitle}>
                  {liveProgram?.title || "Live stream"}
                </Text>
              )}

              <View style={styles.channelInfo}>
                <Image
                  source={
                    liveProgram?.channel?.logoUrl
                      ? { uri: liveProgram.channel.logoUrl }
                      : DEFAULT_PROFILE_AVATAR
                  }
                  style={styles.channelIcon}
                  resizeMode="contain"
                />
                <Text style={styles.channelName}>
                  {liveProgram?.channel?.name || "Rhapsody TV"}
                </Text>
                <View style={styles.viewCountContainer}>
                  <Ionicons
                    name="eye-outline"
                    size={dimensions.isTablet ? fs(18) : fs(16)}
                    color="#737373"
                  />
                  <Text style={styles.viewCount}>
                    {`${Math.max(0, viewerCount)} watching`}
                  </Text>
                </View>
                {liveProgram?.startTime && (
                  <Text style={styles.startedTime}>
                    {formatRelativeTime(liveProgram.startTime)}
                  </Text>
                )}
                {isProgramError && (
                  <Text style={styles.startedTime}>
                    Unable to load livestream details.
                  </Text>
                )}
              </View>

              {/* Action Buttons */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.actionButtons}
                style={styles.actionButtonsContainer}
              >
                <Pressable
                  style={[
                    styles.subscribeButton,
                    isSubscribed && styles.subscribedButton,
                  ]}
                  onPress={handleSubscribe}
                  disabled={isSubscribeLoading || !channelId}
                >
                  {isSubscribeLoading ? (
                    <AppSpinner
                      size="small"
                      color={isSubscribed ? "#000000" : "#FFFFFF"}
                    />
                  ) : (
                    <Text
                      style={[
                        styles.subscribeButtonText,
                        isSubscribed && styles.subscribedButtonText,
                      ]}
                    >
                      {isSubscribed ? "Subscribed" : "Subscribe"}
                    </Text>
                  )}
                </Pressable>

                <Pressable
                  style={[
                    styles.actionButton,
                    isLiked && styles.actionButtonActive,
                  ]}
                  onPress={handleLike}
                  disabled={isLikeLoading}
                >
                  {isLikeLoading ? (
                    <AppSpinner size="small" color="#000000" />
                  ) : (
                    <>
                      <Ionicons
                        name={isLiked ? "thumbs-up" : "thumbs-up-outline"}
                        size={dimensions.isTablet ? fs(16) : fs(14)}
                        color={isLiked ? "#E50914" : "#000000"}
                      />
                      <Text
                        style={[
                          styles.actionButtonText,
                          isLiked && styles.actionButtonTextActive,
                        ]}
                      >
                        {isLiked ? "Liked" : "Like"}
                      </Text>
                    </>
                  )}
                </Pressable>

                <Pressable style={styles.actionButton}>
                  <Ionicons
                    name="gift-outline"
                    size={dimensions.isTablet ? fs(16) : fs(14)}
                    color="#000000"
                  />
                  <Text style={styles.actionButtonText}>Sponsor</Text>
                </Pressable>

                <Pressable style={styles.actionButton}>
                  <Ionicons
                    name="share-social-outline"
                    size={dimensions.isTablet ? fs(16) : fs(14)}
                    color="#000000"
                  />
                  <Text style={styles.actionButtonText}>Share</Text>
                </Pressable>

                <Pressable style={styles.actionButton}>
                  <Ionicons
                    name="download-outline"
                    size={dimensions.isTablet ? fs(16) : fs(14)}
                    color="#000000"
                  />
                  <Text style={styles.actionButtonText}>Download</Text>
                </Pressable>
              </ScrollView>
            </View>

            {/* Live Chat Section - only shown when chat is enabled */}
            {isChatEnabled && (
              <LiveChat onPress={() => setIsChatOpen(true)} />
            )}

            {/* Video Recommendations */}
            <View style={styles.recommendationsContainer}>
              {isLoadingChannelVideos ? (
                <Text style={styles.startedTime}>
                  Loading recommendations...
                </Text>
              ) : recommendedVideos.length > 0 ? (
                recommendedVideos.map((video) => (
                  <VideoRecommendationCard
                    key={video.id}
                    thumbnailSource={
                      video.thumbnailUrl
                        ? { uri: video.thumbnailUrl }
                        : require("@/assets/images/Image-2.png")
                    }
                    title={video.title}
                    channelName={liveProgram?.channel?.name || "Channel"}
                    channelAvatar={
                      liveProgram?.channel?.logoUrl
                        ? { uri: liveProgram.channel.logoUrl }
                        : DEFAULT_PROFILE_AVATAR
                    }
                    viewCount={`${formatNumber(video.viewCount)} views`}
                    timeAgo={
                      video.publishedAt
                        ? formatRelativeTime(video.publishedAt)
                        : "Recently uploaded"
                    }
                    onPress={() =>
                      router.push({
                        pathname: "/video",
                        params: { id: video.id },
                      })
                    }
                  />
                ))
              ) : (
                <Text style={styles.startedTime}>
                  No other videos from this channel yet.
                </Text>
              )}
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </>
  );
}
