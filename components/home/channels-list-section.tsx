import { useChannels } from "@/hooks/queries/useHomepageQueries";
import { channelService } from "@/services/channel.service";
import { FONTS } from "@/styles/global";
import { borderRadius, dimensions, fs, MAX_PHONE_WIDTH, spacing, wp } from "@/utils/responsive";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Skeleton } from "../skeleton";

export function ChannelsListSection() {
  const { data: channelsData = [], isLoading } = useChannels(10);
  const [resolvingChannelId, setResolvingChannelId] = useState<string | null>(null);
  const { width: windowWidth } = useWindowDimensions();
  const useGrid = windowWidth > MAX_PHONE_WIDTH;
  const numColumns = useGrid ? 2 : 1;
  const columnGap = spacing.lg;
  const cardWidth = useGrid
    ? (windowWidth - spacing.xl * 2 - columnGap) / numColumns
    : undefined;

  const handleChannelPress = (
    channelId: string,
    channelSlug: string,
    defaultLiveStreamId?: string,
  ) => async () => {
    try {
      setResolvingChannelId(channelId);

      if (defaultLiveStreamId) {
        router.push(`/live-video?liveStreamId=${defaultLiveStreamId}`);
        return;
      }

      const liveResponse = await channelService.getChannelLivestreams(
        channelSlug,
        10,
        "live",
      );
      const fallbackResponse = await channelService.getChannelLivestreams(
        channelSlug,
        10,
      );

      const liveStreamId =
        liveResponse.data?.[0]?.id ||
        fallbackResponse.data?.find((stream) => stream.status === "live")?.id ||
        fallbackResponse.data?.find(
          (stream) => stream.status === "scheduled" || stream.status === "ended",
        )?.id;

      if (!liveStreamId) {
        Alert.alert("No livestream found", "This channel has no stream available yet.");
        return;
      }

      router.push(`/live-video?liveStreamId=${liveStreamId}`);
    } catch {
      Alert.alert("Unable to open channel", "Could not load this livestream right now.");
    } finally {
      setResolvingChannelId(null);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Skeleton
            width={wp(110)}
            height={dimensions.isTablet ? fs(28) : fs(20)}
            borderRadius={borderRadius.xs}
          />
          <Skeleton
            width={wp(58)}
            height={fs(22)}
            borderRadius={borderRadius.full}
          />
        </View>
        <View style={styles.listContainer}>
          {[1, 2, 3].map((item) => (
            <View key={item} style={styles.skeletonCard}>
              <Skeleton width="100%" height={dimensions.isTablet ? 260 : 210} borderRadius={0} />
              <View style={styles.skeletonFooter}>
                <View style={styles.skeletonLogoPlaceholder}>
                  <Skeleton width="100%" height="100%" borderRadius={borderRadius.sm} />
                </View>
                <View style={styles.skeletonTextBlock}>
                  <Skeleton
                    width="60%"
                    height={dimensions.isTablet ? fs(18) : fs(15)}
                    borderRadius={borderRadius.xs}
                  />
                  <Skeleton
                    width="35%"
                    height={dimensions.isTablet ? fs(14) : fs(12)}
                    borderRadius={borderRadius.xs}
                    style={{ marginTop: spacing.xs }}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }

  const displayData = channelsData.map((channel) => ({
    id: channel.id,
    name:
      typeof channel.name === "string" && channel.name.trim().length > 0
        ? channel.name.trim()
        : typeof channel.slug === "string" && channel.slug.trim().length > 0
          ? channel.slug.trim()
          : "Channel",
    slug: channel.slug,
    defaultLiveStreamId: channel.defaultLiveStreamId,
    coverSource: channel.coverImageUrl
      ? ({ uri: channel.coverImageUrl } as ImageSourcePropType)
      : channel.logoUrl
        ? ({ uri: channel.logoUrl } as ImageSourcePropType)
        : (require("@/assets/logo/Logo.png") as ImageSourcePropType),
    logoSource: channel.logoUrl
      ? ({ uri: channel.logoUrl } as ImageSourcePropType)
      : (require("@/assets/logo/Logo.png") as ImageSourcePropType),
  }));

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Channels</Text>
        <View style={styles.liveChip}>
          <View style={styles.liveChipDot} />
          <Text style={styles.liveChipText}>LIVE</Text>
        </View>
      </View>

      {displayData.length === 0 && (
        <Text style={styles.noDataText}>No channels available</Text>
      )}

      {displayData.length > 0 && (
        <View style={[styles.listContainer, useGrid && styles.listContainerGrid]}>
          {displayData.map((channel) => {
            const isResolving = resolvingChannelId === channel.id;
            return (
              <Pressable
                key={channel.id}
                style={({ pressed }) => [
                  styles.card,
                  useGrid && { width: cardWidth },
                  (pressed || isResolving) && styles.cardPressed,
                ]}
                onPress={handleChannelPress(
                  channel.id,
                  channel.slug,
                  channel.defaultLiveStreamId,
                )}
                disabled={isResolving}
              >
                {/* Thumbnail */}
                <View style={styles.thumbnailWrapper}>
                  <Image
                    source={channel.coverSource}
                    style={styles.thumbnail}
                    resizeMode="cover"
                  />
                  {/* LIVE badge */}
                  <View style={styles.liveBadge}>
                    <View style={styles.liveBadgeDot} />
                    <Text style={styles.liveBadgeText}>LIVE</Text>
                  </View>
                </View>

                {/* Footer row: logo + name + arrow */}
                <View style={styles.cardFooter}>
                  <View style={styles.logoBox}>
                    <Image
                      source={channel.logoSource}
                      style={styles.channelLogo}
                      resizeMode="contain"
                    />
                  </View>
                  <View style={styles.footerText}>
                    <Text style={styles.channelName} numberOfLines={1}>
                      {channel.name}
                    </Text>
                    <Text style={styles.watchNow}>Watch Now</Text>
                  </View>
                  <View style={styles.arrowIcon}>
                    <Text style={styles.arrowText}>›</Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xxl,
    marginBottom: spacing.xxl,
    paddingHorizontal: spacing.xl,
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

  /* ── List ── */
  listContainer: {
    gap: spacing.lg,
  },
  listContainerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  /* ── Card ── */
  card: {
    width: "100%",
    borderRadius: borderRadius.xl,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    shadowColor: "#94A3B8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  cardPressed: {
    opacity: 0.8,
    shadowOpacity: 0.08,
    elevation: 2,
  },

  /* ── Thumbnail ── */
  thumbnailWrapper: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#F1F5F9",
    position: "relative",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
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

  /* ── Footer ── */
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  logoBox: {
    width: dimensions.isTablet ? wp(44) : wp(38),
    height: dimensions.isTablet ? wp(44) : wp(38),
    borderRadius: borderRadius.sm,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    padding: wp(4),
  },
  channelLogo: {
    width: "100%",
    height: "100%",
  },
  footerText: {
    flex: 1,
  },
  channelName: {
    fontSize: dimensions.isTablet ? fs(16) : fs(14),
    fontFamily: FONTS.bold,
    color: "#0F172A",
  },
  watchNow: {
    fontSize: dimensions.isTablet ? fs(13) : fs(11),
    fontFamily: FONTS.regular,
    color: "#64748B",
    marginTop: wp(2),
  },
  arrowIcon: {
    width: wp(28),
    height: wp(28),
    borderRadius: borderRadius.full,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  arrowText: {
    fontSize: fs(18),
    color: "#64748B",
    lineHeight: fs(22),
  },

  /* ── Skeleton ── */
  skeletonCard: {
    width: "100%",
    borderRadius: borderRadius.xl,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#94A3B8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  skeletonFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  skeletonLogoPlaceholder: {
    width: wp(38),
    height: wp(38),
    borderRadius: borderRadius.sm,
    overflow: "hidden",
  },
  skeletonTextBlock: {
    flex: 1,
    gap: spacing.xs,
  },

  /* ── Empty ── */
  noDataText: {
    fontSize: dimensions.isTablet ? fs(16) : fs(14),
    fontFamily: FONTS.regular,
    color: "#94A3B8",
    marginBottom: spacing.sm,
  },
});
