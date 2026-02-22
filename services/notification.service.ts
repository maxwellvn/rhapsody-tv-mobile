import { API_ENDPOINTS } from "@/config/api.config";
import {
    ApiResponse,
    PaginatedNotificationsDto
} from "@/types/api.types";
import { api } from "./api.client";

/**
 * Notification Service
 * Handles all notification-related API calls
 */
class NotificationService {
  /**
   * Get paginated list of notifications
   */
  async getNotifications(
    page: number = 1,
    limit: number = 20,
  ): Promise<ApiResponse<PaginatedNotificationsDto>> {
    return api.get<PaginatedNotificationsDto>(
      API_ENDPOINTS.NOTIFICATIONS.LIST,
      {
        params: { page, limit },
      },
    );
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: string): Promise<ApiResponse<void>> {
    return api.patch<void>(API_ENDPOINTS.NOTIFICATIONS.READ(notificationId));
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string): Promise<ApiResponse<void>> {
    return api.delete<void>(API_ENDPOINTS.NOTIFICATIONS.DELETE(notificationId));
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<ApiResponse<void>> {
    return api.post<void>(API_ENDPOINTS.NOTIFICATIONS.READ_ALL);
  }
}

export const notificationService = new NotificationService();
