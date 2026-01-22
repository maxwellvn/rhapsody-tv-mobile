import { HorizontalVideoCard } from "@/components/program-profile/horizontal-video-card";
import { useChannelVideos } from "@/hooks/queries/useChannelQueries";
import { FONTS } from "@/styles/global";
import { fs, hp } from "@/utils/responsive";
import { useRouter } from "expo-router";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

type VideosTabProps = {
  slug: string;
};

export function VideosTab({ slug }: VideosTabProps) {
  const router = useRouter();
  const { data, isLoading } = useChannelVideos(slug);

  const handleVideoPress = (videoId: string) => {
    router.push(`/video?id=${videoId}`);
  };

  const handleMenuPress = (videoId: string) => {
    console.log("Menu pressed for:", videoId);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#1A237E" />
      </View>
    );
  }

  const videos = data?.videos || [];

  return (
    <View style={styles.container}>
      {/* Latest Videos Section */}
      <Text style={styles.sectionTitle}>Latest Videos</Text>

      {videos.length > 0 ? (
        videos.map((video) => (
          <HorizontalVideoCard
            key={video.id}
            thumbnailSource={{ uri: video.thumbnail }}
            duration={`${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, "0")}`}
            title={video.title}
            channelName={video.channel.name} // Assuming video object has channel name or we can pass it
            viewCount={`${video.views || 0} views`}
            timeAgo={video.uploadDate}
            onPress={() => handleVideoPress(video.id)}
            onMenuPress={() => handleMenuPress(video.id)}
          />
        ))
      ) : (
        <Text style={styles.emptyText}>No videos found</Text>
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
    marginBottom: hp(16),
  },
  loadingContainer: {
    padding: hp(40),
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#737373",
    marginTop: hp(20),
    fontFamily: FONTS.regular,
  },
});
