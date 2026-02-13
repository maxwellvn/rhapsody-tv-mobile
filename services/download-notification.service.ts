import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const DOWNLOAD_CHANNEL_ID = "download-progress";
const UPDATE_THROTTLE_MS = 1200;

class DownloadNotificationService {
  private initialized = false;
  private activeNotificationId: string | null = null;
  private lastProgressUpdateAt = 0;

  private async init(): Promise<void> {
    if (this.initialized) {
      return;
    }

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });

    const permissions = await Notifications.getPermissionsAsync();
    if (permissions.status !== "granted") {
      const request = await Notifications.requestPermissionsAsync();
      if (request.status !== "granted") {
        return;
      }
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync(DOWNLOAD_CHANNEL_ID, {
        name: "Downloads",
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0],
        lockscreenVisibility:
          Notifications.AndroidNotificationVisibility.PUBLIC,
      });
    }

    this.initialized = true;
  }

  async start(title: string, isHls: boolean): Promise<void> {
    await this.init();

    const body = isHls
      ? "Downloading HLS stream... 0%"
      : "Downloading video... 0%";

    this.activeNotificationId = await Notifications.scheduleNotificationAsync({
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

    await this.init();

    const percent = Math.round(progress * 100);
    const body = isHls
      ? `Downloading HLS stream... ${percent}%`
      : `Downloading video... ${percent}%`;

    if (this.activeNotificationId) {
      await Notifications.dismissNotificationAsync(this.activeNotificationId);
    }

    this.activeNotificationId = await Notifications.scheduleNotificationAsync({
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
    await this.init();

    if (this.activeNotificationId) {
      await Notifications.dismissNotificationAsync(this.activeNotificationId);
      this.activeNotificationId = null;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: title || "Video download",
        body: "Download complete. Available offline.",
      },
      trigger: null,
    });
  }

  async fail(title: string): Promise<void> {
    await this.init();

    if (this.activeNotificationId) {
      await Notifications.dismissNotificationAsync(this.activeNotificationId);
      this.activeNotificationId = null;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: title || "Video download",
        body: "Download failed. Please try again.",
      },
      trigger: null,
    });
  }
}

export const downloadNotificationService = new DownloadNotificationService();
