import Loader from "@/components/loader";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { usePathname, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

const SHOW_DELAY_MS = 180;

// Keep the global, dismissible overlay off interactive payment flows.
const SUPPRESSED_ROUTES = ["/video", "/live-video", "/donate"];

export function GlobalLoader() {
  const fetchingCount = useIsFetching();
  const mutatingCount = useIsMutating();
  const pathname = usePathname();
  const router = useRouter();
  const isBusy = fetchingCount > 0 || mutatingCount > 0;
  const [visible, setVisible] = useState(false);
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isSuppressed = SUPPRESSED_ROUTES.some((r) => pathname.startsWith(r));

  useEffect(() => {
    if (isBusy && !isSuppressed) {
      if (showTimerRef.current) {
        clearTimeout(showTimerRef.current);
      }

      showTimerRef.current = setTimeout(() => {
        setVisible(true);
      }, SHOW_DELAY_MS);
      return;
    }

    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
    setVisible(false);
  }, [isBusy, isSuppressed]);

  useEffect(() => {
    return () => {
      if (showTimerRef.current) {
        clearTimeout(showTimerRef.current);
      }
    };
  }, []);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    if (router.canGoBack()) {
      router.back();
    }
  }, [router]);

  if (!visible) {
    return null;
  }

  return <Loader onDismiss={handleDismiss} />;
}
