import { vodService } from "@/services/vod.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Query Keys for VOD
 */
export const vodKeys = {
  all: ["vod"] as const,
  lists: () => [...vodKeys.all, "list"] as const,
  detail: (id: string) => [...vodKeys.all, "detail", id] as const,
  likeStatus: (videoId: string) =>
    [...vodKeys.all, "likeStatus", videoId] as const,
  comments: (videoId: string, page?: number) =>
    [...vodKeys.all, "comments", videoId, page] as const,
};

/**
 * Get like status for a video
 */
export function useLikeStatus(videoId?: string) {
  return useQuery({
    queryKey: vodKeys.likeStatus(videoId || ""),
    queryFn: async () => {
      if (!videoId) return { isLiked: false };
      const response = await vodService.getLikeStatus(videoId);
      return response.data;
    },
    enabled: !!videoId,
  });
}

/**
 * Toggle like on a video (like/unlike)
 */
export function useToggleLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (videoId: string) => {
      await vodService.toggleLike(videoId);
      return videoId;
    },
    onSuccess: (videoId) => {
      // Invalidate like status query
      queryClient.invalidateQueries({
        queryKey: vodKeys.likeStatus(videoId),
      });
      // Invalidate VOD video detail if available
      queryClient.invalidateQueries({
        queryKey: vodKeys.detail(videoId),
      });
    },
  });
}

/**
 * Get comments for a video
 */
export function useVideoComments(videoId: string, page = 1, limit = 20) {
  return useQuery({
    queryKey: vodKeys.comments(videoId, page),
    queryFn: async () => {
      const response = await vodService.getComments(videoId, page, limit);
      return response.data;
    },
    enabled: !!videoId,
  });
}
