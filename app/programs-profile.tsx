import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function ProgramsProfileAlias() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/program-profile");
  }, [router]);

  return null;
}
