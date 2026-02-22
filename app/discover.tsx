import { router } from "expo-router";
import { useEffect } from "react";

export default function DiscoverRedirectScreen() {
  useEffect(() => {
    router.replace("/(tabs)/discover");
  }, []);

  return null;
}
