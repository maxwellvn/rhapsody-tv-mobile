import { AppSpinner } from "@/components/app-spinner";
import { Comments } from "@/components/comments";
import { CommentsModal } from "@/components/uploaded-video/comments-modal";
import { UploadedVideoPlayer } from "@/components/uploaded-video/uploaded-video-player";
import { VideoRecommendationCard } from "@/components/video-recommendation-card";
import { DEFAULT_PROFILE_AVATAR } from "@/constants/avatar";
import { useVideoOverlay } from "@/context/VideoOverlayContext";
import {
  useChannelSubscriptionStatus,
  useChannelVideos,
  useSubscribe,
  useUnsubscribe,
} from "@/hooks/queries/useChannelQueries";
import { useLikeStatus, useToggleLike, useVideoComments } from "@/hooks/queries/useVodQueries";
import {
  useAddToWatchlist,
  useRemoveFromWatchlist,
  useWatchlist,
} from "@/hooks/queries/useUserQueries";
import { downloadNotificationService } from "@/services/download-notification.service";
import { homepageService } from "@/services/homepage.service";
import { offlineDownloadService } from "@/services/offline-download.service";
import { videoService } from "@/services/video.service";
import { styles } from "@/styles/live-video.styles";
import { formatNumber, formatRelativeTime } from "@/utils/formatters";
import { dimensions, fs } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VideoScreen() {
  const { id, startAt, programName } = useLocalSearchParams<{ id?: string; startAt?: string; programName?: string }>();
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
    resolvedProgramName?: string;
  }>({});
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [initialPositionSeconds, setInitialPositionSeconds] = useState(0);
  const lastProgressPostedRef = useRef(0);
  const lastProgressSecondRef = useRef(0);
  const [videoEnded, setVideoEnded] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [countdownCancelled, setCountdownCancelled] = useState(false);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Display name: prefer program name (from URL param or API) over channel name
  const displayName =
    programName || videoDetails.resolvedProgramName || videoDetails.channelName || "Unknown channel";

  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      if (!isCommentsOpen) return false;
      setTimeout(() => {
        setIsCommentsOpen(false);
      }, 0);
      return true;
    });

    return () => subscription.remove();
  }, [isCommentsOpen]);

  // Fetch subscription status
  const { data: subscriptionStatus, isLoading: isCheckingSubscription } =
    useChannelSubscriptionStatus(videoDetails.channelId);

  // Fetch channel videos for recommendations
  const { data: channelVideosData, isLoading: isLoadingChannelVideos } =
    useChannelVideos(videoDetails.channelSlug || "", 1, 8);

  // Fetch real comment count and latest comment for preview
  const { data: commentsPreviewData } = useVideoComments(id || "", 1, 1, 'newest');

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
  const { data: likeStatusData, isLoading: isLikeStatusLoading } = useLikeStatus(id);
  const toggleLikeMutation = useToggleLike();
  const [optimisticLiked, setOptimisticLiked] = useState<boolean | null>(null);
  const serverIsLiked = likeStatusData?.isLiked ?? false;
  const isLiked = optimisticLiked ?? serverIsLiked;

  useEffect(() => {
    setOptimisticLiked(null);
  }, [serverIsLiked]);

  // Watchlist
  const { data: watchlistData } = useWatchlist(1, 100);
  const addToWatchlistMutation = useAddToWatchlist();
  const removeFromWatchlistMutation = useRemoveFromWatchlist();
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    if (watchlistData?.items && id) {
      setIsInWatchlist(watchlistData.items.some((item) => item.video?.id === id));
    }
  }, [watchlistData, id]);

  const handleWatchlist = async () => {
    if (!id) return;
    const next = !isInWatchlist;
    setIsInWatchlist(next);
    try {
      if (next) {
        await addToWatchlistMutation.mutateAsync({ videoId: id });
      } else {
        await removeFromWatchlistMutation.mutateAsync(id);
      }
    } catch {
      setIsInWatchlist(!next);
    }
  };

  // Track latest duration for completion reporting
  const lastDurationRef = useRef(0);

  // Remove from continue watching when video completes + start countdown
  const handleVideoComplete = useCallback(async () => {
    if (!id) return;
    // Defer UI state updates to avoid React warning about cross-render updates.
    setTimeout(() => {
      setVideoEnded(true);
      setCountdown(10);
      setCountdownCancelled(false);
    }, 0);
    if (lastDurationRef.current > 0) {
      try {
        await homepageService.updateProgress({
          videoId: id,
          progressSeconds: Math.floor(lastDurationRef.current),
          durationSeconds: Math.floor(lastDurationRef.current),
        });
      } catch {
        // ignore
      }
    }
  }, [id]);

  // Ref so the interval callback always has the latest next video id
  const nextVideoIdRef = useRef<string | null>(null);

  // Keep nextVideoIdRef up to date
  const recommendedVideos = (channelVideosData?.videos || []).filter((v) => v.id !== id);
  useEffect(() => {
    nextVideoIdRef.current = recommendedVideos[0]?.id ?? null;
  });

  // Countdown tick — navigate to next video when it hits 0
  useEffect(() => {
    if (!videoEnded || countdownCancelled) return;
    setCountdown(10);
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          const nextId = nextVideoIdRef.current;
          if (nextId) {
            setVideoEnded(false);
            router.push({ pathname: "/video", params: { id: nextId } });
          }
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [videoEnded, countdownCancelled]);

  const fetchVideoData = async () => {
    // For testing/demo purposes, use a test video if no id is provided
    if (!id) {
      setVideoUri(undefined);
      setVideoDetails({});
      setIsLoadingVideo(false);
      return;
    }

    try {
      setIsLoadingVideo(true);
      setInitialPositionSeconds(Math.max(0, Number(startAt || 0) || 0));

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

      let didResolveVideo = false;

      // Primary source: VOD details
      try {
        const response = await videoService.getVodVideo(id);
        if (response.success && response.data) {
          const video = response.data;
          const raw = video as any;
          setVideoUri(offlineVideo?.localUri || video.playbackUrl);
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
            resolvedProgramName:
              video.program?.title ||
              raw.programName ||
              raw.program?.name ||
              undefined,
          }));
          didResolveVideo = true;
        }
      } catch {
        // Try fallback endpoint below.
      }

      // Fallback source: generic video details endpoint
      if (!didResolveVideo) {
        try {
          const detailRes = await videoService.getVideoDetails(id);
          const streamRes = await videoService
            .getStreamUrl(id)
            .catch(() => undefined);
          const streamData = streamRes?.data as
            | { playbackUrl?: string; streamUrl?: string }
            | undefined;

          const video = detailRes?.data as any;
          const fallbackPlaybackUrl =
            video?.streamUrl ||
            streamData?.playbackUrl ||
            streamData?.streamUrl;

          if (video) {
            setVideoUri(offlineVideo?.localUri || fallbackPlaybackUrl);
            setVideoDetails((prev) => ({
              ...prev,
              title: video.title,
              channelName: video.channel?.name,
              channelAvatar: video.channel?.avatar || video.channel?.logoUrl,
              thumbnailUrl: video.thumbnailUrl || video.thumbnail,
              views: video.viewCount || video.views,
              publishedAt: video.createdAt || video.uploadDate,
              playbackUrl: fallbackPlaybackUrl,
              channelId: video.channel?.id,
              channelSlug: video.channel?.slug,
              resolvedProgramName:
                video.program?.title ||
                video.programName ||
                video.program?.name ||
                undefined,
            }));
            didResolveVideo = true;
          }
        } catch {
          // No fallback available.
        }
      }

      if (!didResolveVideo && !offlineVideo) {
        setVideoUri(undefined);
        setVideoDetails({});
      }
    } catch {
      const offlineVideo = await offlineDownloadService.getDownloadedVideo(id);
      if (!offlineVideo) {
        setVideoUri(undefined);
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
  }, [id, startAt]);

  const syncProgress = useCallback(
    async (currentTime: number, duration: number) => {
      if (duration > 0) lastDurationRef.current = duration;
      if (!id || !videoDetails.playbackUrl) return;
      if (duration <= 0 || currentTime <= 0) return;

      const now = Date.now();
      const currentSecond = Math.floor(currentTime);
      const shouldPost =
        currentSecond - lastProgressSecondRef.current >= 10 ||
        now - lastProgressPostedRef.current > 15000;

      if (!shouldPost) return;

      lastProgressSecondRef.current = currentSecond;
      lastProgressPostedRef.current = now;
      try {
        await homepageService.updateProgress({
          videoId: id,
          progressSeconds: currentSecond,
          durationSeconds: Math.floor(duration),
        });
      } catch {
        // Ignore progress sync errors silently for UX
      }
    },
    [id, videoDetails.playbackUrl],
  );

  const handleSubscribe = async () => {
    if (!videoDetails.channelId) return;

    try {
      if (isSubscribed) {
        await unsubscribeMutation.mutateAsync({
          id: videoDetails.channelId,
          slug: videoDetails.channelSlug,
        });
        setIsSubscribed(false);
      } else {
        await subscribeMutation.mutateAsync({
          id: videoDetails.channelId,
          slug: videoDetails.channelSlug,
        });
        setIsSubscribed(true);
      }
    } catch (err) {
      console.error("Subscription error:", err);
      setIsSubscribed(subscriptionStatus?.isSubscribed ?? false);
    }
  };

  const handleLike = async () => {
    if (!id) return;
    const next = !isLiked;
    setOptimisticLiked(next);
    try {
      await toggleLikeMutation.mutateAsync(id);
    } catch {
      setOptimisticLiked(null);
    }
  };

  // Observe active downloads from the service so progress survives navigation
  useEffect(() => {
    if (!id) return;
    const unsubscribe = offlineDownloadService.subscribeToActiveDownloads(
      (downloads) => {
        const mine = downloads.find((d) => d.videoId === id);
        if (mine) {
          setIsDownloading(true);
          setDownloadProgress(mine.progress);
        } else if (isDownloading) {
          // Download finished or was cancelled — check if it completed
          setIsDownloading(false);
          setDownloadProgress(0);
          offlineDownloadService.getDownloadedVideo(id).then((v) => {
            if (v) {
              setVideoUri(v.localUri);
              setIsDownloaded(true);
            }
          });
        }
      },
    );
    return unsubscribe;
  }, [id, isDownloading]);

  const handleCancelDownload = () => {
    if (!id) return;
    offlineDownloadService.cancelDownload(id);
  };

  const handleDownload = () => {
    if (!id || isDownloaded || isDownloading || !videoDetails.playbackUrl) return;

    setIsDownloading(true);
    setDownloadProgress(0);

    const isHls = (videoDetails.playbackUrl || "")
      .split("?")[0]
      .toLowerCase()
      .endsWith(".m3u8");
    const notificationTitle = videoDetails.title || "Video download";

    // Fire and forget — download runs in the service background
    downloadNotificationService.start(notificationTitle, isHls).then(() => {
      offlineDownloadService
        .downloadVideo({
          videoId: id,
          title: videoDetails.title || "Untitled Video",
          channelName: videoDetails.channelName,
          channelAvatar: videoDetails.channelAvatar,
          thumbnailUrl: videoDetails.thumbnailUrl,
          playbackUrl: videoDetails.playbackUrl,
          onProgress: (progress) => {
            downloadNotificationService.update(progress, notificationTitle, isHls);
          },
        })
        .then((downloaded) => {
          if (downloaded === null) {
            downloadNotificationService.fail(notificationTitle);
          } else {
            downloadNotificationService.complete(notificationTitle);
          }
        })
        .catch(() => {
          downloadNotificationService.fail(notificationTitle);
        });
    });
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
    if (activeVideo?.videoId === id) {
      close();
    }
  }, [id, activeVideo, close]);

  const handleMinimize = () => {
    if (!videoDetails.title) return; // Wait for data

    if (!videoUri) return;
    minimize({
      videoUri,
      title: videoDetails.title,
      channelName: displayName,
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
  const isLikeLoading = toggleLikeMutation.isPending || isLikeStatusLoading;
  const isHlsDownload = (videoDetails.playbackUrl || "")
    .split("?")[0]
    .toLowerCase()
    .endsWith(".m3u8");
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <StatusBar style="light" />

        {/* Uploaded Video Player - No Live badge, No cast button */}
        {isLoadingVideo && id ? (
          <View style={styles.loadingContainer}>
            <AppSpinner size="large" color="#FFFFFF" />
            <Text style={styles.loadingText}>Loading video...</Text>
          </View>
        ) : (
          <UploadedVideoPlayer
            videoUri={videoUri}
            thumbnailSource={require("@/assets/images/Image-10.png")}
            onMinimize={handleMinimize}
            initialPositionSeconds={initialPositionSeconds}
            onProgress={syncProgress}
            onComplete={handleVideoComplete}
            paused={!isScreenFocused || videoEnded}
          />
        )}

        {/* Autoplay countdown / ended overlay */}
        {videoEnded && (
          <View style={endedOverlayStyles.overlay}>
            {countdownCancelled ? (
              /* Cancelled — show replay button */
              <Pressable
                style={endedOverlayStyles.replayButton}
                onPress={() => {
                  setVideoEnded(false);
                  setCountdownCancelled(false);
                }}
              >
                <Ionicons name="refresh" size={32} color="#FFFFFF" />
                <Text style={endedOverlayStyles.replayText}>Replay</Text>
              </Pressable>
            ) : (
              /* Counting down to next video */
              <View style={endedOverlayStyles.countdownContainer}>
                {recommendedVideos[0] && (
                  <Text style={endedOverlayStyles.nextLabel}>
                    Next video in {countdown}s
                  </Text>
                )}
                <View style={endedOverlayStyles.buttonRow}>
                  <Pressable
                    style={endedOverlayStyles.replayButton}
                    onPress={() => {
                      setVideoEnded(false);
                      setCountdownCancelled(false);
                    }}
                  >
                    <Ionicons name="refresh" size={24} color="#FFFFFF" />
                    <Text style={endedOverlayStyles.replayText}>Replay</Text>
                  </Pressable>
                  {recommendedVideos[0] && (
                    <Pressable
                      style={endedOverlayStyles.cancelButton}
                      onPress={() => setCountdownCancelled(true)}
                    >
                      <Text style={endedOverlayStyles.cancelText}>Cancel</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            )}
          </View>
        )}

        {isCommentsOpen ? (
          /* Comments View */
          <CommentsModal videoId={id!} onClose={() => setIsCommentsOpen(false)} />
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
                    source={DEFAULT_PROFILE_AVATAR}
                    style={styles.channelIcon}
                    resizeMode="contain"
                  />
                )}
                <Text style={styles.channelName}>
                  {displayName}
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
                      : "0 views"}
                  </Text>
                </View>
                <Text style={styles.startedTime}>
                  {videoDetails.publishedAt
                    ? formatRelativeTime(videoDetails.publishedAt)
                    : "moments ago"}
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
                  disabled={isLikeLoading || !id}
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

                <Pressable
                  style={[styles.actionButton, isInWatchlist && styles.actionButtonActive]}
                  onPress={handleWatchlist}
                  disabled={!id}
                >
                  <Ionicons
                    name={isInWatchlist ? "bookmark" : "bookmark-outline"}
                    size={dimensions.isTablet ? fs(16) : fs(14)}
                    color={isInWatchlist ? "#E50914" : "#000000"}
                  />
                  <Text style={[styles.actionButtonText, isInWatchlist && styles.actionButtonTextActive]}>
                    {isInWatchlist ? "Saved" : "Save"}
                  </Text>
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
                  style={styles.actionButton}
                  onPress={() => router.push("/donate")}
                >
                  <Ionicons
                    name="heart-outline"
                    size={dimensions.isTablet ? fs(16) : fs(14)}
                    color="#000000"
                  />
                  <Text style={styles.actionButtonText}>Donate</Text>
                </Pressable>

                {isDownloading ? (
                  <Pressable
                    style={styles.actionButton}
                    onPress={handleCancelDownload}
                  >
                    <ActivityIndicator size="small" color="#000000" />
                    <Text style={styles.actionButtonText}>
                      {`${Math.round(downloadProgress * 100)}%`}
                    </Text>
                    <Ionicons
                      name="close-circle"
                      size={dimensions.isTablet ? fs(14) : fs(12)}
                      color="#DC2626"
                    />
                  </Pressable>
                ) : (
                  <Pressable
                    style={[
                      styles.actionButton,
                      isDownloaded && styles.actionButtonActive,
                    ]}
                    onPress={handleDownload}
                    disabled={isDownloaded || !id}
                  >
                    <Ionicons
                      name={isDownloaded ? "checkmark-circle" : "download-outline"}
                      size={dimensions.isTablet ? fs(16) : fs(14)}
                      color={isDownloaded ? "#E50914" : "#000000"}
                    />
                    <Text
                      style={[
                        styles.actionButtonText,
                        isDownloaded && styles.actionButtonTextActive,
                      ]}
                    >
                      {isDownloaded ? "Downloaded" : "Download"}
                    </Text>
                  </Pressable>
                )}
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
              commentCount={commentsPreviewData?.total ?? 0}
              previewComment={
                commentsPreviewData?.comments[0]
                  ? {
                      authorId:
                        commentsPreviewData.comments[0].author?.id ||
                        commentsPreviewData.comments[0].user?.id,
                      content:
                        commentsPreviewData.comments[0].content ||
                        commentsPreviewData.comments[0].message ||
                        "",
                      authorAvatar:
                        commentsPreviewData.comments[0].author?.avatar ||
                        commentsPreviewData.comments[0].user?.avatar,
                      authorGender:
                        commentsPreviewData.comments[0].author?.gender ||
                        commentsPreviewData.comments[0].user?.gender,
                    }
                  : undefined
              }
              onPress={() => setIsCommentsOpen(true)}
            />

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
                    channelName={displayName}
                    channelAvatar={
                      videoDetails.channelAvatar
                        ? { uri: videoDetails.channelAvatar }
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

const endedOverlayStyles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 225,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },
  countdownContainer: {
    alignItems: "center",
    gap: 16,
  },
  nextLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  replayButton: {
    alignItems: "center",
    gap: 6,
  },
  replayText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "500",
  },
  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  cancelText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
});
