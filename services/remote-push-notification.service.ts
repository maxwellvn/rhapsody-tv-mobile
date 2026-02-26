import Constants from "expo-constants";
import { Platform } from "react-native";
import { API_ENDPOINTS } from "@/config/api.config";
import { api } from "@/services/api.client";

type NotificationsModule = typeof import("expo-notifications");

class RemotePushNotificationService {
  private notifications: NotificationsModule | null = null;
  private notificationsUnavailable = false;
  private registeredToken: string | null = null;

  private async getNotifications(): Promise<NotificationsModule | null> {
    if (this.notificationsUnavailable) return null;
    if (this.notifications) return this.notifications;

    try {
      const notifications = await import("expo-notifications");
      this.notifications = notifications;
      return notifications;
    } catch {
      this.notificationsUnavailable = true;
      this.notifications = null;
      return null;
    }
  }

  private getProjectId(): string | undefined {
    const maybeConstants = Constants as unknown as {
      easConfig?: { projectId?: string };
      expoConfig?: { extra?: { eas?: { projectId?: string } } };
    };

    return (
      maybeConstants.easConfig?.projectId ||
      maybeConstants.expoConfig?.extra?.eas?.projectId
    );
  }

  async registerCurrentDevice(): Promise<boolean> {
    if (Constants.appOwnership === "expo") {
      return false;
    }

    const notifications = await this.getNotifications();
    if (!notifications) return false;

    if (Platform.OS === "android") {
      try {
        await notifications.setNotificationChannelAsync("admin-alerts", {
          name: "General notifications",
          importance: notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
        });
      } catch {
        // Keep token registration resilient even if channel setup fails.
      }
    }

    const currentPermissions = await notifications.getPermissionsAsync();
    let status = currentPermissions.status;

    if (status !== "granted") {
      const request = await notifications.requestPermissionsAsync();
      status = request.status;
    }

    if (status !== "granted") {
      return false;
    }

    const projectId = this.getProjectId();
    const tokenResponse = projectId
      ? await notifications.getExpoPushTokenAsync({ projectId })
      : await notifications.getExpoPushTokenAsync();

    const token = tokenResponse.data;
    if (!token) return false;

    if (this.registeredToken === token) {
      return true;
    }

    await api.post<{ ok: true }>(API_ENDPOINTS.NOTIFICATIONS.PUSH_TOKEN, {
      token,
      platform: Platform.OS,
    });

    this.registeredToken = token;
    return true;
  }

  clearRegisteredTokenCache() {
    this.registeredToken = null;
  }
}

export const remotePushNotificationService =
  new RemotePushNotificationService();
