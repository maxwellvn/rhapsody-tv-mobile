import { API_ENDPOINTS } from "@/config/api.config";
import {
    ApiResponse,
    ChannelSubscriptionResponseDto,
    ChannelSubscriptionStatusResponse,
    UpdateChannelSubscriptionSettingsDto,
} from "@/types/api.types";
import { api } from "./api.client";

/**
 * Subscription Service
 * Handles all subscription-related API calls
 */
class SubscriptionService {
  /**
   * Subscribe to a channel (creates subscription if missing)
   */
  async subscribe(
    channelId: string,
  ): Promise<ApiResponse<ChannelSubscriptionResponseDto>> {
    return api.post<ChannelSubscriptionResponseDto>(
      API_ENDPOINTS.SUBSCRIPTIONS.SUBSCRIBE(channelId),
    );
  }

  /**
   * Get subscription status for a channel
   */
  async getStatus(
    channelId: string,
  ): Promise<ApiResponse<ChannelSubscriptionStatusResponse>> {
    return api.get<ChannelSubscriptionStatusResponse>(
      API_ENDPOINTS.SUBSCRIPTIONS.STATUS(channelId),
    );
  }

  /**
   * Unsubscribe from a channel
   */
  async unsubscribe(
    channelId: string,
  ): Promise<ApiResponse<ChannelSubscriptionResponseDto>> {
    return api.post<ChannelSubscriptionResponseDto>(
      API_ENDPOINTS.SUBSCRIPTIONS.UNSUBSCRIBE(channelId),
    );
  }

  /**
   * Update notification settings for a channel subscription
   */
  async updateSettings(
    channelId: string,
    settings: UpdateChannelSubscriptionSettingsDto,
  ): Promise<ApiResponse<ChannelSubscriptionResponseDto>> {
    return api.patch<ChannelSubscriptionResponseDto>(
      API_ENDPOINTS.SUBSCRIPTIONS.SETTINGS(channelId),
      settings,
    );
  }
}

export const subscriptionService = new SubscriptionService();
