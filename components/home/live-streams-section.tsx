import { useLiveStreams } from "@/hooks/queries/useHomepageQueries";
import { FONTS } from "@/styles/global";
import { dimensions, fs, spacing } from "@/utils/responsive";
import { router } from "expo-router";
import {
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { VideoCard } from "./video-card";

export function LiveStreamsSection() {
  const { data: livestreams = [] } = useLiveStreams(10);

  const handlePress = (liveStreamId?: string) => {
    if (!liveStreamId) return;
    router.push(`/live-video?liveStreamId=${liveStreamId}`);
  };

  if (livestreams.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Live Streams</Text>
      </View>

      <View style={styles.grid}>
        {livestreams.map((stream) => (
          <View key={stream.id} style={styles.cardWrapper}>
            <VideoCard
              imageSource={
                (stream.thumbnailUrl || stream.channel?.coverImageUrl
                  ? ({
                      uri: stream.thumbnailUrl || stream.channel?.coverImageUrl,
                    } as ImageSourcePropType)
                  : (require("@/assets/images/carusel-2.png") as ImageSourcePropType))
              }
              title={stream.title}
              badgeLabel={stream.isLive ? "Live" : "Stream"}
              badgeColor={stream.isLive ? "#DC2626" : "#2563EB"}
              showBadge={true}
              fitToContainer
              onPress={() => handlePress(stream.liveStreamId)}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

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
