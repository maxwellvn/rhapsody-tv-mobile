import { HorizontalVideoCard } from "@/components/program-profile/horizontal-video-card";
import { useChannelVideos } from "@/hooks/queries/useChannelQueries";
import { useAddToWatchlist } from "@/hooks/queries/useUserQueries";
import { FONTS } from "@/styles/global";
import { formatDuration } from "@/utils/formatters";
import { fs, hp } from "@/utils/responsive";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type VideosTabProps = {
  slug: string;
};

export function VideosTab({ slug }: VideosTabProps) {
  const router = useRouter();
  const { data, isLoading } = useChannelVideos(slug);
  const { mutate: addToWatchlist } = useAddToWatchlist();
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  const handleVideoPress = (videoId: string) => {
    router.push(`/video?id=${videoId}`);
  };

  const handleMenuPress = (videoId: string) => {
    setSelectedVideoId(videoId);
    setMenuVisible(true);
  };

  const handleAddToWishlist = () => {
    if (selectedVideoId) {
      addToWatchlist({ videoId: selectedVideoId });
    }
    setMenuVisible(false);
    setSelectedVideoId(null);
  };

  const handleCloseMenu = () => {
    setMenuVisible(false);
    setSelectedVideoId(null);
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
      <Modal
        visible={menuVisible}
        transparent
        animationType="slide"
        onRequestClose={handleCloseMenu}
      >
        <Pressable style={styles.menuOverlay} onPress={handleCloseMenu}>
          <Pressable style={styles.menuSheet} onPress={() => undefined}>
            <Text style={styles.menuTitle}>Video options</Text>
            <Pressable style={styles.menuItem} onPress={handleAddToWishlist}>
              <Text style={styles.menuItemText}>Add to wishlist</Text>
            </Pressable>
            <Pressable
              style={[styles.menuItem, styles.menuCancel]}
              onPress={handleCloseMenu}
            >
              <Text style={styles.menuCancelText}>Cancel</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Latest Videos Section */}
      <Text style={styles.sectionTitle}>Latest Videos</Text>

      {videos.length > 0 ? (
        videos.map((video) => (
          <HorizontalVideoCard
            key={video.id}
            thumbnailSource={{ uri: video.thumbnailUrl || "" }}
            duration={formatDuration(video.durationSeconds)}
            title={video.title}
            channelName={slug}
            viewCount={`${video.viewCount ?? 0} views`}
            timeAgo={video.publishedAt || ""}
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
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  menuSheet: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: hp(20),
    paddingTop: hp(16),
    paddingBottom: hp(24),
    borderTopLeftRadius: hp(20),
    borderTopRightRadius: hp(20),
  },
  menuTitle: {
    fontSize: fs(16),
    fontFamily: FONTS.semibold,
    color: "#111111",
    marginBottom: hp(12),
  },
  menuItem: {
    paddingVertical: hp(12),
  },
  menuItemText: {
    fontSize: fs(16),
    fontFamily: FONTS.medium,
    color: "#1A237E",
  },
  menuCancel: {
    marginTop: hp(4),
  },
  menuCancelText: {
    fontSize: fs(16),
    fontFamily: FONTS.medium,
    color: "#666666",
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
