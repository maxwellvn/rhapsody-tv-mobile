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
  videos: (
    slug: string,
    page: number,
    limit?: number,
    programId?: string,
  ) => [...channelKeys.all, "videos", slug, page, limit, programId] as const,
  schedule: (slug: string, date?: string) =>
    [...channelKeys.all, "schedule", slug, date] as const,
  livestreams: (
    slug: string,
    limit?: number,
    status?: "scheduled" | "live" | "ended" | "canceled",
  ) =>
    [...channelKeys.all, "livestreams", slug, limit, status] as const,
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
    refetchInterval: 2 * 60_000,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    refetchOnReconnect: true,
  });
}

/**
 * Get channel videos hook
 */
export function useChannelVideos(
  slug: string,
  page = 1,
  limit = 20,
  programId?: string,
) {
  return useQuery({
    queryKey: channelKeys.videos(slug, page, limit, programId),
    queryFn: async () => {
      const response = await channelService.getChannelVideos(
        slug,
        page,
        limit,
        programId,
      );
      return response.data;
    },
    enabled: !!slug,
    refetchInterval: 2 * 60_000,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    refetchOnReconnect: true,
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
    refetchInterval: 3 * 60_000,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    refetchOnReconnect: true,
  });
}

/**
 * Get channel livestreams hook
 */
export function useChannelLivestreams(
  slug: string,
  limit?: number,
  status?: "scheduled" | "live" | "ended" | "canceled",
) {
  return useQuery({
    queryKey: channelKeys.livestreams(slug, limit, status),
    queryFn: async () => {
      const response = await channelService.getChannelLivestreams(
        slug,
        limit,
        status,
      );
      return response.data;
    },
    enabled: !!slug,
    refetchInterval: 30_000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    refetchOnReconnect: true,
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
    mutationFn: async ({ id, slug }: { id: string; slug?: string }) => {
      await channelService.subscribe(id);
      return { id, slug };
    },
    onSuccess: ({ id, slug }) => {
      // Invalidate channel details to refetch subscriber count and subscription status
      if (slug) {
        queryClient.invalidateQueries({ queryKey: channelKeys.detail(slug) });
      }
      queryClient.invalidateQueries({ queryKey: channelKeys.subscriptions() });
      queryClient.invalidateQueries({
        queryKey: channelKeys.subscriptionStatus(id),
      });
    },
  });
}

/**
 * Unsubscribe mutation
 */
export function useUnsubscribe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, slug }: { id: string; slug?: string }) => {
      await channelService.unsubscribe(id);
      return { id, slug };
    },
    onSuccess: ({ id, slug }) => {
      if (slug) {
        queryClient.invalidateQueries({ queryKey: channelKeys.detail(slug) });
      }
      queryClient.invalidateQueries({ queryKey: channelKeys.subscriptions() });
      queryClient.invalidateQueries({
        queryKey: channelKeys.subscriptionStatus(id),
      });
    },
  });
}
