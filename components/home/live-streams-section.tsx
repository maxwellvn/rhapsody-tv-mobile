import { memo } from "react";
import { useLiveStreams } from "@/hooks/queries/useHomepageQueries";
import { FONTS } from "@/styles/global";
import { dimensions, fs, spacing } from "@/utils/responsive";
import { router } from "expo-router";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { VideoCard } from "./video-card";

const fallbackImage = require("@/assets/images/carusel-2.png");

export const LiveStreamsSection = memo(function LiveStreamsSection() {
  const { data: livestreams = [] } = useLiveStreams(10);

  const handlePress = (liveStreamId?: string) => {
    if (!liveStreamId) return;
    router.push(`/live-video?liveStreamId=${liveStreamId}`);
  };

  if (livestreams.length === 0) {
    return null;
  }

  const displayData = livestreams.slice(0, 8);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Live Streams</Text>
        {livestreams.length > 8 && (
          <Pressable onPress={() => router.push("/live-streams")}>
            <Text style={styles.seeAllText}>See all</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.grid}>
        {displayData.map((stream) => (
          <View key={stream.id} style={styles.cardWrapper}>
            <VideoCard
              imageSource={
                stream.thumbnailUrl || stream.channel?.coverImageUrl || fallbackImage
              }
              title={stream.title}
              badgeLabel={stream.isLive ? "Live" : "Stream"}
              badgeColor={stream.isLive ? "#DC2626" : "#2563EB"}
              showBadge
              fitToContainer
              onPress={() => handlePress(stream.liveStreamId)}
            />
          </View>
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xxl,
    marginBottom: spacing.xxl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  title: {
    fontSize: dimensions.isTablet ? fs(24) : fs(20),
    fontFamily: FONTS.bold,
    color: "#0F172A",
  },
  seeAllText: {
    fontSize: dimensions.isTablet ? fs(14) : fs(13),
    fontFamily: FONTS.semibold,
    color: "#475569",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  cardWrapper: {
    width: dimensions.isTablet ? "31.5%" : "47.5%",
  },
});
