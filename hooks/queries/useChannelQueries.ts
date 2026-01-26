import { channelService } from "@/services/channel.service";
import { subscriptionService } from "@/services/subscription.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Query Keys for Channels
 */
export const channelKeys = {
  all: ["channels"] as const,
  lists: () => [...channelKeys.all, "list"] as const,
  detail: (slug: string) => [...channelKeys.all, "detail", slug] as const,
  videos: (slug: string, page: number) =>
    [...channelKeys.all, "videos", slug, page] as const,
  schedule: (slug: string, date?: string) =>
    [...channelKeys.all, "schedule", slug, date] as const,
  subscriptions: () => [...channelKeys.all, "subscriptions"] as const,
  subscriptionStatus: (channelId: string) =>
    [...channelKeys.all, "subscriptionStatus", channelId] as const,
};

/**
 * Get channel details hook
 */
export function useChannel(slug: string) {
  return useQuery({
    queryKey: channelKeys.detail(slug),
    queryFn: async () => {
      const response = await channelService.getChannelBySlug(slug);
      return response.data;
    },
    enabled: !!slug,
  });
}

/**
 * Get channel videos hook
 */
export function useChannelVideos(slug: string, page = 1, limit = 20) {
  return useQuery({
    queryKey: channelKeys.videos(slug, page),
    queryFn: async () => {
      const response = await channelService.getChannelVideos(slug, page, limit);
      return response.data;
    },
    enabled: !!slug,
  });
}

/**
 * Get channel schedule hook
 */
export function useChannelSchedule(
  slug: string,
  date?: string,
  limit?: number,
) {
  return useQuery({
    queryKey: channelKeys.schedule(slug, date),
    queryFn: async () => {
      const response = await channelService.getChannelSchedule(
        slug,
        date,
        limit,
      );
      return response.data;
    },
    enabled: !!slug,
  });
}

/**
 * Get subscription status for a channel
 */
export function useChannelSubscriptionStatus(channelId?: string) {
  return useQuery({
    queryKey: channelKeys.subscriptionStatus(channelId || ""),
    queryFn: async () => {
      if (!channelId) return { isSubscribed: false };
      const response = await subscriptionService.getStatus(channelId);
      return response.data;
    },
    enabled: !!channelId,
  });
}

/**
 * Subscribe mutation
 */
export function useSubscribe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, slug }: { id: string; slug: string }) => {
      await channelService.subscribe(id);
      return { id, slug };
    },
    onSuccess: ({ slug }) => {
      // Invalidate channel details to refetch subscriber count and subscription status
      queryClient.invalidateQueries({ queryKey: channelKeys.detail(slug) });
      queryClient.invalidateQueries({ queryKey: channelKeys.subscriptions() });
    },
  });
}

/**
 * Unsubscribe mutation
 */
export function useUnsubscribe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, slug }: { id: string; slug: string }) => {
      await channelService.unsubscribe(id);
      return { id, slug };
    },
    onSuccess: ({ slug }) => {
      queryClient.invalidateQueries({ queryKey: channelKeys.detail(slug) });
      queryClient.invalidateQueries({ queryKey: channelKeys.subscriptions() });
    },
  });
}
