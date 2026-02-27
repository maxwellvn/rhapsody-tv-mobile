/**
 * Returns the video duration in seconds.
 *
 * Previously this hook created a muted expo-video player instance for *every*
 * video in a list just to probe the real duration, causing N network requests
 * and N native video player instances. This was the single biggest source of
 * lag on program/channel profile pages.
 *
 * Now it simply returns the stored duration from the API. If the API doesn't
 * provide one the caller will show "0:00" which is acceptable — the real
 * duration is displayed once the user taps into the video player.
 */
export function useVideoDuration(
  _url: string | undefined,
  storedDuration?: number,
): number {
  return storedDuration && storedDuration > 0 ? storedDuration : 0;
}
