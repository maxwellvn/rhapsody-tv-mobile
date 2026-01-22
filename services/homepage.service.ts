import { api } from './api.client';
import { API_ENDPOINTS } from '@/config/api.config';
import {
  ApiResponse,
  LiveNowProgram,
  ContinueWatchingItem,
  HomepageChannel,
  HomepageProgram,
  HomepageFeaturedVideo,
} from '@/types/api.types';

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
   * Get continue watching list
   */
  async getContinueWatching(): Promise<ApiResponse<ContinueWatchingItem[]>> {
    return api.get<ContinueWatchingItem[]>(API_ENDPOINTS.HOMEPAGE.CONTINUE_WATCHING);
  }

  /**
   * Get channels list
   * @param limit - Max items per section (default: 10)
   */
  async getChannels(limit: number = 10): Promise<ApiResponse<HomepageChannel[]>> {
    return api.get<HomepageChannel[]>(API_ENDPOINTS.HOMEPAGE.CHANNELS, {
      params: { limit },
    });
  }

  /**
   * Get programs list
   * @param limit - Max items per section (default: 10)
   */
  async getPrograms(limit: number = 10): Promise<ApiResponse<HomepageProgram[]>> {
    return api.get<HomepageProgram[]>(API_ENDPOINTS.HOMEPAGE.PROGRAMS, {
      params: { limit },
    });
  }

  /**
   * Get featured videos list
   * @param limit - Max items per section (default: 10)
   */
  async getFeaturedVideos(limit: number = 10): Promise<ApiResponse<HomepageFeaturedVideo[]>> {
    return api.get<HomepageFeaturedVideo[]>(API_ENDPOINTS.HOMEPAGE.FEATURED_VIDEOS, {
      params: { limit },
    });
  }

  /**
   * Get program highlights list
   * @param limit - Max items per section (default: 10)
   */
  async getProgramHighlights(limit: number = 10): Promise<ApiResponse<HomepageFeaturedVideo[]>> {
    return api.get<HomepageFeaturedVideo[]>(API_ENDPOINTS.HOMEPAGE.PROGRAM_HIGHLIGHTS, {
      params: { limit },
    });
  }
}

export const homepageService = new HomepageService();
