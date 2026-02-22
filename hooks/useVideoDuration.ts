import { useEvent } from 'expo';
import { useVideoPlayer } from 'expo-video';
import { useEffect, useState } from 'react';

/**
 * Returns the real duration of a video in seconds by probing the actual
 * video URL via expo-video. The storedDuration is used only as a placeholder
 * while the player loads, then replaced with the real value once available.
 */
export function useVideoDuration(
  url: string | undefined,
  storedDuration?: number,
): number {
  const [probedDuration, setProbedDuration] = useState(0);

  const player = useVideoPlayer(url ?? null, (p) => {
    p.muted = true;
  });

  const { status } = useEvent(player, 'statusChange', {
    status: player.status,
  });

  useEffect(() => {
    if (
      status === 'readyToPlay' &&
      Number.isFinite(player.duration) &&
      player.duration > 0
    ) {
      setProbedDuration(Math.round(player.duration));
    }
  }, [status, player]);

  // Return real probed duration once available, fall back to stored while loading
  if (probedDuration > 0) return probedDuration;
  return storedDuration && storedDuration > 0 ? storedDuration : 0;
}
