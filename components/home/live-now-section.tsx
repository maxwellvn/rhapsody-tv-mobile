import { useLiveNow } from "@/hooks/queries/useHomepageQueries";
import { FONTS } from "@/styles/global";
import {
  borderRadius,
  dimensions,
  fs,
  hp,
  spacing,
  wp,
} from "@/utils/responsive";
import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Badge } from "../badge";
import { LiveNowSkeleton } from "../skeleton";

export function LiveNowSection() {
  const router = useRouter();
  const { data: liveNowData, isLoading } = useLiveNow();

  const handleLivePress = () => {
    if (liveNowData?.liveStreamId) {
      console.log("liveNowData", liveNowData);
      router.push(
        `/live-video?liveStreamId=${liveNowData.liveStreamId}`,
        // `/live-video?id=${liveNowData.videoId}&liveStreamId=${liveNowData.liveStreamId}`,
      );
    }
  };

  // Show loading state with skeleton
  if (isLoading) {
    return <LiveNowSkeleton />;
  }

  // Show empty state if no live program is available
  if (!liveNowData) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Live Now</Text>
          <View style={styles.redDot} />
        </View>
        <View style={[styles.noDataContainer, { marginBottom: 0 }]}>
          <Text style={styles.noDataText}>No live programs currently</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Live Now</Text>
        {liveNowData.isLive && <View style={styles.redDot} />}
      </View>

      {/* Live Video Card */}
      <Pressable onPress={handleLivePress} style={styles.videoCard}>
        <Image
          source={
            liveNowData.thumbnailUrl
              ? { uri: liveNowData.thumbnailUrl }
              : liveNowData.channel?.coverImageUrl
              ? { uri: liveNowData.channel.coverImageUrl }
              : require("@/assets/images/carusel-2.png")
          }
          style={styles.thumbnail}
          resizeMode="contain"
        />
        {liveNowData.isLive && (
          <View style={styles.liveBadgeContainer}>
            <Badge label="Live" dotColor="#FF0000" />
          </View>
        )}
        {/* Program Info Overlay */}
        <View style={styles.infoOverlay}>
          <Text style={styles.programTitle} numberOfLines={2}>
            {liveNowData.title}
          </Text>
          {liveNowData.description && (
            <Text style={styles.programDescription} numberOfLines={2}>
              {liveNowData.description}
            </Text>
          )}
          {liveNowData.channel?.name && (
            <Text style={styles.channelName}>{liveNowData.channel.name}</Text>
          )}
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xxl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  title: {
    fontSize: dimensions.isTablet ? fs(24) : fs(20),
    fontFamily: FONTS.bold,
    color: "#000000",
    marginRight: spacing.xs,
  },
  redDot: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: "#FF0000",
  },
  videoCard: {
    position: "relative",
    borderRadius: borderRadius.lg,
    overflow: "hidden",
  },
  thumbnail: {
    width: "100%",
    height: dimensions.isTablet ? hp(250) : hp(200),
  },
  liveBadgeContainer: {
    position: "absolute",
    top: spacing.md,
    left: spacing.md,
    zIndex: 2,
  },
  infoOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: spacing.lg,
    zIndex: 1,
  },
  programTitle: {
    fontSize: dimensions.isTablet ? fs(20) : fs(18),
    fontFamily: FONTS.bold,
    color: "#FFFFFF",
    marginBottom: spacing.xs,
  },
  programDescription: {
    fontSize: dimensions.isTablet ? fs(16) : fs(14),
    fontFamily: FONTS.regular,
    color: "#FFFFFF",
    opacity: 0.9,
    marginBottom: spacing.sm,
  },
  channelName: {
    fontSize: dimensions.isTablet ? fs(14) : fs(12),
    fontFamily: FONTS.semibold,
    color: "#FFFFFF",
    opacity: 0.8,
  },
  noDataContainer: {
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
  },
  noDataText: {
    fontSize: dimensions.isTablet ? fs(16) : fs(14),
    fontFamily: FONTS.regular,
    color: "#666666",
    textAlign: "center",
  },
});
