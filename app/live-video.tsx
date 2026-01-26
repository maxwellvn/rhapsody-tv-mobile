import { LiveChat } from "@/components/live-video/live-chat";
import { LiveChatModal } from "@/components/live-video/live-chat-modal";
import { VideoPlayer } from "@/components/video-player";
import { VideoRecommendationCard } from "@/components/video-recommendation-card";
import { useToast } from "@/context/ToastContext";
import {
  useChannelSubscriptionStatus,
  useSubscribe,
  useUnsubscribe,
} from "@/hooks/queries/useChannelQueries";

import { useWatchLivestream } from "@/hooks/queries/useHomepageQueries";
import { useLikeStatus, useToggleLike } from "@/hooks/queries/useVodQueries";
import { useLivestreamSocket } from "@/hooks/useLivestreamSocket";
import { styles } from "@/styles/live-video.styles";
import { formatRelativeTime } from "@/utils/formatters";
import { dimensions, fs } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
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
  const { showSuccess, showError } = useToast();

  const fallbackStreamUrl = useMemo(
    () =>
      "https://2nbyjxnbl53k-hls-live.5centscdn.com/RTV/59a49be6dc0f146c57cd9ee54da323b1.sdp/playlist.m3u8",
    [],
  );

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
    if (!channelId) {
      showError("Channel information not available");
      return;
    }

    try {
      if (isSubscribed) {
        await unsubscribeMutation.mutateAsync({
          id: channelId,
          slug: channelSlug,
        });
        setIsSubscribed(false);
        showSuccess("Unsubscribed from channel");
      } else {
        await subscribeMutation.mutateAsync({
          id: channelId,
          slug: channelSlug,
        });
        setIsSubscribed(true);
        showSuccess("Subscribed to channel!");
      }
    } catch (err) {
      console.error("Subscription error:", err);
      showError("Failed to update subscription");
      // Reset the local state on error
      setIsSubscribed(subscriptionStatus?.isSubscribed ?? false);
    }
  };

  // Handle like/unlike
  const handleLike = async () => {
    console.log(
      "handleLike called - liveStreamId:",
      liveStreamId,
      "videoId:",
      videoId,
      "isSocketConnected:",
      isSocketConnected,
    );

    if (liveStreamId) {
      console.log("Toggling like for livestream");
      try {
        toggleSocketLike();
        console.log("Like toggled successfully");
        showSuccess(isLiked ? "Removed like" : "Liked!");
      } catch (err) {
        console.error("Error toggling like:", err);
        showError("Failed to update like");
      }
      return;
    }

    if (!videoId) {
      console.log("No videoId available");
      showError("Video information not available");
      return;
    }

    try {
      await toggleLikeMutation.mutateAsync(videoId);
      showSuccess(isLiked ? "Removed like" : "Liked!");
    } catch {
      showError("Failed to update like");
    }
  };

  const isSubscribeLoading =
    subscribeMutation.isPending ||
    unsubscribeMutation.isPending ||
    isSubscribed === null ||
    isCheckingSubscription;
  const isLikeLoading = toggleLikeMutation.isPending;

  const videoUri = liveProgram?.rtmpUrl ?? fallbackStreamUrl;
  const isLoadingVideo = isLoadingProgram;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container} edges={["top"]}>
        <StatusBar style="light" />

        {/* Video Player - Always Visible */}
        {isLoadingVideo ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.loadingText}>Loading video...</Text>
          </View>
        ) : (
          <VideoPlayer
            videoUri={videoUri}
            thumbnailSource={require("@/assets/images/carusel-2.png")}
            isLive={true}
          />
        )}

        {isChatOpen ? (
          /* Live Chat View */
          <LiveChatModal
            onClose={() => setIsChatOpen(false)}
            viewerCount={
              viewerCount > 0 ? `${(viewerCount / 1000).toFixed(1)}k` : "0"
            }
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
                      : require("@/assets/images/Avatar.png")
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
                    {viewerCount > 0 ? `${viewerCount} watching` : "Live now"}
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
                    <ActivityIndicator
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
                    <ActivityIndicator size="small" color="#000000" />
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

            {/* Live Chat Section */}
            <LiveChat onPress={() => setIsChatOpen(true)} />

            {/* Video Recommendations */}
            <View style={styles.recommendationsContainer}>
              <VideoRecommendationCard
                thumbnailSource={require("@/assets/images/Image-2.png")}
                title="Night Of A Thousand Crusades HIGHLIGHT 3"
                channelName="Rhapsody TV"
                channelAvatar={require("@/assets/images/Avatar.png")}
                viewCount="500k views"
                timeAgo="3hrs ago"
                isNew={true}
              />

              <VideoRecommendationCard
                thumbnailSource={require("@/assets/images/Image-6.png")}
                title="NOTHING ON MEDIA IS NEUTRAL A CONVERSATION WITH BLOSSOM CH..."
                channelName="Program Highlights"
                channelAvatar={require("@/assets/images/Avatar.png")}
                viewCount="500k views"
                timeAgo="3hrs ago"
                isNew={true}
              />
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </>
  );
}
