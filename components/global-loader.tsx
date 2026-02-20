import Loader from "@/components/loader";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

const SHOW_DELAY_MS = 180;

export function GlobalLoader() {
  const fetchingCount = useIsFetching();
  const mutatingCount = useIsMutating();
  const isBusy = fetchingCount > 0 || mutatingCount > 0;
  const [visible, setVisible] = useState(false);
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isBusy) {
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
  }, [isBusy]);

  useEffect(() => {
    return () => {
      if (showTimerRef.current) {
        clearTimeout(showTimerRef.current);
      }
    };
  }, []);

  if (!visible) {
    return null;
  }

  return <Loader />;
}

