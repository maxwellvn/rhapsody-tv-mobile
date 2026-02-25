import { vodService } from "@/services/vod.service";
import { CreateCommentDto } from "@/types/api.types";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

/**
 * Query Keys for VOD
 */
export const vodKeys = {
  all: ["vod"] as const,
  lists: () => [...vodKeys.all, "list"] as const,
  paginatedList: (page: number, limit: number) =>
    [...vodKeys.lists(), page, limit] as const,
  detail: (id: string) => [...vodKeys.all, "detail", id] as const,
  likeStatus: (videoId: string) =>
    [...vodKeys.all, "likeStatus", videoId] as const,
  comments: (videoId: string, page?: number, sort?: string) =>
    [...vodKeys.all, "comments", videoId, page, sort] as const,
};

/**
 * Get paginated list of VOD videos
 */
export function useVodVideos(page = 1, limit = 50) {
  return useQuery({
    queryKey: vodKeys.paginatedList(page, limit),
    queryFn: async () => {
      const response = await vodService.getVideos(page, limit);
      return response.data;
    },
    staleTime: 2 * 60_000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

/**
 * Infinite-scroll paginated VOD videos
 */
export function useInfiniteVodVideos(limit = 20) {
  return useInfiniteQuery({
    queryKey: [...vodKeys.lists(), "infinite"] as const,
    queryFn: async ({ pageParam = 1 }) => {
      const response = await vodService.getVideos(pageParam, limit);
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      const currentPage = lastPage.page ?? 1;
      const totalPages =
        (lastPage as any).totalPages ??
        (lastPage as any).pages ??
        1;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    staleTime: 2 * 60_000,
  });
}

/**
 * Get like status for a video
 */
export function useLikeStatus(videoId?: string) {
  return useQuery({
    queryKey: vodKeys.likeStatus(videoId || ""),
    queryFn: async () => {
      if (!videoId) return { isLiked: false };
      const response = await vodService.getLikeStatus(videoId);
      const payload = response?.data as
        | { isLiked?: boolean; liked?: boolean }
        | undefined;
      const topLevel = response as unknown as { isLiked?: boolean; liked?: boolean };
      const isLiked =
        typeof payload?.isLiked === "boolean"
          ? payload.isLiked
          : typeof payload?.liked === "boolean"
            ? payload.liked
            : typeof topLevel?.isLiked === "boolean"
              ? topLevel.isLiked
              : typeof topLevel?.liked === "boolean"
                ? topLevel.liked
                : false;
      return { isLiked };
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
      const response = await vodService.toggleLike(videoId);
      const payload = response?.data as
        | { isLiked?: boolean; liked?: boolean }
        | undefined;
      const topLevel = response as unknown as { isLiked?: boolean; liked?: boolean };
      const isLiked =
        typeof payload?.isLiked === "boolean"
          ? payload.isLiked
          : typeof payload?.liked === "boolean"
            ? payload.liked
            : typeof topLevel?.isLiked === "boolean"
              ? topLevel.isLiked
              : typeof topLevel?.liked === "boolean"
                ? topLevel.liked
                : undefined;
      return { videoId, isLiked };
    },
    onMutate: async (videoId) => {
      // Cancel any in-flight refetch so it doesn't overwrite the optimistic value
      await queryClient.cancelQueries({ queryKey: vodKeys.likeStatus(videoId) });

      // Snapshot current value so we can roll back on error
      const previous = queryClient.getQueryData<{ isLiked: boolean }>(
        vodKeys.likeStatus(videoId),
      );

      // Write the toggled value directly into the cache — survives navigation
      queryClient.setQueryData(vodKeys.likeStatus(videoId), {
        isLiked: !previous?.isLiked,
      });

      return { previous };
    },
    onSuccess: (result) => {
      if (typeof result?.isLiked === "boolean") {
        queryClient.setQueryData(vodKeys.likeStatus(result.videoId), {
          isLiked: result.isLiked,
        });
      }
    },
    onError: (_err, videoId, context) => {
      // Roll back on failure
      if (context?.previous !== undefined) {
        queryClient.setQueryData(vodKeys.likeStatus(videoId), context.previous);
      }
    },
    onSettled: (_result, _err, videoId) => {
      // Confirm actual server state in the background
      if (videoId) {
        queryClient.invalidateQueries({ queryKey: vodKeys.likeStatus(videoId) });
        queryClient.invalidateQueries({ queryKey: vodKeys.detail(videoId) });
      }
    },
  });
}

/**
 * Get comments for a video
 */
export function useVideoComments(videoId: string, page = 1, limit = 20, sort: 'newest' | 'top' = 'newest') {
  return useQuery({
    queryKey: vodKeys.comments(videoId, page, sort),
    queryFn: async () => {
      const response = await vodService.getComments(videoId, page, limit, sort);
      return response.data;
    },
    enabled: !!videoId,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    refetchOnReconnect: true,
  });
}

/**
 * Add a comment to a video
 */
export function useAddComment(videoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCommentDto) => {
      const response = await vodService.addComment(videoId, data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all comment queries for this video regardless of sort/page
      queryClient.invalidateQueries({ queryKey: [...vodKeys.all, "comments", videoId] });
    },
  });
}

/**
 * Reply to a comment on a video
 */
export function useReplyToComment(videoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      commentId,
      data,
    }: {
      commentId: string;
      data: CreateCommentDto;
    }) => {
      const response = await vodService.replyToComment(videoId, commentId, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...vodKeys.all, "comments", videoId],
      });
    },
  });
}

/**
 * Toggle like on a comment
 */
export function useToggleCommentLike(videoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: string) => {
      const response = await vodService.toggleCommentLike(commentId);
      return { commentId, liked: response.data?.liked };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...vodKeys.all, "comments", videoId],
      });
    },
  });
}

/**
 * Delete own comment
 */
export function useDeleteComment(videoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: string) => {
      await vodService.deleteComment(commentId);
      return commentId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...vodKeys.all, "comments", videoId],
      });
    },
  });
}
