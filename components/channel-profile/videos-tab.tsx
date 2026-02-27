import { AppSpinner } from "@/components/app-spinner";
import { HorizontalVideoCard } from "@/components/program-profile/horizontal-video-card";
import { EmptyState } from "@/components/empty-state";
import { useChannelVideos } from "@/hooks/queries/useChannelQueries";
import {
  useAddToWatchlist,
  useRemoveFromWatchlist,
  useWatchlist,
} from "@/hooks/queries/useUserQueries";
import { useVideoDuration } from "@/hooks/useVideoDuration";
import { FONTS } from "@/styles/global";
import { ChannelVideoListItemDto } from "@/types/api.types";
import { formatDuration, formatRelativeTime } from "@/utils/formatters";
import { fs, hp } from "@/utils/responsive";
import { useRouter } from "expo-router";
import { memo, useState } from "react";
import {
  ActivityIndicator,
  ImageSourcePropType,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type ChannelVideoItemProps = {
  video: ChannelVideoListItemDto;
  channelSlug: string;
  onPress: () => void;
  onMenuPress: () => void;
};

const ChannelVideoItem = memo(function ChannelVideoItem({ video, channelSlug, onPress, onMenuPress }: ChannelVideoItemProps) {
  const duration = useVideoDuration(video.playbackUrl, video.durationSeconds);
  return (
    <HorizontalVideoCard
      thumbnailSource={
        video.thumbnailUrl
          ? ({ uri: video.thumbnailUrl } as ImageSourcePropType)
          : (require("@/assets/images/Image-11.png") as ImageSourcePropType)
      }
      duration={formatDuration(duration)}
      title={video.title}
      programName={video.program?.title}
      channelName={channelSlug}
      viewCount={`${video.viewCount ?? 0} views`}
      timeAgo={video.publishedAt ? formatRelativeTime(video.publishedAt) : "moments ago"}
      onPress={onPress}
      onMenuPress={onMenuPress}
    />
  );
});

type VideosTabProps = {
  slug: string;
};

export function VideosTab({ slug }: VideosTabProps) {
  const router = useRouter();
  const { data, isLoading } = useChannelVideos(slug);
  const { data: watchlistData } = useWatchlist(1, 200);
  const { mutateAsync: addToWatchlist } = useAddToWatchlist();
  const { mutateAsync: removeFromWatchlist } = useRemoveFromWatchlist();
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const isSelectedVideoInWatchlist = !!(
    selectedVideoId &&
    watchlistData?.items?.some((item) => item.video?.id === selectedVideoId)
  );

  const handleVideoPress = (videoId: string) => {
    router.push(`/video?id=${videoId}`);
  };

  const handleMenuPress = (videoId: string) => {
    setSelectedVideoId(videoId);
    setMenuVisible(true);
  };

  const handleToggleWatchlist = async () => {
    if (!selectedVideoId) return;
    try {
      if (isSelectedVideoInWatchlist) {
        await removeFromWatchlist(selectedVideoId);
      } else {
        await addToWatchlist({ videoId: selectedVideoId });
      }
    } finally {
      setMenuVisible(false);
      setSelectedVideoId(null);
    }
  };

  const handleCloseMenu = () => {
    setMenuVisible(false);
    setSelectedVideoId(null);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <AppSpinner size="small" color="#1A237E" />
      </View>
    );
  }

  const videos = data?.videos || [];

  return (
    <View style={styles.container}>
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseMenu}
      >
        <Pressable style={styles.menuOverlay} onPress={handleCloseMenu}>
          <Pressable style={styles.menuSheet} onPress={() => undefined}>
            <Text style={styles.menuTitle}>Video options</Text>
            <Pressable style={styles.menuItem} onPress={handleToggleWatchlist}>
              <Text style={styles.menuItemText}>
                {isSelectedVideoInWatchlist
                  ? "Remove from Watchlist"
                  : "Add to Watchlist"}
              </Text>
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
          <ChannelVideoItem
            key={video.id}
            video={video}
            channelSlug={slug}
            onPress={() => handleVideoPress(video.id)}
            onMenuPress={() => handleMenuPress(video.id)}
          />
        ))
      ) : (
        <EmptyState
          iconName="videocam-outline"
          title="No videos yet"
          subtitle="New uploads from this channel will appear here."
        />
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
    backgroundColor: "rgba(0, 0, 0, 0.16)",
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
});
