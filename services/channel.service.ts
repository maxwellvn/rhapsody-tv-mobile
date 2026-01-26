import { API_ENDPOINTS } from "@/config/api.config";
import {
    ApiResponse,
    ChannelDetail,
    ChannelSchedule,
    ChannelVideosResponse,
} from "@/types/api.types";
import { api } from "./api.client";

/**
 * Channel Service
 * Handles all channel-related API calls
 */
class ChannelService {
  /**
   * Get channel details by slug
   */
  async getChannelBySlug(slug: string): Promise<ApiResponse<ChannelDetail>> {
    return api.get<ChannelDetail>(API_ENDPOINTS.CHANNELS.DETAILS(slug));
  }

  /**
   * Get channel videos by slug
   */
  async getChannelVideos(
    slug: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<ApiResponse<ChannelVideosResponse>> {
    return api.get<ChannelVideosResponse>(API_ENDPOINTS.CHANNELS.VIDEOS(slug), {
      params: { page, limit },
    });
  }

  /**
   * Get channel schedule by slug
   */
  async getChannelSchedule(
    slug: string,
    date?: string,
    limit?: number,
  ): Promise<ApiResponse<ChannelSchedule[]>> {
    return api.get<ChannelSchedule[]>(API_ENDPOINTS.CHANNELS.SCHEDULE(slug), {
      params: { date, limit },
    });
  }

  /**
   * Subscribe to channel
   */
  async subscribe(id: string): Promise<ApiResponse<void>> {
    return api.post<void>(API_ENDPOINTS.SUBSCRIPTIONS.SUBSCRIBE(id));
  }

  /**
   * Unsubscribe from channel
   */
  async unsubscribe(id: string): Promise<ApiResponse<void>> {
    return api.post<void>(API_ENDPOINTS.SUBSCRIPTIONS.UNSUBSCRIBE(id));
  }
}

export const channelService = new ChannelService();
