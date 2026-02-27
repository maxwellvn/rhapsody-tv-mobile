import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, AppStateStatus } from 'react-native';
import { API_CONFIG } from '@/config/api.config';
import { STORAGE_KEYS } from '@/utils/storage';
import { Platform } from 'react-native';

const LAST_CHECK_KEY = '@rhapsody_tv/bg_notif_last_check';
let pollingInterval: ReturnType<typeof setInterval> | null = null;

/**
 * Polls the API for new notifications and shows them as local notifications.
 * Runs on a timer when the app is backgrounded (AppState !== 'active').
 */
async function checkForNewNotifications(): Promise<void> {
  try {
    const tokenRaw = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (!tokenRaw) return;

    const token = JSON.parse(tokenRaw) as string;
    if (!token) return;

    const lastCheck = await AsyncStorage.getItem(LAST_CHECK_KEY);
    const lastCheckDate = lastCheck
      ? new Date(lastCheck)
      : new Date(Date.now() - 5 * 60 * 1000);

    const response = await fetch(
      `${API_CONFIG.BASE_URL}/notifications?page=1&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      },
    );

    if (!response.ok) return;

    const json = await response.json();
    const notifications: Array<{
      id: string;
      title: string;
      body: string;
      type: string;
      isRead: boolean;
      data?: Record<string, unknown>;
      createdAt: string;
    }> = json?.data?.notifications ?? [];

    const newNotifications = notifications.filter((n) => {
      if (n.isRead) return false;
      const created = new Date(n.createdAt);
      return created > lastCheckDate;
    });

    await AsyncStorage.setItem(LAST_CHECK_KEY, new Date().toISOString());

    if (newNotifications.length === 0) return;

    const Notifications = await import('expo-notifications');

    for (const item of newNotifications.slice(0, 5)) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: item.title,
          body: item.body,
          sound: true,
          ...(Platform.OS === 'android' ? { channelId: 'admin-alerts' } : {}),
          data: {
            ...(item.data || {}),
            type: item.type,
          },
        },
        trigger: null,
      });
    }
  } catch {
    // Silently fail — background polling should not crash the app
  }
}

function startPolling() {
  if (pollingInterval) return;
  // Poll every 30 seconds while app is in background/inactive
  pollingInterval = setInterval(checkForNewNotifications, 30_000);
  // Also check immediately
  checkForNewNotifications();
}

function stopPolling() {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
}

let appStateSubscription: ReturnType<typeof AppState.addEventListener> | null = null;

/**
 * Register background notification polling. Call once at app startup.
 * Polls the API when the app is backgrounded and shows local notifications.
 */
export function registerBackgroundNotificationTask(): void {
  if (appStateSubscription) return;

  const handleAppStateChange = (state: AppStateStatus) => {
    if (state === 'active') {
      // App came to foreground — stop polling (NotificationRuntimeSync handles it)
      stopPolling();
    } else {
      // App went to background — start polling
      startPolling();
    }
  };

  appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

  // If app is already backgrounded, start immediately
  if (AppState.currentState !== 'active') {
    startPolling();
  }
}

/**
 * Unregister background notification polling (e.g. on logout).
 */
export function unregisterBackgroundNotificationTask(): void {
  stopPolling();
  if (appStateSubscription) {
    appStateSubscription.remove();
    appStateSubscription = null;
  }
  AsyncStorage.removeItem(LAST_CHECK_KEY).catch(() => null);
}
