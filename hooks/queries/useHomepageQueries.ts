import { useAuth } from "@/context/AuthContext";
import { homepageService } from "@/services/homepage.service";
import { UnifiedSearchResults } from "@/types/api.types";
import { useQuery } from "@tanstack/react-query";

/**
 * Query Keys for Homepage
 */
export const homepageKeys = {
  all: ["homepage"] as const,
  liveNow: () => [...homepageKeys.all, "liveNow"] as const,
  liveStreams: (limit?: number) =>
    [...homepageKeys.all, "liveStreams", limit] as const,
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
  search: (query: string, limit?: number) =>
    [...homepageKeys.all, "search", query, limit] as const,
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
    refetchInterval: 30_000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    refetchOnReconnect: true,
  });
}

/**
 * Get currently live livestreams query
 */
export function useLiveStreams(limit: number = 10) {
  return useQuery({
    queryKey: homepageKeys.liveStreams(limit),
    queryFn: async () => {
      const response = await homepageService.getLiveStreams(limit);
      return response.data || [];
    },
    refetchInterval: 30_000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    refetchOnReconnect: true,
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
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: homepageKeys.continueWatching(),
    queryFn: async () => {
      const response = await homepageService.getContinueWatching();
      return response.data || [];
    },
    enabled: isAuthenticated,
    refetchInterval: 60_000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    refetchOnReconnect: true,
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
    staleTime: 1000 * 20,
    refetchInterval: 1000 * 10,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    refetchOnReconnect: true,
  });
}

/**
 * Get programs query
 */
export function usePrograms(limit: number = 10) {
  const safeLimit = Math.min(Math.max(limit, 1), 50);
  return useQuery({
    queryKey: homepageKeys.programs(safeLimit),
    queryFn: async () => {
      const response = await homepageService.getPrograms(safeLimit);
      return response.data || [];
    },
    refetchInterval: 3 * 60_000,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    refetchOnReconnect: true,
  });
}

/**
 * Get featured videos query
 */
export function useFeaturedVideos(limit: number = 10) {
  const safeLimit = Math.min(Math.max(limit, 1), 50);
  return useQuery({
    queryKey: homepageKeys.featuredVideos(safeLimit),
    queryFn: async () => {
      const response = await homepageService.getFeaturedVideos(safeLimit);
      return response.data || [];
    },
    refetchInterval: 3 * 60_000,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    refetchOnReconnect: true,
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
    refetchInterval: 3 * 60_000,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    refetchOnReconnect: true,
  });
}


/**
 * Unified semantic search across videos, channels, and programs
 */
export function useUnifiedSearch(query: string, limit: number = 5) {
  return useQuery<UnifiedSearchResults>({
    queryKey: homepageKeys.search(query, limit),
    queryFn: async () => {
      const response = await homepageService.search(query, limit);
      return (
        response.data ?? { videos: [], channels: [], programs: [], totals: { videos: 0, channels: 0, programs: 0 } }
      );
    },
    enabled: query.trim().length >= 2,
    staleTime: 30_000,
  });
}
