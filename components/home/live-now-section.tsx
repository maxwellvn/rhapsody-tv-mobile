import { useLiveNow } from "@/hooks/queries/useHomepageQueries";
import { FONTS } from "@/styles/global";
import { borderRadius, dimensions, fs, spacing, wp } from "@/utils/responsive";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { LiveNowSkeleton } from "../skeleton";

export function LiveNowSection() {
  const router = useRouter();
  const { data: liveNowData, isLoading } = useLiveNow();

  const handleLivePress = () => {
    if (liveNowData?.liveStreamId) {
      router.push(`/live-video?liveStreamId=${liveNowData.liveStreamId}`);
    }
  };

  if (isLoading) {
    return <LiveNowSkeleton />;
  }

  if (!liveNowData) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Live Now</Text>
        </View>
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No live programs right now</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Live Now</Text>
        {liveNowData.isLive && (
          <View style={styles.liveChip}>
            <View style={styles.liveChipDot} />
            <Text style={styles.liveChipText}>LIVE</Text>
          </View>
        )}
      </View>

      {/* Card */}
      <Pressable
        onPress={handleLivePress}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      >
        {/* Thumbnail */}
        <Image
          source={
            liveNowData.thumbnailUrl
              ? { uri: liveNowData.thumbnailUrl }
              : liveNowData.channel?.coverImageUrl
              ? { uri: liveNowData.channel.coverImageUrl }
              : require("@/assets/images/carusel-2.png")
          }
          style={styles.thumbnail}
          resizeMode="cover"
        />

        {/* Gradient overlay */}
        <LinearGradient
          colors={["transparent", "rgba(15,23,42,0.82)"]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0.3 }}
          end={{ x: 0, y: 1 }}
        />

        {/* LIVE badge */}
        {liveNowData.isLive && (
          <View style={styles.liveBadge}>
            <View style={styles.liveBadgeDot} />
            <Text style={styles.liveBadgeText}>LIVE</Text>
          </View>
        )}

        {/* Info at bottom */}
        <View style={styles.infoOverlay}>
          <Text style={styles.programTitle} numberOfLines={2}>
            {liveNowData.title}
          </Text>
          {liveNowData.description ? (
            <Text style={styles.programDescription} numberOfLines={2}>
              {liveNowData.description}
            </Text>
          ) : null}
          {liveNowData.channel?.name ? (
            <Text style={styles.channelName}>{liveNowData.channel.name}</Text>
          ) : null}
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xxl,
  },

  /* ── Header ── */
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: dimensions.isTablet ? fs(24) : fs(20),
    fontFamily: FONTS.bold,
    color: "#0F172A",
  },
  liveChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(5),
    backgroundColor: "#FEE2E2",
    paddingHorizontal: wp(10),
    paddingVertical: wp(4),
    borderRadius: borderRadius.full,
  },
  liveChipDot: {
    width: wp(6),
    height: wp(6),
    borderRadius: wp(3),
    backgroundColor: "#EF4444",
  },
  liveChipText: {
    fontSize: fs(10),
    fontFamily: FONTS.bold,
    color: "#EF4444",
    letterSpacing: 0.6,
  },

  /* ── Card ── */
  card: {
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    shadowColor: "#94A3B8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 4,
  },
  cardPressed: {
    opacity: 0.85,
  },
  thumbnail: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#F1F5F9",
  },

  /* ── Overlays ── */
  liveBadge: {
    position: "absolute",
    top: spacing.md,
    left: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: wp(4),
    backgroundColor: "#EF4444",
    paddingHorizontal: wp(9),
    paddingVertical: wp(4),
    borderRadius: borderRadius.full,
  },
  liveBadgeDot: {
    width: wp(5),
    height: wp(5),
    borderRadius: wp(3),
    backgroundColor: "#FFFFFF",
  },
  liveBadgeText: {
    color: "#FFFFFF",
    fontSize: fs(10),
    fontFamily: FONTS.bold,
    letterSpacing: 0.6,
  },
  infoOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
  },
  programTitle: {
    fontSize: dimensions.isTablet ? fs(19) : fs(17),
    fontFamily: FONTS.bold,
    color: "#FFFFFF",
    marginBottom: wp(4),
  },
  programDescription: {
    fontSize: dimensions.isTablet ? fs(14) : fs(13),
    fontFamily: FONTS.regular,
    color: "rgba(255,255,255,0.82)",
    marginBottom: wp(4),
  },
  channelName: {
    fontSize: dimensions.isTablet ? fs(13) : fs(12),
    fontFamily: FONTS.semibold,
    color: "rgba(255,255,255,0.65)",
  },

  /* ── Empty ── */
  noDataContainer: {
    paddingVertical: spacing.sm,
  },
  noDataText: {
    fontSize: dimensions.isTablet ? fs(15) : fs(14),
    fontFamily: FONTS.regular,
    color: "#94A3B8",
  },
});
