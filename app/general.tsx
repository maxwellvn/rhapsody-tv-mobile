import { AppSpinner } from "@/components/app-spinner";
import { SettingsItemToggle } from "@/components/settings/settings-item-toggle";
import { SettingsSection } from "@/components/settings/settings-section";
import {
    useUpdateUserSettings,
    useUserSettings,
} from "@/hooks/queries/useUserQueries";
import { FONTS } from "@/styles/global";
import { fs, hp, spacing, wp } from "@/utils/responsive";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
    Image,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GeneralScreen() {
  const { data: settings, isLoading } = useUserSettings();
  const { mutate: updateSettings, isPending: isUpdating } =
    useUpdateUserSettings();

  const [autoRotate, setAutoRotate] = useState<boolean>(false);

  useEffect(() => {
    if (settings) {
      setAutoRotate(settings.general.autoRotateScreen);
    }
  }, [settings]);

  const handleBack = () => {
    router.back();
  };

  const handleAutoRotateChange = (value: boolean) => {
    setAutoRotate(value);
    updateSettings({
      general: {
        autoRotateScreen: value,
      },
    });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={handleBack} style={styles.backButton} hitSlop={8}>
            <Image
              source={require("@/assets/Icons/back.png")}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </Pressable>
          <Text style={styles.headerTitle}>General</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {(isLoading || isUpdating) && (
            <View style={styles.loadingContainer}>
              <AppSpinner size="small" color="#000" />
            </View>
          )}

          <SettingsSection>
            <SettingsItemToggle
              label="Auto-Rotate Screen"
              description="Your device will switch to landscape layout when rotated, if portrait lock is disabled."
              value={autoRotate}
              onValueChange={handleAutoRotateChange}
            />
          </SettingsSection>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingTop: hp(10),
    paddingBottom: hp(12),
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    padding: wp(4),
  },
  backIcon: {
    width: wp(24),
    height: hp(24),
    tintColor: "#000000",
  },
  headerTitle: {
    flex: 1,
    fontSize: fs(20),
    fontFamily: FONTS.bold,
    color: "#000000",
    marginLeft: spacing.md,
  },
  headerSpacer: {
    width: wp(32),
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: hp(8),
  },
  bottomSpacer: {
    height: hp(20),
  },
});
