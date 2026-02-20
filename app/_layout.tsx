import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import Constants from 'expo-constants';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Href, router, Stack, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { LogBox } from 'react-native';
import 'react-native-reanimated';
import '../global.css';

// expo-notifications remote push is unsupported in Expo Go since SDK 53.
// Local notifications (download progress) still work fine in dev builds.
LogBox.ignoreLogs(['expo-notifications: Android Push notifications']);

import { GlobalMiniPlayer } from '@/components/GlobalMiniPlayer';
import { GlobalLoader } from '@/components/global-loader';
import { AppProvider } from '@/context/AppProvider';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/hooks/queries/useNotificationQueries';
import { VideoOverlayProvider } from '@/context/VideoOverlayContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { scheduleReminderNotificationService } from '@/services/schedule-reminder-notification.service';
import { useRef } from 'react';

export const unstable_settings = {
  anchor: '(tabs)',
};

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function AuthNavigationGuard() {
  const segments = useSegments();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    const root = segments[0];
    const isAuthArea = root === '(auth)';
    const isOnboarding = root === 'onboarding';
    const isSplashIndex = root === undefined;
    const isAuthCallback = root === 'auth' || root === 'kingschat-callback';
    const isPublicRoute =
      isAuthArea || isOnboarding || isSplashIndex || isAuthCallback;

    if (!isAuthenticated && !isPublicRoute) {
      router.replace({ pathname: '/(auth)/signin', params: { tab: 'signin' } });
      return;
    }

    if (isAuthenticated && (isAuthArea || isOnboarding || isSplashIndex)) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments]);

  return null;
}

function NotificationRuntimeSync() {
  const { isAuthenticated } = useAuth();
  const { data } = useNotifications(1, 20);
  const seenNotificationIdsRef = useRef<Set<string>>(new Set());
  const initializedRef = useRef(false);
  const isExpoGo = Constants.appOwnership === 'expo';

  useEffect(() => {
    if (isExpoGo) {
      return;
    }

    if (!isAuthenticated) {
      seenNotificationIdsRef.current.clear();
      initializedRef.current = false;
      void import('expo-notifications')
        .then((Notifications) => Notifications.setBadgeCountAsync(0))
        .catch(() => null);
      return;
    }

    if (!data) return;

    const notifications = data.notifications ?? [];
    const unreadCount =
      typeof data.unreadCount === 'number'
        ? Math.max(0, data.unreadCount)
        : notifications.filter((item) => !item.isRead).length;

    void import('expo-notifications')
      .then(async (Notifications) => {
        await Notifications.setBadgeCountAsync(unreadCount);
      })
      .catch(() => null);

    if (!initializedRef.current) {
      notifications.forEach((item) => seenNotificationIdsRef.current.add(item.id));
      initializedRef.current = true;
      return;
    }

    const newlyArrived = notifications.filter((item) => {
      if (seenNotificationIdsRef.current.has(item.id)) return false;
      if (item.isRead) return false;
      if (
        item.type === 'channel_new_video' ||
        item.type === 'channel_go_live' ||
        item.type === 'channel_new_program'
      ) {
        return true;
      }

      if (item.type === 'announcement') {
        const event = item.data?.event;
        return event === 'channel_added';
      }

      return false;
    });

    notifications.forEach((item) => seenNotificationIdsRef.current.add(item.id));

    if (newlyArrived.length === 0) return;

    void import('expo-notifications')
      .then(async (Notifications) => {
        for (const item of newlyArrived.slice(0, 3)) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: item.title,
              body: item.body,
              data: {
                ...(item.data || {}),
                type: item.type,
              },
              sound: true,
            },
            trigger: null,
          });
        }
      })
      .catch(() => null);
  }, [data, isAuthenticated, isExpoGo]);

  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded, error] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useEffect(() => {
    // Avoid Expo Go startup issues: expo-notifications push features are limited there.
    if (Constants.appOwnership === 'expo') {
      return;
    }

    scheduleReminderNotificationService.initialize(true).catch(() => {
      // Keep app startup resilient even if notifications init fails.
    });
  }, []);

  useEffect(() => {
    // Expo Go (SDK 53+) no longer supports remote push via expo-notifications.
    // Keep this listener only for dev builds / standalone apps.
    if (Constants.appOwnership === 'expo') {
      return;
    }

    let cleanup: (() => void) | undefined;

    const pickStringFromPayload = (
      payload: Record<string, unknown>,
      paths: string[][],
    ): string | undefined => {
      for (const path of paths) {
        let current: unknown = payload;
        for (const key of path) {
          if (!current || typeof current !== 'object') {
            current = undefined;
            break;
          }
          current = (current as Record<string, unknown>)[key];
        }

        if (typeof current === 'string' && current.trim().length > 0) {
          return current.trim();
        }
      }

      return undefined;
    };

    const resolveRouteFromPayload = (payload: Record<string, unknown>): Href => {
      const isLikelyObjectId = (value?: string) =>
        !!value && /^[a-fA-F0-9]{24}$/.test(value);
      const videoId = pickStringFromPayload(payload, [
        ['videoId'],
        ['video', 'id'],
        ['video', '_id'],
      ]);
      const livestreamId = pickStringFromPayload(payload, [
        ['livestreamId'],
        ['liveStreamId'],
        ['livestream', 'id'],
        ['livestream', '_id'],
      ]);
      const programId = pickStringFromPayload(payload, [
        ['programId'],
        ['program', 'id'],
        ['program', '_id'],
      ]);
      const channelId = pickStringFromPayload(payload, [
        ['channelId'],
        ['channel', 'id'],
        ['channel', '_id'],
      ]);
      const channelSlug = pickStringFromPayload(payload, [
        ['channelSlug'],
        ['channel', 'slug'],
      ]);
      const type = typeof payload.type === 'string' ? payload.type : undefined;

      if (isLikelyObjectId(videoId))
        return ({ pathname: '/video', params: { id: videoId } } as Href);
      if (isLikelyObjectId(livestreamId))
        return ({ pathname: '/live-video', params: { liveStreamId: livestreamId } } as Href);
      if (isLikelyObjectId(programId)) {
        return ({
          pathname: '/program-profile',
          params: {
            id: programId,
            channelId: channelId || '',
            channelSlug: channelSlug || '',
          },
        } as Href);
      }
      if (channelSlug) return ('/(tabs)' as Href);
      if (type === 'program_reminder') return ('/(tabs)/schedule' as Href);
      return ('/notifications' as Href);
    };

    const navigateFromResponse = (
      response: {
        notification: { request: { content: { data: unknown } } };
      } | null,
    ) => {
      if (!response) return;
      const payload = response.notification.request.content.data as
        | Record<string, unknown>
        | undefined;
      if (!payload) return;
      router.push(resolveRouteFromPayload(payload));
    };

    void import('expo-notifications')
      .then((Notifications) => {
        Notifications.getLastNotificationResponseAsync()
          .then((response) => navigateFromResponse(response as any))
          .catch(() => null);

        const subscription =
          Notifications.addNotificationResponseReceivedListener((response) =>
            navigateFromResponse(response as any),
          );

        cleanup = () => {
          subscription.remove();
        };
      })
      .catch(() => null);

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  if (!loaded && !error) {
    return null;
  }

  return (
    <AppProvider>
      <AuthNavigationGuard />
      <NotificationRuntimeSync />
      <VideoOverlayProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen
              name="index"
              options={{
                headerShown: false,
                contentStyle: { backgroundColor: '#ffffff' }
              }}
            />
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="kingschat-callback"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="auth/kingschat/callback"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="watch-history" options={{ headerShown: false }} />
            <Stack.Screen name="watchlist" options={{ headerShown: false }} />
          </Stack>
          <GlobalLoader />
          <GlobalMiniPlayer />
          <StatusBar style="auto" />
        </ThemeProvider>
      </VideoOverlayProvider>
    </AppProvider>
  );
}
