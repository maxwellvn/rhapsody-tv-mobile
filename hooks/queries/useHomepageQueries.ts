import { homepageService } from "@/services/homepage.service";
import { useQuery } from "@tanstack/react-query";

/**
 * Query Keys for Homepage
 */
export const homepageKeys = {
  all: ["homepage"] as const,
  liveNow: () => [...homepageKeys.all, "liveNow"] as const,
  watchLivestream: (livestreamId?: string) =>
    [...homepageKeys.all, "watchLivestream", livestreamId] as const,
  continueWatching: () => [...homepageKeys.all, "continueWatching"] as const,
  channels: (limit?: number) =>
    [...homepageKeys.all, "channels", limit] as const,
  programs: (limit?: number) =>
    [...homepageKeys.all, "programs", limit] as const,
  featuredVideos: (limit?: number) =>
    [...homepageKeys.all, "featuredVideos", limit] as const,
  programHighlights: (limit?: number) =>
    [...homepageKeys.all, "programHighlights", limit] as const,
};

/**
 * Get live now program query
 */
export function useLiveNow() {
  return useQuery({
    queryKey: homepageKeys.liveNow(),
    queryFn: async () => {
      const response = await homepageService.getLiveNow();
      console.log("response", response.data);
      return response.data;
    },
  });
}

/**
 * Get livestream details (for live video screen)
 */
export function useWatchLivestream(livestreamId?: string) {
  return useQuery({
    queryKey: homepageKeys.watchLivestream(livestreamId),
    queryFn: async () => {
      if (!livestreamId) return undefined;
      const response = await homepageService.watchLivestream(livestreamId);
      return response.data;
    },
    enabled: !!livestreamId,
  });
}

/**
 * Get continue watching query
 */
export function useContinueWatching() {
  return useQuery({
    queryKey: homepageKeys.continueWatching(),
    queryFn: async () => {
      const response = await homepageService.getContinueWatching();
      return response.data || [];
    },
  });
}

/**
 * Get channels query
 */
export function useChannels(limit: number = 10) {
  return useQuery({
    queryKey: homepageKeys.channels(limit),
    queryFn: async () => {
      const response = await homepageService.getChannels(limit);
      return response.data || [];
    },
  });
}

/**
 * Get programs query
 */
export function usePrograms(limit: number = 10) {
  return useQuery({
    queryKey: homepageKeys.programs(limit),
    queryFn: async () => {
      const response = await homepageService.getPrograms(limit);
      return response.data || [];
    },
  });
}

/**
 * Get featured videos query
 */
export function useFeaturedVideos(limit: number = 10) {
  return useQuery({
    queryKey: homepageKeys.featuredVideos(limit),
    queryFn: async () => {
      const response = await homepageService.getFeaturedVideos(limit);
      return response.data || [];
    },
  });
}

/**
 * Get program highlights query
 */
export function useProgramHighlights(limit: number = 10) {
  return useQuery({
    queryKey: homepageKeys.programHighlights(limit),
    queryFn: async () => {
      const response = await homepageService.getProgramHighlights(limit);
      return response.data || [];
    },
  });
}
