import Constants from "expo-constants";
import { Platform } from "react-native";

const DOWNLOAD_CHANNEL_ID = "download-progress";
const UPDATE_THROTTLE_MS = 1200;

type NotificationsModule = typeof import("expo-notifications");

class DownloadNotificationService {
  private initialized = false;
  private notifications: NotificationsModule | null = null;
  private notificationsUnavailable = false;
  private notificationHandlerSet = false;
  private activeNotificationId: string | null = null;
  private lastProgressUpdateAt = 0;

  private async getNotifications(): Promise<NotificationsModule | null> {
    if (this.notificationsUnavailable) {
      return null;
    }

    if (this.notifications) {
      return this.notifications;
    }

    // Expo Go has notifications limitations; keep app behavior stable there.
    // In dev builds / standalone apps this service works normally.
    if (Constants.appOwnership === "expo") {
      this.notificationsUnavailable = true;
      return null;
    }

    try {
      const notifications = await import("expo-notifications");

      if (!this.notificationHandlerSet) {
        notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowBanner: true,
            shouldShowList: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
          }),
        });
        this.notificationHandlerSet = true;
      }

      this.notifications = notifications;
      return notifications;
    } catch {
      this.notificationsUnavailable = true;
      return null;
    }
  }

  private async init(): Promise<NotificationsModule | null> {
    if (this.initialized) {
      return this.notifications;
    }

    const notifications = await this.getNotifications();
    if (!notifications) {
      return null;
    }

    try {
      const permissions = await notifications.getPermissionsAsync();
      if (permissions.status !== "granted") {
        const request = await notifications.requestPermissionsAsync();
        if (request.status !== "granted") {
          return null;
        }
      }

      if (Platform.OS === "android") {
        await notifications.setNotificationChannelAsync(DOWNLOAD_CHANNEL_ID, {
          name: "Downloads",
          importance: notifications.AndroidImportance.DEFAULT,
          vibrationPattern: [0],
          lockscreenVisibility:
            notifications.AndroidNotificationVisibility.PUBLIC,
        });
      }

      this.initialized = true;
      return notifications;
    } catch {
      this.notificationsUnavailable = true;
      this.notifications = null;
      return null;
    }
  }

  async start(title: string, isHls: boolean): Promise<void> {
    const notifications = await this.init();
    if (!notifications) {
      return;
    }

    const body = isHls
      ? "Downloading HLS stream... 0%"
      : "Downloading video... 0%";

    this.activeNotificationId = await notifications.scheduleNotificationAsync({
      content: {
        title: title || "Video download",
        body,
        sticky: Platform.OS === "android",
        autoDismiss: false,
      },
      trigger: null,
      identifier: "active-download",
    });
  }

  async update(progress: number, title: string, isHls: boolean): Promise<void> {
    const now = Date.now();
    if (now - this.lastProgressUpdateAt < UPDATE_THROTTLE_MS && progress < 1) {
      return;
    }
    this.lastProgressUpdateAt = now;

    const notifications = await this.init();
    if (!notifications) {
      return;
    }

    const percent = Math.round(progress * 100);
    const body = isHls
      ? `Downloading HLS stream... ${percent}%`
      : `Downloading video... ${percent}%`;

    this.activeNotificationId = await notifications.scheduleNotificationAsync({
      content: {
        title: title || "Video download",
        body,
        sticky: Platform.OS === "android" && percent < 100,
        autoDismiss: percent >= 100,
      },
      trigger: null,
      identifier: "active-download",
    });
  }

  async complete(title: string): Promise<void> {
    const notifications = await this.init();
    if (!notifications) {
      return;
    }

    if (this.activeNotificationId) {
      await notifications.dismissNotificationAsync(this.activeNotificationId);
      this.activeNotificationId = null;
    }

    await notifications.scheduleNotificationAsync({
      content: {
        title: title || "Video download",
        body: "Download complete. Available offline.",
      },
      trigger: null,
    });
  }

  async fail(title: string): Promise<void> {
    const notifications = await this.init();
    if (!notifications) {
      return;
    }

    if (this.activeNotificationId) {
      await notifications.dismissNotificationAsync(this.activeNotificationId);
      this.activeNotificationId = null;
    }

    await notifications.scheduleNotificationAsync({
      content: {
        title: title || "Video download",
        body: "Download failed. Please try again.",
      },
      trigger: null,
    });
  }
}

export const downloadNotificationService = new DownloadNotificationService();
