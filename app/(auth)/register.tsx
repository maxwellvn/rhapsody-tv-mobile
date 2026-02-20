import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function RegisterRedirectScreen() {
  const router = useRouter();

  useEffect(() => {
    router.replace({ pathname: "/(auth)/signin", params: { tab: "register" } });
  }, [router]);

  return null;
}
