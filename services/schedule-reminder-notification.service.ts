import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { Platform } from "react-native";

const REMINDER_CHANNEL_ID = "program-reminders";
const STORAGE_KEY = "@rhapsody_tv/program_reminders";

type NotificationsModule = typeof import("expo-notifications");

type ReminderRecord = {
  slotId: string;
  title: string;
  startTime: string;
  notificationId: string;
  createdAt: string;
};

type ReminderMap = Record<string, ReminderRecord>;

class ScheduleReminderNotificationService {
  private notifications: NotificationsModule | null = null;
  private notificationsUnavailable = false;
  private notificationHandlerSet = false;

  private getReminderKey(slotId: string, startTime: string): string {
    return `${slotId}:${new Date(startTime).toISOString()}`;
  }

  private async getNotifications(): Promise<NotificationsModule | null> {
    if (this.notificationsUnavailable) {
      return null;
    }

    if (this.notifications) {
      return this.notifications;
    }

    // Expo Go does not support required notifications APIs on Android.
    // Keep app stable there and enable full behavior in dev/standalone builds.
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
            shouldPlaySound: true,
            shouldSetBadge: true,
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

  private async readReminderMap(): Promise<ReminderMap> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      return JSON.parse(raw) as ReminderMap;
    } catch {
      return {};
    }
  }

  private async writeReminderMap(value: ReminderMap): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  }

  async initialize(requestPermissions: boolean = false): Promise<boolean> {
    const notifications = await this.getNotifications();
    if (!notifications) {
      return false;
    }

    try {
      if (Platform.OS === "android") {
        await notifications.setNotificationChannelAsync(REMINDER_CHANNEL_ID, {
          name: "Program reminders",
          importance: notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
        });
      }

      if (!requestPermissions) {
        return true;
      }

      const permissions = await notifications.getPermissionsAsync();
      if (permissions.status === "granted") {
        return true;
      }

      const request = await notifications.requestPermissionsAsync();
      return request.status === "granted";
    } catch {
      this.notificationsUnavailable = true;
      this.notifications = null;
      return false;
    }
  }

  async getReminderState(
    reminders: { slotId: string; startTime: string }[],
  ): Promise<Record<string, boolean>> {
    const reminderMap = await this.readReminderMap();
    const state: Record<string, boolean> = {};

    reminders.forEach(({ slotId, startTime }) => {
      const key = this.getReminderKey(slotId, startTime);
      state[key] = !!reminderMap[key];
    });

    return state;
  }

  async toggleProgramReminder(params: {
    slotId: string;
    title: string;
    startTime: string;
  }): Promise<{ scheduled: boolean; key: string }> {
    const { slotId, title, startTime } = params;
    const key = this.getReminderKey(slotId, startTime);

    const notifications = await this.getNotifications();
    if (!notifications) {
      throw new Error("NOTIFICATIONS_UNAVAILABLE");
    }

    const reminderMap = await this.readReminderMap();
    const existingReminder = reminderMap[key];

    if (existingReminder) {
      try {
        await notifications.cancelScheduledNotificationAsync(
          existingReminder.notificationId,
        );
      } catch {
        // Ignore stale notification IDs.
      }
      delete reminderMap[key];
      await this.writeReminderMap(reminderMap);
      return { scheduled: false, key };
    }

    const permissionGranted = await this.initialize(true);
    if (!permissionGranted) {
      throw new Error("NOTIFICATION_PERMISSION_DENIED");
    }

    const startAt = new Date(startTime);
    if (startAt.getTime() <= Date.now() + 3000) {
      throw new Error("PROGRAM_ALREADY_STARTED");
    }

    let notificationId: string;
    try {
      notificationId = await notifications.scheduleNotificationAsync({
        content: {
          title: "Program reminder",
          body: `"${title}" is starting now.`,
          sound: true,
          data: {
            type: "program_reminder",
            slotId,
            startTime,
          },
        },
        trigger: {
          type: "date",
          date: startAt,
          channelId: Platform.OS === "android" ? REMINDER_CHANNEL_ID : undefined,
        } as any,
      });
    } catch {
      this.notificationsUnavailable = true;
      this.notifications = null;
      throw new Error("NOTIFICATIONS_UNAVAILABLE");
    }

    reminderMap[key] = {
      slotId,
      title,
      startTime: startAt.toISOString(),
      notificationId,
      createdAt: new Date().toISOString(),
    };
    await this.writeReminderMap(reminderMap);
    return { scheduled: true, key };
  }

  async ensureProgramReminder(params: {
    slotId: string;
    title: string;
    startTime: string;
  }): Promise<{ scheduled: boolean; key: string }> {
    const { slotId, title, startTime } = params;
    const key = this.getReminderKey(slotId, startTime);
    const reminderMap = await this.readReminderMap();

    if (reminderMap[key]) {
      return { scheduled: false, key };
    }

    const permissionGranted = await this.initialize(false);
    if (!permissionGranted) {
      return { scheduled: false, key };
    }

    const startAt = new Date(startTime);
    if (startAt.getTime() <= Date.now() + 3000) {
      return { scheduled: false, key };
    }

    const notifications = await this.getNotifications();
    if (!notifications) {
      return { scheduled: false, key };
    }

    let notificationId: string;
    try {
      notificationId = await notifications.scheduleNotificationAsync({
        content: {
          title: "Program reminder",
          body: `"${title}" is starting now.`,
          sound: true,
          data: {
            type: "program_reminder",
            slotId,
            startTime,
          },
        },
        trigger: {
          type: "date",
          date: startAt,
          channelId: Platform.OS === "android" ? REMINDER_CHANNEL_ID : undefined,
        } as any,
      });
    } catch {
      this.notificationsUnavailable = true;
      this.notifications = null;
      return { scheduled: false, key };
    }

    reminderMap[key] = {
      slotId,
      title,
      startTime: startAt.toISOString(),
      notificationId,
      createdAt: new Date().toISOString(),
    };
    await this.writeReminderMap(reminderMap);
    return { scheduled: true, key };
  }
}

export const scheduleReminderNotificationService =
  new ScheduleReminderNotificationService();
