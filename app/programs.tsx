import { AppSpinner } from "@/components/app-spinner";
import { usePrograms } from "@/hooks/queries/useHomepageQueries";
import { FONTS } from "@/styles/global";
import { fs, spacing } from "@/utils/responsive";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { memo, useCallback } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";

const blurhash = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

type ProgramItem = { id: string; title: string; thumbnailUrl?: string; channel?: { id?: string; slug?: string; name?: string; coverImageUrl?: string } };

const ProgramListItem = memo(function ProgramListItem({ program }: { program: ProgramItem }) {
  return (
    <Pressable
      style={styles.item}
      onPress={() =>
        router.push(
          `/program-profile?id=${program.id}&channelId=${program.channel?.id || ""}&channelSlug=${program.channel?.slug || ""}`,
        )
      }
    >
      <Image
        source={
          program.thumbnailUrl
            ? { uri: program.thumbnailUrl }
            : program.channel?.coverImageUrl
              ? { uri: program.channel.coverImageUrl }
              : require("@/assets/images/Image-4.png")
        }
        style={styles.thumb}
        contentFit="cover"
        placeholder={{ blurhash }}
        transition={200}
        cachePolicy="memory-disk"
      />
      <View style={styles.meta}>
        <Text style={styles.programTitle} numberOfLines={2}>
          {program.title}
        </Text>
        <Text style={styles.channelName} numberOfLines={1}>
          {program.channel?.name || "Program"}
        </Text>
      </View>
    </Pressable>
  );
});

export default function ProgramsPage() {
  const { data: programs = [], isLoading } = usePrograms(200);

  const renderItem = useCallback(({ item }: { item: ProgramItem }) => (
    <ProgramListItem program={item} />
  ), []);

  const keyExtractor = useCallback((item: ProgramItem) => item.id, []);

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
          <Text style={styles.title}>All Programs</Text>
        </View>

        {isLoading ? (
          <View style={styles.loaderWrap}>
            <AppSpinner size="large" color="#1D4ED8" />
          </View>
        ) : (
          <FlatList
            data={programs}
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
  list: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl, gap: spacing.md },
  item: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  thumb: { width: "100%", height: 190, backgroundColor: "#E5E7EB" },
  meta: { padding: spacing.md },
  programTitle: { fontSize: fs(16), fontFamily: FONTS.bold, color: "#0F172A" },
  channelName: { marginTop: 4, fontSize: fs(13), fontFamily: FONTS.regular, color: "#64748B" },
});
