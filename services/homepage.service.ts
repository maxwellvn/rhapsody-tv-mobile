import { API_ENDPOINTS } from "@/config/api.config";
import {
  ApiResponse,
  ContinueWatchingItem,
  HomepageChannel,
  HomepageFeaturedVideo,
  HomepageProgram,
  LiveNowProgram,
  LiveStreamDetails,
  UnifiedSearchResults,
  UpdateProgressDto,
} from "@/types/api.types";
import { api } from "./api.client";

/**
 * Homepage Service
 * Handles all homepage-related API calls
 */
class HomepageService {
  /**
   * Get live now program
   */
  async getLiveNow(): Promise<ApiResponse<LiveNowProgram>> {
    return api.get<LiveNowProgram>(API_ENDPOINTS.HOMEPAGE.LIVE_NOW);
  }

  /**
   * Get currently live livestreams
   */
  async getLiveStreams(
    limit: number = 10,
  ): Promise<ApiResponse<LiveNowProgram[]>> {
    return api.get<LiveNowProgram[]>(API_ENDPOINTS.HOMEPAGE.LIVE_STREAMS, {
      params: { limit },
    });
  }

  /**
   * Get continue watching list
   */
  async getContinueWatching(): Promise<ApiResponse<ContinueWatchingItem[]>> {
    return api.get<ContinueWatchingItem[]>(
      API_ENDPOINTS.HOMEPAGE.CONTINUE_WATCHING,
    );
  }

  /**
   * Update watch progress for continue watching
   */
  async updateProgress(
    payload: UpdateProgressDto,
  ): Promise<ApiResponse<ContinueWatchingItem>> {
    return api.post<ContinueWatchingItem>(
      API_ENDPOINTS.HOMEPAGE.UPDATE_PROGRESS,
      payload,
    );
  }

  /**
   * Get channels list
   * @param limit - Max items per section (default: 10)
   */
  async getChannels(
    limit: number = 10,
  ): Promise<ApiResponse<HomepageChannel[]>> {
    return api.get<HomepageChannel[]>(API_ENDPOINTS.HOMEPAGE.CHANNELS, {
      params: { limit },
    });
  }

  /**
   * Get programs list
   * @param limit - Max items per section (default: 10)
   */
  async getPrograms(
    limit: number = 10,
  ): Promise<ApiResponse<HomepageProgram[]>> {
    return api.get<HomepageProgram[]>(API_ENDPOINTS.HOMEPAGE.PROGRAMS, {
      params: { limit },
    });
  }

  /**
   * Get featured videos list
   * @param limit - Max items per section (default: 10)
   */
  async getFeaturedVideos(
    limit: number = 10,
  ): Promise<ApiResponse<HomepageFeaturedVideo[]>> {
    return api.get<HomepageFeaturedVideo[]>(
      API_ENDPOINTS.HOMEPAGE.FEATURED_VIDEOS,
      {
        params: { limit },
      },
    );
  }

  /**
   * Get program highlights list
   * @param limit - Max items per section (default: 10)
   */
  async getProgramHighlights(
    limit: number = 10,
  ): Promise<ApiResponse<HomepageFeaturedVideo[]>> {
    return api.get<HomepageFeaturedVideo[]>(
      API_ENDPOINTS.HOMEPAGE.PROGRAM_HIGHLIGHTS,
      {
        params: { limit },
      },
    );
  }

  /**
   * Unified semantic search across videos, channels, and programs
   */
  async search(
    query: string,
    limit: number = 5,
  ): Promise<ApiResponse<UnifiedSearchResults>> {
    return api.get<UnifiedSearchResults>(API_ENDPOINTS.HOMEPAGE.SEARCH, {
      params: { q: query, limit },
    });
  }

  /**
   * Get livestream details for watching
   */
  async watchLivestream(
    livestreamId: string,
  ): Promise<ApiResponse<LiveStreamDetails>> {
    return api.get<LiveStreamDetails>(
      API_ENDPOINTS.HOMEPAGE.WATCH_LIVESTREAM(livestreamId),
    );
  }
}

export const homepageService = new HomepageService();
