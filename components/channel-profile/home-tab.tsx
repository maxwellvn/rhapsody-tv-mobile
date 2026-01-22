import { VideoRecommendationCard } from "@/components/channel-profile/video-recommendation-card";
import { HorizontalVideoCard } from "@/components/program-profile/horizontal-video-card";
import { FONTS } from "@/styles/global";
import { ChannelDetail } from "@/types/api.types";
import { formatDuration } from "@/utils/formatters";
import { fs, hp } from "@/utils/responsive";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

type HomeTabProps = {
  detail: ChannelDetail;
};

export function HomeTab({ detail }: HomeTabProps) {
  const router = useRouter();
  const { channel, latestVideos } = detail;

  const handleVideoPress = (videoId: string) => {
    router.push(`/video?id=${videoId}`);
  };

  const handleMenuPress = (videoId: string) => {
    console.log("Menu pressed for video:", videoId);
  };

  return (
    <View style={styles.container}>
      {/* Featured/Recommendation Video (using the first latest video as featured for now) */}
      {latestVideos && latestVideos.length > 0 && (
        <VideoRecommendationCard
          thumbnailSource={{ uri: latestVideos[0].thumbnail }}
          title={latestVideos[0].title}
          channelAvatar={
            channel.avatar
              ? { uri: channel.avatar }
              : require("@/assets/logo/Logo.png")
          }
          channelName={channel.name}
          viewCount={`${latestVideos[0].views || 0} views`}
          timeAgo={latestVideos[0].uploadDate}
          isLive={false} // Would need real data
          duration={formatDuration(latestVideos[0].duration)}
          onPress={() => handleVideoPress(latestVideos[0].id)}
          onMenuPress={() => handleMenuPress(latestVideos[0].id)}
        />
      )}

      {/* Latest Videos Section */}
      <Text style={styles.sectionTitle}>Latest Videos</Text>

      {latestVideos && latestVideos.length > 0 ? (
        latestVideos.map((video) => (
          <HorizontalVideoCard
            key={video.id}
            thumbnailSource={{ uri: video.thumbnail }}
            duration={formatDuration(video.duration)}
            title={video.title}
            channelName={channel.name}
            viewCount={`${video.views || 0} views`}
            timeAgo={video.uploadDate}
            onPress={() => handleVideoPress(video.id)}
            onMenuPress={() => handleMenuPress(video.id)}
          />
        ))
      ) : (
        <Text style={styles.emptyText}>No videos available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: fs(20),
    fontFamily: FONTS.bold,
    color: "#000000",
    marginTop: hp(10),
    marginBottom: hp(16),
  },
  emptyText: {
    textAlign: "center",
    color: "#737373",
    marginTop: hp(20),
    fontFamily: FONTS.regular,
  },
});
