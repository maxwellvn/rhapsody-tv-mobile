import { Comments } from "@/components/comments";
import { CommentsModal } from "@/components/uploaded-video/comments-modal";
import { UploadedVideoPlayer } from "@/components/uploaded-video/uploaded-video-player";
import { VideoRecommendationCard } from "@/components/video-recommendation-card";
import { videoService } from "@/services/video.service";
import { styles } from "@/styles/live-video.styles";
import { formatNumber, formatRelativeTime } from "@/utils/formatters";
import { dimensions, fs } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
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
    views?: number;
    publishedAt?: string;
  }>({});

  const fallbackStreamUrl =
    "https://2nbyjxnbl53k-hls-live.5centscdn.com/RTV/59a49be6dc0f146c57cd9ee54da323b1.sdp/playlist.m3u8";

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

      // Per API docs, VOD playback and details come from /v1/vod/{videoId}
      const response = await videoService.getVodVideo(id);

      if (response.success && response.data) {
        const video = response.data;
        setVideoUri(video.playbackUrl || fallbackStreamUrl);
        setVideoDetails({
          title: video.title,
          channelName: video.channel?.name,
          channelAvatar: video.channel?.logoUrl,
          views: video.viewCount,
          publishedAt: video.createdAt,
        });
      } else {
        setVideoUri(fallbackStreamUrl);
        setVideoDetails({});
      }
    } catch (err: any) {
      console.error("Error fetching video stream:", err);
      setVideoUri(fallbackStreamUrl);
      setVideoDetails({});
    } finally {
      setIsLoadingVideo(false);
    }
  };

  useEffect(() => {
    fetchVideoData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
                <Pressable style={styles.subscribeButton}>
                  <Text style={styles.subscribeButtonText}>Subscribe</Text>
                </Pressable>

                <Pressable style={styles.actionButton}>
                  <Ionicons
                    name="thumbs-up-outline"
                    size={dimensions.isTablet ? fs(16) : fs(14)}
                    color="#000000"
                  />
                  <Text style={styles.actionButtonText}>Label</Text>
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
