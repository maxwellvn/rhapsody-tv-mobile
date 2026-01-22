import { LiveChat } from "@/components/live-video/live-chat";
import { LiveChatModal } from "@/components/live-video/live-chat-modal";
import { VideoPlayer } from "@/components/video-player";
import { VideoRecommendationCard } from "@/components/video-recommendation-card";
import { useWatchLivestream } from "@/hooks/queries/useHomepageQueries";
import { styles } from "@/styles/live-video.styles";
import { dimensions, fs } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
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
            viewerCount="500k"
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
                  <Text style={styles.viewCount}>Live now</Text>
                </View>
                {liveProgram?.startTime && (
                  <Text style={styles.startedTime}>
                    {liveProgram.startTime}
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
