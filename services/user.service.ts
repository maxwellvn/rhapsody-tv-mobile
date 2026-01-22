import { api } from './api.client';
import { API_ENDPOINTS } from '@/config/api.config';
import { User, ApiResponse } from '@/types/api.types';

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
    return api.put<User>(API_ENDPOINTS.USER.UPDATE_PROFILE, data);
  }

  /**
   * Upload user avatar
   */
  async uploadAvatar(imageFile: FormData): Promise<ApiResponse<{ avatar: string }>> {
    return api.upload<{ avatar: string }>(
      API_ENDPOINTS.USER.UPLOAD_AVATAR,
      imageFile
    );
  }

  /**
   * Get user preferences
   */
  async getPreferences(): Promise<ApiResponse<any>> {
    return api.get<any>(API_ENDPOINTS.USER.PREFERENCES);
  }

  /**
   * Update user preferences
   */
  async updatePreferences(preferences: any): Promise<ApiResponse<any>> {
    return api.put<any>(API_ENDPOINTS.USER.PREFERENCES, preferences);
  }
}

export const userService = new UserService();
