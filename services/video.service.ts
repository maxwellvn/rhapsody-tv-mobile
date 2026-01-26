import { API_ENDPOINTS } from "@/config/api.config";
import {
  ApiResponse,
  LiveStreamDetails,
  PaginatedResponse,
  Video,
  VideoListParams,
  VodVideoResponseDto
} from "@/types/api.types";
import { api } from "./api.client";

/**
 * Video Service
 * Handles video-related API calls
 */
class VideoService {
  /**
   * Get list of videos
   */
  async getVideos(
    params?: VideoListParams,
  ): Promise<ApiResponse<PaginatedResponse<Video>>> {
    return api.get<PaginatedResponse<Video>>(API_ENDPOINTS.VIDEOS.LIST, {
      params,
    });
  }

  /**
   * Get trending videos
   */
  async getTrendingVideos(
    params?: VideoListParams,
  ): Promise<ApiResponse<PaginatedResponse<Video>>> {
    return api.get<PaginatedResponse<Video>>(API_ENDPOINTS.VIDEOS.TRENDING, {
      params,
    });
  }

  /**
   * Get recommended videos
   */
  async getRecommendedVideos(
    params?: VideoListParams,
  ): Promise<ApiResponse<PaginatedResponse<Video>>> {
    return api.get<PaginatedResponse<Video>>(API_ENDPOINTS.VIDEOS.RECOMMENDED, {
      params,
    });
  }

  /**
   * Search videos
   */
  async searchVideos(
    query: string,
    params?: VideoListParams,
  ): Promise<ApiResponse<PaginatedResponse<Video>>> {
    return api.get<PaginatedResponse<Video>>(API_ENDPOINTS.VIDEOS.SEARCH, {
      params: { ...params, search: query },
    });
  }

  /**
   * Get video details
   */
  async getVideoDetails(videoId: string): Promise<ApiResponse<Video>> {
    return api.get<Video>(API_ENDPOINTS.VIDEOS.DETAILS(videoId));
  }

  /**
   * Get VOD video details (includes playback URL)
   */
  async getVodVideo(
    videoId: string,
  ): Promise<ApiResponse<VodVideoResponseDto>> {
    return api.get<VodVideoResponseDto>(API_ENDPOINTS.VOD.DETAILS(videoId));
  }

  /**
   * Get related videos
   */
  async getRelatedVideos(videoId: string): Promise<ApiResponse<Video[]>> {
    return api.get<Video[]>(API_ENDPOINTS.VIDEOS.RELATED(videoId));
  }

  /**
   * Get video stream URL
   */
  async getStreamUrl(videoId: string): Promise<ApiResponse<LiveStreamDetails>> {
    return api.get<LiveStreamDetails>(API_ENDPOINTS.VIDEOS.STREAM(videoId));
  }

  /**
   * Like a video
   */
  async likeVideo(videoId: string): Promise<ApiResponse<void>> {
    return api.post<void>(API_ENDPOINTS.INTERACTIONS.LIKE(videoId));
  }

  /**
   * Unlike a video
   */
  async unlikeVideo(videoId: string): Promise<ApiResponse<void>> {
    return api.post<void>(API_ENDPOINTS.INTERACTIONS.UNLIKE(videoId));
  }

  /**
   * Record video view
   */
  async recordView(
    videoId: string,
    watchTime?: number,
  ): Promise<ApiResponse<void>> {
    return api.post<void>(API_ENDPOINTS.INTERACTIONS.VIEW(videoId), {
      watchTime,
    });
  }
}

export const videoService = new VideoService();
