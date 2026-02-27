import { AppSpinner } from "@/components/app-spinner";
import { useLiveStreams } from "@/hooks/queries/useHomepageQueries";
import { FONTS } from "@/styles/global";
import { LiveNowProgram } from "@/types/api.types";
import { fs, spacing } from "@/utils/responsive";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { memo, useCallback } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";

const blurhash = "L6PZfSi_.AyE_3t7t7R**0o#DgR4";

const LiveStreamItem = memo(function LiveStreamItem({
  stream,
}: {
  stream: LiveNowProgram;
}) {
  return (
    <Pressable
      style={styles.item}
      onPress={() => {
        if (stream.liveStreamId) {
          router.push(`/live-video?liveStreamId=${stream.liveStreamId}`);
        }
      }}
    >
      <View>
        <Image
          source={
            stream.thumbnailUrl || stream.channel?.coverImageUrl
              ? { uri: stream.thumbnailUrl || stream.channel?.coverImageUrl }
              : require("@/assets/images/carusel-2.png")
          }
          style={styles.thumb}
          contentFit="cover"
          placeholder={{ blurhash }}
          transition={200}
          cachePolicy="memory-disk"
        />
        {stream.isLive && (
          <View style={styles.liveBadge}>
            <Text style={styles.liveBadgeText}>Live</Text>
          </View>
        )}
      </View>
      <View style={styles.meta}>
        <Text style={styles.videoTitle} numberOfLines={2}>
          {stream.title}
        </Text>
        <Text style={styles.channelName} numberOfLines={1}>
          {stream.channel?.name || "Channel"}
        </Text>
      </View>
    </Pressable>
  );
});

export default function LiveStreamsPage() {
  const { data: livestreams = [], isLoading, isError } = useLiveStreams(50);

  const renderItem = useCallback(
    ({ item }: { item: LiveNowProgram }) => <LiveStreamItem stream={item} />,
    [],
  );

  const keyExtractor = useCallback((item: LiveNowProgram) => item.id, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Image
              source={require("@/assets/Icons/back.png")}
              style={styles.backIcon}
              contentFit="contain"
            />
          </Pressable>
          <Text style={styles.title}>Live Streams</Text>
        </View>

        {isLoading ? (
          <View style={styles.loaderWrap}>
            <AppSpinner size="large" color="#1D4ED8" />
          </View>
        ) : isError ? (
          <View style={styles.loaderWrap}>
            <Text style={styles.emptyText}>
              Unable to load live streams right now.
            </Text>
          </View>
        ) : livestreams.length === 0 ? (
          <View style={styles.loaderWrap}>
            <Text style={styles.emptyText}>No live streams available.</Text>
          </View>
        ) : (
          <FlatList
            data={livestreams}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            initialNumToRender={6}
            maxToRenderPerBatch={8}
            windowSize={5}
            removeClippedSubviews
          />
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  backButton: { padding: spacing.xs },
  backIcon: { width: 22, height: 22, tintColor: "#111827" },
  title: { fontSize: fs(22), fontFamily: FONTS.bold, color: "#0F172A" },
  loaderWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  list: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  item: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  thumb: { width: "100%", height: 190, backgroundColor: "#E5E7EB" },
  liveBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#DC2626",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  liveBadgeText: {
    fontSize: fs(11),
    fontFamily: FONTS.bold,
    color: "#FFFFFF",
  },
  meta: { padding: spacing.md },
  videoTitle: {
    fontSize: fs(16),
    fontFamily: FONTS.bold,
    color: "#0F172A",
  },
  channelName: {
    marginTop: 4,
    fontSize: fs(13),
    fontFamily: FONTS.regular,
    color: "#64748B",
  },
  emptyText: {
    fontSize: fs(14),
    fontFamily: FONTS.regular,
    color: "#64748B",
    textAlign: "center",
  },
});
