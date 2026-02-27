import { BottomNav } from "@/components/bottom-nav";
import { ChannelCard as DiscoverChannelCard } from "@/components/discover/channel-card";
import { VideoCard as DiscoverVideoCard } from "@/components/discover/video-card";
import { AllVideosSection } from "@/components/home/all-videos-section";
import { ContinueWatchingSection } from "@/components/home/continue-watching-section";
import { FeaturedVideosSection } from "@/components/home/featured-videos-section";
import { LiveStreamsSection } from "@/components/home/live-streams-section";
import { ProgramsSection } from "@/components/home/programs-section";
import { SearchBar } from "@/components/search-bar";
import { Skeleton } from "@/components/skeleton";
import {
  homepageKeys,
  useUnifiedSearch,
} from "@/hooks/queries/useHomepageQueries";
import { useUnreadNotificationCount } from "@/hooks/queries/useNotificationQueries";
import { vodKeys } from "@/hooks/queries/useVodQueries";
import { FONTS } from "@/styles/global";
import { borderRadius, dimensions, fs, spacing, wp } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ReactNode, memo, useCallback, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image as ExpoImage } from "expo-image";
import { Image as RNImage } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

/* ─── Filter categories ─── */
const CATEGORIES = ["All", "Live", "Programs", "Videos", "Featured"] as const;
type Category = (typeof CATEGORIES)[number];

const CATEGORY_ICONS: Record<Category, keyof typeof Ionicons.glyphMap> = {
  All: "apps-outline",
  Live: "radio-outline",
  Programs: "calendar-outline",
  Videos: "play-circle-outline",
  Featured: "star-outline",
};

/* ─── Helpers ─── */
const fallbackImage = require("@/assets/images/carusel-2.png");
const fallbackLogo = require("@/assets/logo/Logo.png");
const imgSrc = (
  url?: string | null,
  type: "media" | "logo" = "media",
): string | number => {
  if (url) return url;
  return type === "logo" ? fallbackLogo : fallbackImage;
};

const blurhash = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

/* ─── Search Result Row ─── */
const SearchResultRow = memo(function SearchResultRow({
  title,
  subtitle,
  badgeLabel,
  badgeColor = "#2563EB",
  imageSource,
  thumbnailVariant = "media",
  onPress,
}: {
  title: string;
  subtitle?: string;
  badgeLabel?: string;
  badgeColor?: string;
  imageSource: string | number;
  thumbnailVariant?: "media" | "logo";
  onPress?: () => void;
}) {
  const isLogo = thumbnailVariant === "logo";
  const source = typeof imageSource === 'string' ? { uri: imageSource } : imageSource;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [rowStyles.row, pressed && rowStyles.rowPressed]}
      android_ripple={{ color: "rgba(15,23,42,0.06)", borderless: false }}
    >
      <View style={[rowStyles.thumbWrap, isLogo && rowStyles.logoThumbWrap]}>
        <ExpoImage
          source={source}
          style={rowStyles.thumb}
          contentFit={isLogo ? "contain" : "cover"}
          placeholder={{ blurhash }}
          transition={150}
          cachePolicy="memory-disk"
        />
        {!!badgeLabel && (
          <View style={[rowStyles.badge, { backgroundColor: badgeColor }]}>
            <Text style={rowStyles.badgeText}>{badgeLabel}</Text>
          </View>
        )}
      </View>

      <View style={rowStyles.content}>
        <Text numberOfLines={2} style={rowStyles.title}>
          {title}
        </Text>
        {!!subtitle && (
          <Text numberOfLines={1} style={rowStyles.subtitle}>
            {subtitle}
          </Text>
        )}
      </View>

      <View style={rowStyles.chevronWrap}>
        <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
      </View>
    </Pressable>
  );
});

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: borderRadius.md,
    backgroundColor: "#FFFFFF",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    gap: spacing.md,
  },
  rowPressed: {
    backgroundColor: "#F8FAFC",
  },
  thumbWrap: {
    width: wp(92),
    aspectRatio: 16 / 9,
    borderRadius: borderRadius.sm,
    overflow: "hidden",
    backgroundColor: "#E2E8F0",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    position: "relative",
    flexShrink: 0,
  },
  logoThumbWrap: {
    width: wp(56),
    height: wp(56),
    aspectRatio: 1,
    borderRadius: borderRadius.sm,
    padding: wp(6),
    backgroundColor: "#F8FAFC",
  },
  thumb: {
    width: "100%",
    height: "100%",
  },
  badge: {
    position: "absolute",
    top: wp(4),
    left: wp(4),
    borderRadius: borderRadius.full,
    paddingHorizontal: wp(6),
    paddingVertical: wp(2),
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: fs(8),
    fontFamily: FONTS.bold,
    letterSpacing: 0.4,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: dimensions.isTablet ? fs(14) : fs(13),
    fontFamily: FONTS.semibold,
    color: "#0F172A",
    lineHeight: dimensions.isTablet ? fs(20) : fs(18),
  },
  subtitle: {
    marginTop: wp(2),
    fontSize: dimensions.isTablet ? fs(12) : fs(11),
    fontFamily: FONTS.regular,
    color: "#64748B",
  },
  chevronWrap: {
    width: wp(24),
    height: wp(24),
    borderRadius: wp(12),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
});

/* ─── Search Section Card ─── */
function SearchSectionCard({
  title,
  count,
  icon,
  iconColor,
  children,
}: {
  title: string;
  count: number;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  children: ReactNode;
}) {
  return (
    <View style={sectionStyles.container}>
      <View style={sectionStyles.header}>
        <View style={sectionStyles.left}>
          <View style={[sectionStyles.iconWrap, { backgroundColor: iconColor + "14" }]}>
            <Ionicons name={icon} size={16} color={iconColor} />
          </View>
          <Text style={sectionStyles.title}>{title}</Text>
        </View>
        <View style={sectionStyles.countChip}>
          <Text style={sectionStyles.count}>{count}</Text>
        </View>
      </View>

      <View style={sectionStyles.content}>{children}</View>
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: borderRadius.lg,
    backgroundColor: "#F8FAFC",
    padding: spacing.sm,
    gap: spacing.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xs,
    paddingTop: wp(2),
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(8),
    minWidth: 0,
    flex: 1,
    marginRight: spacing.sm,
  },
  iconWrap: {
    width: wp(28),
    height: wp(28),
    borderRadius: wp(14),
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: dimensions.isTablet ? fs(16) : fs(15),
    fontFamily: FONTS.bold,
    color: "#0F172A",
  },
  countChip: {
    minWidth: wp(24),
    height: wp(22),
    borderRadius: borderRadius.full,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp(8),
  },
  count: {
    fontSize: dimensions.isTablet ? fs(11) : fs(10),
    fontFamily: FONTS.bold,
    color: "#1D4ED8",
  },
  content: {
    gap: spacing.sm,
  },
});

/* ═══════════════════════════════════════════════
   MAIN SCREEN
   ═══════════════════════════════════════════════ */

export default function DiscoverScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ query?: string }>();
  const queryParam = typeof params.query === "string" ? params.query : "";
  const searchQuery = queryParam.trim();
  const unreadCount = useUnreadNotificationCount();

  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  /* ── Search data ── */
  const {
    data: searchData,
    isLoading: isSearching,
    isError: searchError,
  } = useUnifiedSearch(searchQuery, 20);

  const searchVideos = searchData?.videos ?? [];
  const searchChannels = searchData?.channels ?? [];
  const searchPrograms = searchData?.programs ?? [];
  const totalSearch =
    searchVideos.length + searchChannels.length + searchPrograms.length;

  /* ── Refresh ── */
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        queryClient.refetchQueries({ queryKey: homepageKeys.all }),
        queryClient.refetchQueries({ queryKey: vodKeys.all }),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [queryClient]);

  /* ── Navigation ── */
  const handleSearchSubmit = (text: string) => {
    const q = text.trim();
    if (!q) return;
    router.push(`/(tabs)/discover?query=${encodeURIComponent(q)}`);
  };

  const handleTabPress = (tab: string) => {
    if (tab === "Home") router.push("/(tabs)");
    else if (tab === "Schedule") router.push("/(tabs)/schedule");
    else if (tab === "Profile") router.push("/(tabs)/profile");
  };

  /* ── Filter visibility ── */
  const showLive = activeCategory === "All" || activeCategory === "Live";
  const showPrograms = activeCategory === "All" || activeCategory === "Programs";
  const showVideos = activeCategory === "All" || activeCategory === "Videos";
  const showFeatured = activeCategory === "All" || activeCategory === "Featured";

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <StatusBar style="dark" />

      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <RNImage
          source={require("@/assets/logo/Logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Pressable
          onPress={() => router.push("/notifications")}
          style={styles.notifBtn}
        >
          <RNImage
            source={require("@/assets/Icons/Bell.png")}
            style={styles.notifIcon}
            resizeMode="contain"
          />
          {unreadCount > 0 && (
            <View style={styles.notifBadge}>
              <Text style={styles.notifBadgeText}>
                {unreadCount > 99 ? "99+" : unreadCount}
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* ── Search ── */}
      <View style={styles.searchWrap}>
        <SearchBar
          placeholder="Search videos, channels, programs..."
          initialValue={queryParam}
          onSearch={(text) => {
            if (queryParam && !text.trim()) {
              router.replace("/(tabs)/discover");
            }
          }}
          onSubmit={handleSearchSubmit}
        />
      </View>

      {/* ── Category Chips (browse mode only) ── */}
      {!searchQuery && (
        <View style={styles.chipBarWrap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipScroll}
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <Pressable
                  key={cat}
                  onPress={() => setActiveCategory(cat)}
                  style={[styles.chip, isActive && styles.chipActive]}
                >
                  <Ionicons
                    name={CATEGORY_ICONS[cat]}
                    size={14}
                    color={isActive ? "#FFFFFF" : "#64748B"}
                    style={{ marginRight: wp(4) }}
                  />
                  <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                    {cat}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* ── Content ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollInner, { paddingBottom: 84 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {searchQuery ? (
          /* ════════ SEARCH RESULTS ════════ */
          <>
            {/* Header */}
            <View style={styles.searchHeader}>
              <View style={styles.searchHeaderLeft}>
                <View style={styles.searchHeaderIconWrap}>
                  <Ionicons name="search" size={16} color="#64748B" />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={styles.searchHeaderLabel} numberOfLines={1}>
                    Results for {searchQuery}
                  </Text>
                  <Text style={styles.searchHeaderSubLabel}>Tap a card to open details</Text>
                </View>
              </View>
              {!isSearching && !searchError && (
                <Text style={styles.searchHeaderCount}>
                  {totalSearch} found
                </Text>
              )}
            </View>

            {/* Loading skeleton */}
            {isSearching && (
              <View style={styles.skeletonWrap}>
                {[0, 1, 2, 3].map((i) => (
                  <View key={i} style={styles.skeletonRow}>
                    <Skeleton
                      width={wp(92)}
                      height={wp(52)}
                      borderRadius={borderRadius.sm}
                    />
                    <View style={{ flex: 1, gap: spacing.xs }}>
                      <Skeleton width="75%" height={fs(13)} borderRadius={borderRadius.xs} />
                      <Skeleton width="45%" height={fs(11)} borderRadius={borderRadius.xs} />
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Error */}
            {searchError && (
              <View style={styles.stateWrap}>
                <View style={styles.stateIconWrap}>
                  <Ionicons name="alert-circle-outline" size={36} color="#EF4444" />
                </View>
                <Text style={styles.stateTitle}>Something went wrong</Text>
                <Text style={styles.stateSubtitle}>
                  Pull down to refresh and try again.
                </Text>
              </View>
            )}

            {/* Empty */}
            {!isSearching && !searchError && totalSearch === 0 && (
              <View style={styles.stateWrap}>
                <View style={styles.stateIconWrap}>
                  <Ionicons name="search-outline" size={40} color="#CBD5E1" />
                </View>
                <Text style={styles.stateTitle}>No results found</Text>
                <Text style={styles.stateSubtitle}>
                  Try a different search term or browse categories.
                </Text>
              </View>
            )}

            {!isSearching && !searchError && totalSearch > 0 && (
              <View style={styles.searchResultsWrap}>
                {/* Video results */}
                {searchVideos.length > 0 && (
                  <SearchSectionCard
                    title="Videos"
                    count={searchVideos.length}
                    icon="play-circle-outline"
                    iconColor="#0284C7"
                  >
                    {searchVideos.map((item) => (
                      <SearchResultRow
                        key={`sv-${item.id}`}
                        title={item.title}
                        subtitle={item.channel?.name}
                        badgeLabel="VIDEO"
                        badgeColor="#0284C7"
                        imageSource={imgSrc(item.thumbnailUrl)}
                        onPress={() => router.push(`/video?id=${item.id}`)}
                      />
                    ))}
                  </SearchSectionCard>
                )}

                {/* Channel results */}
                {searchChannels.length > 0 && (
                  <SearchSectionCard
                    title="Channels"
                    count={searchChannels.length}
                    icon="tv-outline"
                    iconColor="#059669"
                  >
                    <View style={styles.searchCardGrid}>
                      {searchChannels.map((item) => (
                        <View key={`sc-${item.id}`} style={styles.searchCardGridItem}>
                          <DiscoverChannelCard
                            logoSource={imgSrc(item.logoUrl, "logo")}
                            channelName={item.name}
                            onPress={() =>
                              router.push(`/channel-profile?slug=${item.slug}`)
                            }
                          />
                        </View>
                      ))}
                    </View>
                  </SearchSectionCard>
                )}

                {/* Program results */}
                {searchPrograms.length > 0 && (
                  <SearchSectionCard
                    title="Programs"
                    count={searchPrograms.length}
                    icon="calendar-outline"
                    iconColor="#2563EB"
                  >
                    <View style={styles.searchCardGrid}>
                      {searchPrograms.map((item) => (
                        <View key={`sp-${item.id}`} style={styles.searchCardGridItem}>
                          <DiscoverVideoCard
                            imageSource={imgSrc(
                              item.thumbnailUrl || item.channel?.coverImageUrl,
                            )}
                            title={item.title}
                            badgeLabel={item.isLive ? "Live" : "Program"}
                            badgeColor={item.isLive ? "#EF4444" : "#2563EB"}
                            showBadge={true}
                            onPress={() =>
                              router.push(
                                `/program-profile?id=${item.id}${
                                  item.channel
                                    ? `&channelSlug=${item.channel.slug}&channelId=${item.channel.id}`
                                    : ""
                                }`,
                              )
                            }
                          />
                        </View>
                      ))}
                    </View>
                  </SearchSectionCard>
                )}
              </View>
            )}
          </>
        ) : (
          /* ════════ BROWSE MODE ════════ */
          <>
            {showVideos && <ContinueWatchingSection />}
            {showLive && <LiveStreamsSection />}
            {showPrograms && <ProgramsSection />}
            {showFeatured && <FeaturedVideosSection />}
            {showVideos && <AllVideosSection />}
          </>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>

      <BottomNav activeTab="Discover" onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

/* ═══════════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════════ */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
  },
  logo: {
    width: 150,
    height: 40,
  },
  notifBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  notifIcon: {
    width: 40,
    height: 40,
  },
  notifBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  notifBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },

  /* Search */
  searchWrap: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },

  /* Category chips */
  chipBarWrap: {
    flexShrink: 0,
    marginBottom: spacing.sm,
  },
  chipScroll: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(14),
    paddingVertical: wp(8),
    borderRadius: borderRadius.full,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  chipActive: {
    backgroundColor: "#1D4ED8",
    borderColor: "#1D4ED8",
  },
  chipText: {
    fontSize: dimensions.isTablet ? fs(13) : fs(12),
    fontFamily: FONTS.semibold,
    color: "#475569",
  },
  chipTextActive: {
    color: "#FFFFFF",
  },

  /* Scroll content */
  scroll: {
    flex: 1,
  },
  scrollInner: {
    paddingBottom: spacing.xxxl,
  },

  /* Search header */
  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: spacing.xl,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: borderRadius.lg,
    backgroundColor: "#F8FAFC",
    padding: spacing.sm,
    gap: spacing.sm,
  },
  searchHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flex: 1,
    minWidth: 0,
  },
  searchHeaderIconWrap: {
    width: wp(30),
    height: wp(30),
    borderRadius: wp(15),
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  searchHeaderLabel: {
    fontSize: dimensions.isTablet ? fs(16) : fs(14),
    fontFamily: FONTS.bold,
    color: "#0F172A",
  },
  searchHeaderSubLabel: {
    marginTop: wp(1),
    fontSize: dimensions.isTablet ? fs(12) : fs(11),
    fontFamily: FONTS.regular,
    color: "#64748B",
  },
  searchHeaderCount: {
    fontSize: dimensions.isTablet ? fs(13) : fs(12),
    fontFamily: FONTS.medium,
    color: "#1D4ED8",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: wp(10),
    paddingVertical: wp(4),
    borderRadius: borderRadius.full,
    overflow: "hidden",
  },
  searchResultsWrap: {
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  searchCardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: spacing.sm,
  },
  searchCardGridItem: {
    width: dimensions.isTablet ? "31.5%" : "48%",
  },

  /* Loading skeleton */
  skeletonWrap: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  skeletonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: borderRadius.md,
    backgroundColor: "#FFFFFF",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },

  /* Empty / error states */
  stateWrap: {
    alignItems: "center",
    paddingVertical: spacing.xxxl * 1.5,
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  stateIconWrap: {
    width: wp(72),
    height: wp(72),
    borderRadius: wp(36),
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  stateTitle: {
    fontSize: dimensions.isTablet ? fs(18) : fs(16),
    fontFamily: FONTS.bold,
    color: "#334155",
  },
  stateSubtitle: {
    fontSize: dimensions.isTablet ? fs(14) : fs(13),
    fontFamily: FONTS.regular,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: dimensions.isTablet ? fs(20) : fs(19),
  },
});
