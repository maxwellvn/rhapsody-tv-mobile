import { notificationService } from "@/services/notification.service";
import { PaginatedNotificationsDto } from "@/types/api.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

export const notificationKeys = {
  all: ["notifications"] as const,
  list: (page: number, limit: number) =>
    [...notificationKeys.all, "list", page, limit] as const,
};

export function useNotifications(page: number = 1, limit: number = 20) {
  const { isAuthenticated } = useAuth();
  return useQuery<PaginatedNotificationsDto>({
    queryKey: notificationKeys.list(page, limit),
    queryFn: async () => {
      const response = await notificationService.getNotifications(page, limit);
      return response.data;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 10,
    refetchInterval: 1000 * 10,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: "always",
  });
}

export function useUnreadNotificationCount() {
  const { data } = useNotifications(1, 20);
  if (!data) return 0;
  if (typeof data.unreadCount === "number") return Math.max(0, data.unreadCount);
  return data.notifications.filter((item) => !item.isRead).length;
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      await notificationService.markAsRead(notificationId);
      return notificationId;
    },
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all });

      const snapshots = queryClient.getQueriesData<PaginatedNotificationsDto>({
        queryKey: notificationKeys.all,
      });

      snapshots.forEach(([key, data]) => {
        if (!data) return;
        queryClient.setQueryData<PaginatedNotificationsDto>(key, {
          ...data,
          notifications: data.notifications.map((item) =>
            item.id === notificationId ? { ...item, isRead: true } : item,
          ),
        });
      });

      return { snapshots };
    },
    onError: (_error, _notificationId, context) => {
      context?.snapshots?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await notificationService.markAllAsRead();
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all });

      const snapshots = queryClient.getQueriesData<PaginatedNotificationsDto>({
        queryKey: notificationKeys.all,
      });

      snapshots.forEach(([key, data]) => {
        if (!data) return;
        queryClient.setQueryData<PaginatedNotificationsDto>(key, {
          ...data,
          notifications: data.notifications.map((item) => ({
            ...item,
            isRead: true,
          })),
        });
      });

      return { snapshots };
    },
    onError: (_error, _variables, context) => {
      context?.snapshots?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      await notificationService.deleteNotification(notificationId);
      return notificationId;
    },
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all });

      const snapshots = queryClient.getQueriesData<PaginatedNotificationsDto>({
        queryKey: notificationKeys.all,
      });

      snapshots.forEach(([key, data]) => {
        if (!data) return;
        queryClient.setQueryData<PaginatedNotificationsDto>(key, {
          ...data,
          notifications: data.notifications.filter(
            (item) => item.id !== notificationId,
          ),
          total: Math.max(0, data.total - 1),
        });
      });

      return { snapshots };
    },
    onError: (_error, _notificationId, context) => {
      context?.snapshots?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}
