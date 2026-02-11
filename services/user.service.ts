import { API_ENDPOINTS } from "@/config/api.config";
import {
    AddToWatchlistRequest,
    ApiResponse,
    PaginatedWatchHistoryResponseDto,
    PaginatedWatchlistResponseDto,
    UpdateUserSettingsRequest,
    User,
    UserSettingsResponse,
} from "@/types/api.types";
import { api } from "./api.client";

/**
 * User Service
 * Handles user-related API calls
 */
class UserService {
  /**
   * Get user profile
   */
  async getProfile(): Promise<ApiResponse<User>> {
    return api.get<User>(API_ENDPOINTS.USER.PROFILE);
  }

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return api.patch<User>(API_ENDPOINTS.USER.UPDATE_PROFILE, data);
  }

  /**
   * Upload user avatar
   */
  async uploadAvatar(
    imageFile: FormData,
  ): Promise<ApiResponse<{ avatar: string }>> {
    return api.upload<{ avatar: string }>(
      API_ENDPOINTS.USER.UPLOAD_AVATAR,
      imageFile,
    );
  }

  /**
   * Get user settings
   */
  async getSettings(): Promise<ApiResponse<UserSettingsResponse>> {
    return api.get<UserSettingsResponse>(API_ENDPOINTS.USER.SETTINGS);
  }

  /**
   * Update user settings
   */
  async updateSettings(
    settings: UpdateUserSettingsRequest,
  ): Promise<ApiResponse<UserSettingsResponse>> {
    return api.patch<UserSettingsResponse>(
      API_ENDPOINTS.USER.SETTINGS,
      settings,
    );
  }

  /**
   * Get watchlist (paginated)
   */
  async getWatchlist(
    page: number = 1,
    limit: number = 20,
  ): Promise<ApiResponse<PaginatedWatchlistResponseDto>> {
    return api.get<PaginatedWatchlistResponseDto>(
      API_ENDPOINTS.USER.WATCHLIST,
      {
        params: { page, limit },
      },
    );
  }

  /**
   * Add a video to watchlist
   */
  async addToWatchlist(
    payload: AddToWatchlistRequest,
  ): Promise<ApiResponse<void>> {
    return api.post<void>(API_ENDPOINTS.USER.WATCHLIST, payload);
  }

  /**
   * Remove a video from watchlist
   */
  async removeFromWatchlist(videoId: string): Promise<ApiResponse<void>> {
    return api.delete<void>(API_ENDPOINTS.USER.WATCHLIST_ITEM(videoId));
  }

  /**
   * Get watch history (paginated)
   */
  async getWatchHistory(
    page: number = 1,
    limit: number = 20,
  ): Promise<ApiResponse<PaginatedWatchHistoryResponseDto>> {
    return api.get<PaginatedWatchHistoryResponseDto>(
      API_ENDPOINTS.USER.HISTORY,
      {
        params: { page, limit },
      },
    );
  }

  /**
   * Clear watch history
   */
  async clearWatchHistory(): Promise<ApiResponse<void>> {
    return api.delete<void>(API_ENDPOINTS.USER.HISTORY);
  }

  /**
   * Remove a video from watch history
   */
  async removeFromHistory(videoId: string): Promise<ApiResponse<void>> {
    return api.delete<void>(API_ENDPOINTS.USER.HISTORY_ITEM(videoId));
  }
}

export const userService = new UserService();
