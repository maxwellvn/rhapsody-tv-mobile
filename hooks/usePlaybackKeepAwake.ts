import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { useEffect, useRef } from "react";

export function usePlaybackKeepAwake(active: boolean) {
  const tagRef = useRef(`playback-${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    const tag = tagRef.current;

    if (active) {
      activateKeepAwakeAsync(tag).catch(() => {
        // no-op
      });
      return () => {
        deactivateKeepAwake(tag).catch(() => {
          // no-op
        });
      };
    }

    deactivateKeepAwake(tag).catch(() => {
      // no-op
    });

    return () => {
      deactivateKeepAwake(tag).catch(() => {
        // no-op
      });
    };
  }, [active]);
}
