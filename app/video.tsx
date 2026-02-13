import { Comments } from "@/components/comments";
import { CommentsModal } from "@/components/uploaded-video/comments-modal";
import { UploadedVideoPlayer } from "@/components/uploaded-video/uploaded-video-player";
import { VideoRecommendationCard } from "@/components/video-recommendation-card";
import { useToast } from "@/context/ToastContext";
import { useVideoOverlay } from "@/context/VideoOverlayContext";
import {
  useChannelSubscriptionStatus,
  useSubscribe,
  useUnsubscribe,
} from "@/hooks/queries/useChannelQueries";
import { useLikeStatus, useToggleLike } from "@/hooks/queries/useVodQueries";
import { downloadNotificationService } from "@/services/download-notification.service";
import { offlineDownloadService } from "@/services/offline-download.service";
import { videoService } from "@/services/video.service";
import { styles } from "@/styles/live-video.styles";
import { formatNumber, formatRelativeTime } from "@/utils/formatters";
import { dimensions, fs } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VideoScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [videoUri, setVideoUri] = useState<string | undefined>();
  const [isLoadingVideo, setIsLoadingVideo] = useState(true);
  const [videoDetails, setVideoDetails] = useState<{
    title?: string;
    channelName?: string;
    channelAvatar?: string;
    thumbnailUrl?: string;
    views?: number;
    publishedAt?: string;
    channelId?: string;
    channelSlug?: string;
    playbackUrl?: string;
  }>({});
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const { showSuccess, showError } = useToast();

  const fallbackStreamUrl =
    "https://2nbyjxnbl53k-hls-live.5centscdn.com/RTV/59a49be6dc0f146c57cd9ee54da323b1.sdp/playlist.m3u8";

  // Fetch subscription status
  const { data: subscriptionStatus, isLoading: isCheckingSubscription } =
    useChannelSubscriptionStatus(videoDetails.channelId);

  // Subscribe/Unsubscribe mutations
  const subscribeMutation = useSubscribe();
  const unsubscribeMutation = useUnsubscribe();
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null);

  useEffect(() => {
    if (subscriptionStatus?.isSubscribed !== undefined) {
      setIsSubscribed(subscriptionStatus.isSubscribed);
    }
  }, [subscriptionStatus]);

  // Like status and toggle
  const { data: likeStatusData } = useLikeStatus(id);
  const toggleLikeMutation = useToggleLike();
  const isLiked = likeStatusData?.isLiked ?? false;

  const fetchVideoData = async () => {
    // For testing/demo purposes, use a test video if no id is provided
    if (!id) {
      setVideoUri(fallbackStreamUrl);
      setVideoDetails({});
      setIsLoadingVideo(false);
      return;
    }

    try {
      setIsLoadingVideo(true);

      const offlineVideo = await offlineDownloadService.getDownloadedVideo(id);
      if (offlineVideo) {
        setIsDownloaded(true);
        setVideoUri(offlineVideo.localUri);
        setVideoDetails({
          title: offlineVideo.title,
          channelName: offlineVideo.channelName,
          channelAvatar: offlineVideo.channelAvatar,
          thumbnailUrl: offlineVideo.thumbnailUrl,
          playbackUrl: offlineVideo.playbackUrl,
        });
      } else {
        setIsDownloaded(false);
      }

      // Per API docs, VOD playback and details come from /v1/vod/{videoId}
      const response = await videoService.getVodVideo(id);

      if (response.success && response.data) {
        const video = response.data;
        setVideoUri(
          offlineVideo?.localUri || video.playbackUrl || fallbackStreamUrl,
        );
        setVideoDetails((prev) => ({
          ...prev,
          title: video.title,
          channelName: video.channel?.name,
          channelAvatar: video.channel?.logoUrl,
          thumbnailUrl: video.thumbnailUrl,
          views: video.viewCount,
          publishedAt: video.createdAt,
          playbackUrl: video.playbackUrl,
          channelId: video.channel?.id || video.channelId,
          channelSlug: video.channel?.slug,
        }));
      } else {
        if (!offlineVideo) {
          setVideoUri(fallbackStreamUrl);
          setVideoDetails({});
        }
      }
    } catch (err: any) {
      console.error("Error fetching video stream:", err);
      const offlineVideo = await offlineDownloadService.getDownloadedVideo(id);
      if (!offlineVideo) {
        setVideoUri(fallbackStreamUrl);
        setVideoDetails({});
        setIsDownloaded(false);
      }
    } finally {
      setIsLoadingVideo(false);
    }
  };

  useEffect(() => {
    fetchVideoData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubscribe = async () => {
    if (!videoDetails.channelId) {
      showError("Channel information not available");
      return;
    }

    try {
      if (isSubscribed) {
        await unsubscribeMutation.mutateAsync({
          id: videoDetails.channelId,
          slug: videoDetails.channelSlug,
        });
        setIsSubscribed(false);
        showSuccess("Unsubscribed from channel");
      } else {
        await subscribeMutation.mutateAsync({
          id: videoDetails.channelId,
          slug: videoDetails.channelSlug,
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

  const handleLike = async () => {
    if (!id) {
      showError("Video information not available");
      return;
    }

    try {
      await toggleLikeMutation.mutateAsync(id);
      showSuccess(isLiked ? "Removed like" : "Liked!");
    } catch {
      showError("Failed to update like");
    }
  };

  const handleDownload = async () => {
    if (!id) {
      showError("Video information not available");
      return;
    }

    if (isDownloaded) {
      showSuccess("This video is already downloaded");
      return;
    }

    if (!videoDetails.playbackUrl) {
      showError("Download URL unavailable");
      return;
    }

    try {
      setIsDownloading(true);
      setDownloadProgress(0);
      const isHls = (videoDetails.playbackUrl || "")
        .split("?")[0]
        .toLowerCase()
        .endsWith(".m3u8");
      const notificationTitle = videoDetails.title || "Video download";

      await downloadNotificationService.start(notificationTitle, isHls);

      const downloaded = await offlineDownloadService.downloadVideo({
        videoId: id,
        title: videoDetails.title || "Untitled Video",
        channelName: videoDetails.channelName,
        channelAvatar: videoDetails.channelAvatar,
        thumbnailUrl: videoDetails.thumbnailUrl,
        playbackUrl: videoDetails.playbackUrl,
        onProgress: (progress) => {
          setDownloadProgress(progress);
          downloadNotificationService.update(
            progress,
            notificationTitle,
            isHls,
          );
        },
      });

      setVideoUri(downloaded.localUri);
      setIsDownloaded(true);
      await downloadNotificationService.complete(notificationTitle);
      showSuccess("Video downloaded for offline viewing");
    } catch (err: any) {
      await downloadNotificationService.fail(
        videoDetails.title || "Video download",
      );
      showError(err?.message || "Failed to download video");
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  // Miniplayer Integration
  const { minimize, close, activeVideo } = useVideoOverlay();
  const router = useRouter();

  // Check for handover on mount
  useEffect(() => {
    if (activeVideo?.videoId === id) {
      close();
    }
  }, [id, activeVideo, close]);

  const handleMinimize = () => {
    if (!videoDetails.title) return; // Wait for data

    minimize({
      videoUri: videoUri || fallbackStreamUrl,
      title: videoDetails.title,
      channelName: videoDetails.channelName,
      channelAvatar: videoDetails.channelAvatar,
      isLive: false,
      videoId: id,
      channelId: videoDetails.channelId,
      originalRoute: "/video",
    });
    router.back();
  };

  const isSubscribeLoading =
    subscribeMutation.isPending ||
    unsubscribeMutation.isPending ||
    isSubscribed === null ||
    isCheckingSubscription;
  const isLikeLoading = toggleLikeMutation.isPending;
  const isHlsDownload = (videoDetails.playbackUrl || "")
    .split("?")[0]
    .toLowerCase()
    .endsWith(".m3u8");

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container} edges={["top"]}>
        <StatusBar style="light" />

        {/* Uploaded Video Player - No Live badge, No cast button */}
        {isLoadingVideo && id ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.loadingText}>Loading video...</Text>
          </View>
        ) : (
          <UploadedVideoPlayer
            videoUri={videoUri}
            thumbnailSource={require("@/assets/images/Image-10.png")}
            onMinimize={handleMinimize}
          />
        )}

        {isCommentsOpen ? (
          /* Comments View */
          <CommentsModal onClose={() => setIsCommentsOpen(false)} />
        ) : (
          /* Regular Content */
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Video Details */}
            <View style={styles.detailsContainer}>
              <Text style={styles.videoTitle}>
                {videoDetails.title || "Video title unavailable"}
              </Text>

              <View style={styles.channelInfo}>
                {videoDetails.channelAvatar ? (
                  <Image
                    source={{ uri: videoDetails.channelAvatar }}
                    style={styles.channelIcon}
                    resizeMode="contain"
                  />
                ) : (
                  <Image
                    source={require("@/assets/images/Avatar.png")}
                    style={styles.channelIcon}
                    resizeMode="contain"
                  />
                )}
                <Text style={styles.channelName}>
                  {videoDetails.channelName || "Unknown channel"}
                </Text>
                <View style={styles.viewCountContainer}>
                  <Ionicons
                    name="eye-outline"
                    size={dimensions.isTablet ? fs(18) : fs(16)}
                    color="#737373"
                  />
                  <Text style={styles.viewCount}>
                    {videoDetails.views !== undefined
                      ? `${formatNumber(videoDetails.views)} views`
                      : "--- views"}
                  </Text>
                </View>
                <Text style={styles.startedTime}>
                  {videoDetails.publishedAt
                    ? formatRelativeTime(videoDetails.publishedAt)
                    : "---"}
                </Text>
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
                  disabled={isSubscribeLoading || !videoDetails.channelId}
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
                  disabled={isLikeLoading || !id}
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

                <Pressable
                  style={[
                    styles.actionButton,
                    isDownloaded && styles.actionButtonActive,
                  ]}
                  onPress={handleDownload}
                  disabled={isDownloading || !id}
                >
                  {isDownloading ? (
                    <>
                      <ActivityIndicator size="small" color="#000000" />
                      <Text style={styles.actionButtonText}>
                        {`Downloading ${Math.round(downloadProgress * 100)}%`}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Ionicons
                        name={isDownloaded ? "download" : "download-outline"}
                        size={dimensions.isTablet ? fs(16) : fs(14)}
                        color={isDownloaded ? "#E50914" : "#000000"}
                      />
                      <Text
                        style={[
                          styles.actionButtonText,
                          isDownloaded && styles.actionButtonTextActive,
                        ]}
                      >
                        {isDownloading
                          ? `Downloading ${Math.round(downloadProgress * 100)}%`
                          : isDownloaded
                            ? "Downloaded"
                            : "Download"}
                      </Text>
                    </>
                  )}
                </Pressable>
              </ScrollView>

              {isDownloading && (
                <Text style={[styles.startedTime, { marginTop: 8 }]}>
                  {isHlsDownload
                    ? `Downloading HLS stream... ${Math.round(downloadProgress * 100)}%`
                    : `Downloading video... ${Math.round(downloadProgress * 100)}%`}
                </Text>
              )}
            </View>

            {/* Comments Section */}
            <Comments
              commentCount={34}
              onPress={() => setIsCommentsOpen(true)}
            />

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
