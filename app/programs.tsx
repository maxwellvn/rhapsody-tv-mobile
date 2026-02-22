import { AppSpinner } from "@/components/app-spinner";
import { usePrograms } from "@/hooks/queries/useHomepageQueries";
import { FONTS } from "@/styles/global";
import { fs, spacing } from "@/utils/responsive";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProgramsPage() {
  const { data: programs = [], isLoading } = usePrograms(200);

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
              resizeMode="contain"
            />
          </Pressable>
          <Text style={styles.title}>All Programs</Text>
        </View>

        {isLoading ? (
          <View style={styles.loaderWrap}>
            <AppSpinner size="large" color="#1D4ED8" />
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
            {programs.map((program) => (
              <Pressable
                key={program.id}
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
                  resizeMode="cover"
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
            ))}
          </ScrollView>
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
