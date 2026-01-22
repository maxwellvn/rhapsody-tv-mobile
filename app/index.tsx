import { useAuth } from "@/context/AuthContext";
import { hp, wp } from "@/utils/responsive";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";

// Keep the native splash screen visible while we load
SplashScreen.preventAutoHideAsync();

export default function CustomSplashScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      // Wait for auth loading to complete
      if (authLoading) return;

      // Hide native splash screen
      await SplashScreen.hideAsync();

      // Small delay to ensure splash is hidden
      setTimeout(() => {
        if (isAuthenticated) {
          router.replace("/(tabs)");
        } else {
          router.replace("/onboarding");
        }
        setHasRedirected(true);
      }, 500);
    };

    checkAuthAndRedirect();
  }, [authLoading, isAuthenticated, router]);

  // Prevent showing splash content if already redirected
  if (hasRedirected) return null;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#ffffff" translucent={false} />

      <Image
        source={require("@/assets/logo/Logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: wp(261),
    height: hp(56),
    maxWidth: 261,
    maxHeight: 56,
  },
});
