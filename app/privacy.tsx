import { FONTS } from "@/styles/global";
import { fs, hp, spacing, wp } from "@/utils/responsive";
import { router, Stack } from "expo-router";
import { Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrivacyScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={8}>
            <Image
              source={require("@/assets/Icons/back.png")}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </Pressable>
          <Text style={styles.headerTitle}>Privacy</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.title}>Privacy Settings</Text>
            <Text style={styles.body}>
              Your account privacy controls are managed by your account permissions and app
              notification settings. You can adjust notification preferences in Settings{" > "}
              Notifications.
            </Text>
            <Text style={styles.body}>
              Avatar, profile details, and account data are only visible where your user profile
              appears in the app.
            </Text>
          </View>
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingTop: hp(10),
    paddingBottom: hp(12),
    backgroundColor: "#FFFFFF",
  },
  backButton: { padding: wp(4) },
  backIcon: { width: wp(24), height: hp(24), tintColor: "#000000" },
  headerTitle: {
    flex: 1,
    fontSize: fs(20),
    fontFamily: FONTS.bold,
    color: "#000000",
    marginLeft: spacing.md,
  },
  headerSpacer: { width: wp(32) },
  scrollView: { flex: 1 },
  section: {
    backgroundColor: "#FFFFFF",
    marginTop: hp(10),
    marginHorizontal: spacing.xl,
    borderRadius: wp(12),
    padding: spacing.xl,
    gap: hp(10),
  },
  title: { fontSize: fs(16), fontFamily: FONTS.semibold, color: "#111827" },
  body: { fontSize: fs(14), fontFamily: FONTS.regular, color: "#374151", lineHeight: fs(20) },
  bottomSpacer: { height: hp(20) },
});
