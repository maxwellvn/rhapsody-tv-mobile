import { notificationService } from "@/services/notification.service";
import { PaginatedNotificationsDto } from "@/types/api.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const notificationKeys = {
  all: ["notifications"] as const,
  list: (page: number, limit: number) =>
    [...notificationKeys.all, "list", page, limit] as const,
};

export function useNotifications(page: number = 1, limit: number = 20) {
  return useQuery<PaginatedNotificationsDto>({
    queryKey: notificationKeys.list(page, limit),
    queryFn: async () => {
      const response = await notificationService.getNotifications(page, limit);
      return response.data;
    },
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      await notificationService.markAsRead(notificationId);
      return notificationId;
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}
