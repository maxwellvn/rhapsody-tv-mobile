import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage Keys
 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: '@rhapsody_tv/access_token',
  REFRESH_TOKEN: '@rhapsody_tv/refresh_token',
  USER_DATA: '@rhapsody_tv/user_data',
  ONBOARDING_COMPLETED: '@rhapsody_tv/onboarding_completed',
  THEME: '@rhapsody_tv/theme',
  SETTINGS: '@rhapsody_tv/settings',
  SEARCH_HISTORY: '@rhapsody_tv/search_history',
  DOWNLOAD_QUEUE: '@rhapsody_tv/download_queue',
} as const;

/**
 * Storage Utility Class
 */
class Storage {
  /**
   * Save data to storage
   */
  async setItem(key: string, value: any): Promise<void> {
    try {
      const stringValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, stringValue);
    } catch (error) {
      console.error('Error saving to storage:', error);
      throw error;
    }
  }

  /**
   * Get data from storage
   */
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  }

  /**
   * Remove item from storage
   */
  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from storage:', error);
      throw error;
    }
  }

  /**
   * Clear all storage
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }

  /**
   * Save authentication tokens
   */
  async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
    try {
      await Promise.all([
        this.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken),
        this.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken),
      ]);
    } catch (error) {
      console.error('Error saving tokens:', error);
      throw error;
    }
  }

  /**
   * Get access token
   */
  async getAccessToken(): Promise<string | null> {
    return this.getItem<string>(STORAGE_KEYS.ACCESS_TOKEN);
  }

  /**
   * Get refresh token
   */
  async getRefreshToken(): Promise<string | null> {
    return this.getItem<string>(STORAGE_KEYS.REFRESH_TOKEN);
  }

  /**
   * Remove authentication tokens
   */
  async clearTokens(): Promise<void> {
    try {
      await Promise.all([
        this.removeItem(STORAGE_KEYS.ACCESS_TOKEN),
        this.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
      ]);
    } catch (error) {
      console.error('Error clearing tokens:', error);
      throw error;
    }
  }

  /**
   * Save user data
   */
  async saveUserData(userData: any): Promise<void> {
    return this.setItem(STORAGE_KEYS.USER_DATA, userData);
  }

  /**
   * Get user data
   */
  async getUserData<T>(): Promise<T | null> {
    return this.getItem<T>(STORAGE_KEYS.USER_DATA);
  }

  /**
   * Clear user data
   */
  async clearUserData(): Promise<void> {
    return this.removeItem(STORAGE_KEYS.USER_DATA);
  }

  /**
   * Check if onboarding is completed
   */
  async isOnboardingCompleted(): Promise<boolean> {
    const completed = await this.getItem<boolean>(STORAGE_KEYS.ONBOARDING_COMPLETED);
    return completed ?? false;
  }

  /**
   * Mark onboarding as completed
   */
  async setOnboardingCompleted(): Promise<void> {
    return this.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, true);
  }
}

export const storage = new Storage();
