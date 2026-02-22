import { API_ENDPOINTS } from "@/config/api.config";
import {
    ApiResponse,
    CreateCommentDto,
    VodCommentResponseDto,
    VodPaginatedCommentsResponseDto,
    VodPaginatedVideosResponseDto,
    VodVideoResponseDto,
} from "@/types/api.types";
import { api } from "./api.client";

/**
 * VOD (Video on Demand) Service
 * Handles all VOD-related API calls including videos, comments, and interactions
 */
class VodService {
  /**
   * Get paginated list of VOD videos
   */
  async getVideos(
    page: number = 1,
    limit: number = 20,
  ): Promise<ApiResponse<VodPaginatedVideosResponseDto>> {
    return api.get<VodPaginatedVideosResponseDto>(API_ENDPOINTS.VOD.LIST, {
      params: { page, limit },
    });
  }

  /**
   * Get VOD video details by ID
   */
  async getVideoById(
    videoId: string,
  ): Promise<ApiResponse<VodVideoResponseDto>> {
    return api.get<VodVideoResponseDto>(API_ENDPOINTS.VOD.DETAILS(videoId));
  }

  /**
   * Toggle like on a video (like/unlike)
   */
  async toggleLike(videoId: string): Promise<ApiResponse<void>> {
    return api.post<void>(API_ENDPOINTS.VOD.LIKE(videoId));
  }

  /**
   * Check if current user has liked the video
   */
  async getLikeStatus(
    videoId: string,
  ): Promise<ApiResponse<{ isLiked: boolean }>> {
    return api.get<{ isLiked: boolean }>(
      API_ENDPOINTS.VOD.LIKE_STATUS(videoId),
    );
  }

  /**
   * Get comments for a video (with nested replies)
   */
  async getComments(
    videoId: string,
    page: number = 1,
    limit: number = 20,
    sort: 'newest' | 'top' = 'newest',
  ): Promise<ApiResponse<VodPaginatedCommentsResponseDto>> {
    return api.get<VodPaginatedCommentsResponseDto>(
      API_ENDPOINTS.VOD.COMMENTS(videoId),
      {
        params: { page, limit, sort },
      },
    );
  }

  /**
   * Add a comment to a video
   */
  async addComment(
    videoId: string,
    data: CreateCommentDto,
  ): Promise<ApiResponse<VodCommentResponseDto>> {
    const payload = {
      message: data.message ?? data.content ?? "",
    };
    return api.post<VodCommentResponseDto>(
      API_ENDPOINTS.VOD.COMMENTS(videoId),
      payload,
    );
  }

  /**
   * Reply to a comment (one level nesting only)
   */
  async replyToComment(
    videoId: string,
    commentId: string,
    data: CreateCommentDto,
  ): Promise<ApiResponse<VodCommentResponseDto>> {
    const payload = {
      message: data.message ?? data.content ?? "",
    };
    return api.post<VodCommentResponseDto>(
      API_ENDPOINTS.VOD.COMMENT_REPLY(videoId, commentId),
      payload,
    );
  }

  /**
   * Delete own comment (soft delete)
   */
  async deleteComment(commentId: string): Promise<ApiResponse<void>> {
    return api.delete<void>(API_ENDPOINTS.VOD.COMMENT_DELETE(commentId));
  }

  /**
   * Toggle like on a comment (like/unlike)
   */
  async toggleCommentLike(
    commentId: string,
  ): Promise<ApiResponse<{ liked: boolean }>> {
    return api.post<{ liked: boolean }>(API_ENDPOINTS.VOD.COMMENT_LIKE(commentId));
  }

  /**
   * Check if current user has liked the comment
   */
  async getCommentLikeStatus(
    commentId: string,
  ): Promise<ApiResponse<{ isLiked?: boolean; liked?: boolean }>> {
    return api.get<{ isLiked?: boolean; liked?: boolean }>(
      API_ENDPOINTS.VOD.COMMENT_LIKE_STATUS(commentId),
    );
  }
}

export const vodService = new VodService();
