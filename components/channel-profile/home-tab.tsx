import { VideoRecommendationCard } from "@/components/channel-profile/video-recommendation-card";
import { EmptyState } from "@/components/empty-state";
import { HorizontalVideoCard } from "@/components/program-profile/horizontal-video-card";
import {
  useAddToWatchlist,
  useRemoveFromWatchlist,
  useWatchlist,
} from "@/hooks/queries/useUserQueries";
import { useVideoDuration } from "@/hooks/useVideoDuration";
import { FONTS } from "@/styles/global";
import { ChannelDetail } from "@/types/api.types";
import { formatDuration, formatRelativeTime } from "@/utils/formatters";
import { fs, hp } from "@/utils/responsive";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ImageSourcePropType,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type AnyVideo = {
  id: string;
  playbackUrl?: string;
  durationSeconds?: number;
  duration?: number;
  thumbnailUrl?: string;
  thumbnail?: string;
  title: string;
  viewCount?: number;
  views?: number;
  publishedAt?: string;
  uploadDate?: string;
};

type LatestVideoItemProps = {
  video: AnyVideo;
  channelName: string;
  onPress: () => void;
  onMenuPress: () => void;
};

function LatestVideoItem({ video, channelName, onPress, onMenuPress }: LatestVideoItemProps) {
  const storedDuration = video.durationSeconds ?? video.duration;
  const duration = useVideoDuration(video.playbackUrl, storedDuration);
  const thumbnailUrl = video.thumbnailUrl || video.thumbnail;
  return (
    <HorizontalVideoCard
      thumbnailSource={
        thumbnailUrl
          ? ({ uri: thumbnailUrl } as ImageSourcePropType)
          : (require("@/assets/images/Image-11.png") as ImageSourcePropType)
      }
      duration={formatDuration(duration)}
      title={video.title}
      channelName={channelName}
      viewCount={`${video.viewCount ?? video.views ?? 0} views`}
      timeAgo={
        video.publishedAt || video.uploadDate
          ? formatRelativeTime((video.publishedAt || video.uploadDate)!)
          : "moments ago"
      }
      onPress={onPress}
      onMenuPress={onMenuPress}
    />
  );
}

type FeaturedVideoItemProps = {
  video: AnyVideo;
  channel: ChannelDetail['channel'];
  onPress: () => void;
  onMenuPress: () => void;
};

function FeaturedVideoItem({ video, channel, onPress, onMenuPress }: FeaturedVideoItemProps) {
  const storedDuration = video.durationSeconds ?? video.duration;
  const duration = useVideoDuration(video.playbackUrl, storedDuration);
  const thumbnailUrl = video.thumbnailUrl || video.thumbnail;
  return (
    <VideoRecommendationCard
      thumbnailSource={
        thumbnailUrl
          ? ({ uri: thumbnailUrl } as ImageSourcePropType)
          : (require("@/assets/images/Image-11.png") as ImageSourcePropType)
      }
      title={video.title}
      channelAvatar={
        (channel.logoUrl || channel.avatar)
          ? { uri: channel.logoUrl || channel.avatar }
          : require("@/assets/logo/Logo.png")
      }
      channelName={channel.name}
      viewCount={`${video.viewCount ?? video.views ?? 0} views`}
      timeAgo={
        video.publishedAt || video.uploadDate
          ? formatRelativeTime((video.publishedAt || video.uploadDate)!)
          : "moments ago"
      }
      isLive={false}
      duration={formatDuration(duration)}
      onPress={onPress}
      onMenuPress={onMenuPress}
    />
  );
}

type HomeTabProps = {
  detail: ChannelDetail;
};

export function HomeTab({ detail }: HomeTabProps) {
  const router = useRouter();
  const { channel, latestVideos } = detail;
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
  const hasVideos = (latestVideos?.length || 0) > 0;
  const featured = latestVideos?.[0];
  const latest = latestVideos?.slice(1) || [];

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

      {featured && (
        <FeaturedVideoItem
          video={featured}
          channel={channel}
          onPress={() => handleVideoPress(featured.id)}
          onMenuPress={() => handleMenuPress(featured.id)}
        />
      )}

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
            <LatestVideoItem
              key={video.id}
              video={video}
              channelName={channel.name}
              onPress={() => handleVideoPress(video.id)}
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
    color: "#000000",
    marginTop: hp(10),
    marginBottom: hp(16),
  },
});
