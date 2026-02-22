import { HorizontalVideoCard } from "@/components/program-profile/horizontal-video-card";
import { VideoRecommendationCard } from "@/components/video-recommendation-card";
import { EmptyState } from "@/components/empty-state";
import { DEFAULT_PROFILE_AVATAR } from "@/constants/avatar";
import {
  useAddToWatchlist,
  useRemoveFromWatchlist,
  useWatchlist,
} from "@/hooks/queries/useUserQueries";
import { useVideoDuration } from "@/hooks/useVideoDuration";
import { FONTS } from "@/styles/global";
import { ChannelVideoListItemDto } from "@/types/api.types";
import { formatDuration, formatNumber, formatRelativeTime } from "@/utils/formatters";
import { fs, hp } from "@/utils/responsive";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type ProgramLatestVideoItemProps = {
  video: ChannelVideoListItemDto;
  channelName: string;
  onPress: () => void;
  onMenuPress: () => void;
};

function ProgramLatestVideoItem({
  video,
  channelName,
  onPress,
  onMenuPress,
}: ProgramLatestVideoItemProps) {
  const duration = useVideoDuration(video.playbackUrl, video.durationSeconds);
  return (
    <HorizontalVideoCard
      thumbnailSource={
        video.thumbnailUrl
          ? { uri: video.thumbnailUrl }
          : require("@/assets/images/Image-11.png")
      }
      duration={formatDuration(duration)}
      title={video.title}
      channelName={channelName}
      viewCount={`${formatNumber(video.viewCount || 0)} views`}
      timeAgo={video.publishedAt ? formatRelativeTime(video.publishedAt) : "moments ago"}
      onPress={onPress}
      onMenuPress={onMenuPress}
    />
  );
}

type HomeTabProps = {
  videos: ChannelVideoListItemDto[];
  channelName: string;
  channelAvatarUrl?: string;
  onVideoPress: (videoId: string) => void;
};

export function HomeTab({
  videos,
  channelName,
  channelAvatarUrl,
  onVideoPress,
}: HomeTabProps) {
  const { data: watchlistData } = useWatchlist(1, 200);
  const { mutateAsync: addToWatchlist } = useAddToWatchlist();
  const { mutateAsync: removeFromWatchlist } = useRemoveFromWatchlist();
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const isSelectedVideoInWatchlist = !!(
    selectedVideoId &&
    watchlistData?.items?.some((item) => item.video?.id === selectedVideoId)
  );
  const hasVideos = videos.length > 0;
  const featured = videos[0];
  const latest = videos.slice(1);
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

      {featured ? (
        <VideoRecommendationCard
          thumbnailSource={
            featured.thumbnailUrl
              ? { uri: featured.thumbnailUrl }
              : require("@/assets/images/Image-11.png")
          }
          title={featured.title}
          channelAvatar={
            channelAvatarUrl ? { uri: channelAvatarUrl } : DEFAULT_PROFILE_AVATAR
          }
          channelName={channelName}
          viewCount={`${formatNumber(featured.viewCount || 0)} views`}
          timeAgo={
            featured.publishedAt
              ? formatRelativeTime(featured.publishedAt)
              : "moments ago"
          }
          onPress={() => onVideoPress(featured.id)}
          onMenuPress={() => handleMenuPress(featured.id)}
        />
      ) : null}

      {!hasVideos ? (
        <EmptyState
          iconName="videocam-outline"
          title="No videos yet"
          subtitle="Featured videos and latest uploads will appear here."
        />
      ) : (
        <>
          {latest.length > 0 && <Text style={styles.sectionTitle}>Latest Videos</Text>}
          {latest.map((video) => (
            <ProgramLatestVideoItem
              key={video.id}
              video={video}
              channelName={channelName}
              onPress={() => onVideoPress(video.id)}
              onMenuPress={() => handleMenuPress(video.id)}
            />
          ))}
        </>
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
    color: '#000000',
    marginTop: hp(10),
    marginBottom: hp(16),
  },
});
