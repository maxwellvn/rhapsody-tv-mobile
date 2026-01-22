import {
  useQuery,
  useMutation,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { videoService } from '@/services/video.service';
import { VideoListParams } from '@/types/api.types';

/**
 * Query Keys for Videos
 */
export const videoKeys = {
  all: ['videos'] as const,
  lists: () => [...videoKeys.all, 'list'] as const,
  list: (filters: VideoListParams) => [...videoKeys.lists(), filters] as const,
  trending: (filters: VideoListParams) => [...videoKeys.all, 'trending', filters] as const,
  recommended: (filters: VideoListParams) => [...videoKeys.all, 'recommended', filters] as const,
  detail: (id: string) => [...videoKeys.all, 'detail', id] as const,
  related: (id: string) => [...videoKeys.all, 'related', id] as const,
  search: (query: string, filters?: VideoListParams) => 
    [...videoKeys.all, 'search', query, filters] as const,
};

/**
 * Get trending videos
 */
export function useTrendingVideos(params?: VideoListParams) {
  return useQuery({
    queryKey: videoKeys.trending(params || {}),
    queryFn: async () => {
      const response = await videoService.getTrendingVideos(params);
      return response.data;
    },
  });
}

/**
 * Get recommended videos
 */
export function useRecommendedVideos(params?: VideoListParams) {
  return useQuery({
    queryKey: videoKeys.recommended(params || {}),
    queryFn: async () => {
      const response = await videoService.getRecommendedVideos(params);
      return response.data;
    },
  });
}

/**
 * Get video details
 */
export function useVideoDetails(videoId: string) {
  return useQuery({
    queryKey: videoKeys.detail(videoId),
    queryFn: async () => {
      const response = await videoService.getVideoDetails(videoId);
      return response.data;
    },
    enabled: !!videoId, // Only fetch if videoId exists
  });
}

/**
 * Get related videos
 */
export function useRelatedVideos(videoId: string) {
  return useQuery({
    queryKey: videoKeys.related(videoId),
    queryFn: async () => {
      const response = await videoService.getRelatedVideos(videoId);
      return response.data;
    },
    enabled: !!videoId,
  });
}

/**
 * Search videos
 */
export function useSearchVideos(query: string, params?: VideoListParams) {
  return useQuery({
    queryKey: videoKeys.search(query, params),
    queryFn: async () => {
      const response = await videoService.searchVideos(query, params);
      return response.data;
    },
    enabled: query.length > 0, // Only search if query exists
  });
}

/**
 * Infinite scroll for videos
 */
export function useInfiniteVideos(params?: VideoListParams) {
  return useInfiniteQuery({
    queryKey: videoKeys.list(params || {}),
    queryFn: async ({ pageParam = 1 }) => {
      const response = await videoService.getVideos({
        ...params,
        page: pageParam,
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasNext ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
  });
}

/**
 * Like video mutation
 */
export function useLikeVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (videoId: string) => {
      await videoService.likeVideo(videoId);
      return videoId;
    },
    onSuccess: (videoId) => {
      // Invalidate video detail to refetch updated like status
      queryClient.invalidateQueries({ 
        queryKey: videoKeys.detail(videoId) 
      });
      
      // Optionally update the cache optimistically
      queryClient.setQueryData(videoKeys.detail(videoId), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          isLiked: true,
          likes: old.likes + 1,
        };
      });
    },
  });
}

/**
 * Unlike video mutation
 */
export function useUnlikeVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (videoId: string) => {
      await videoService.unlikeVideo(videoId);
      return videoId;
    },
    onSuccess: (videoId) => {
      queryClient.invalidateQueries({ 
        queryKey: videoKeys.detail(videoId) 
      });
      
      queryClient.setQueryData(videoKeys.detail(videoId), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          isLiked: false,
          likes: Math.max(0, old.likes - 1),
        };
      });
    },
  });
}

/**
 * Record video view
 */
export function useRecordView() {
  return useMutation({
    mutationFn: async ({ videoId, watchTime }: { videoId: string; watchTime?: number }) => {
      await videoService.recordView(videoId, watchTime);
    },
  });
}
