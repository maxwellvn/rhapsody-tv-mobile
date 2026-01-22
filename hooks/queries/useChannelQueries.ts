import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api.client';
import { API_ENDPOINTS } from '@/config/api.config';
import { Channel, Video, PaginatedResponse } from '@/types/api.types';

/**
 * Query Keys for Channels
 */
export const channelKeys = {
  all: ['channels'] as const,
  lists: () => [...channelKeys.all, 'list'] as const,
  detail: (id: string) => [...channelKeys.all, 'detail', id] as const,
  videos: (id: string) => [...channelKeys.all, 'videos', id] as const,
  subscriptions: () => [...channelKeys.all, 'subscriptions'] as const,
};

/**
 * Get channel details
 */
export function useChannel(channelId: string) {
  return useQuery({
    queryKey: channelKeys.detail(channelId),
    queryFn: async () => {
      const response = await api.get<Channel>(
        API_ENDPOINTS.CHANNELS.DETAILS(channelId)
      );
      return response.data;
    },
    enabled: !!channelId,
  });
}

/**
 * Get channel videos
 */
export function useChannelVideos(channelId: string, page = 1) {
  return useQuery({
    queryKey: [...channelKeys.videos(channelId), page],
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<Video>>(
        API_ENDPOINTS.CHANNELS.VIDEOS(channelId),
        { params: { page, limit: 20 } }
      );
      return response.data;
    },
    enabled: !!channelId,
  });
}

/**
 * Get user subscriptions
 */
export function useSubscriptions() {
  return useQuery({
    queryKey: channelKeys.subscriptions(),
    queryFn: async () => {
      const response = await api.get<Channel[]>(
        API_ENDPOINTS.CHANNELS.SUBSCRIPTIONS
      );
      return response.data;
    },
  });
}

/**
 * Subscribe to channel
 */
export function useSubscribe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (channelId: string) => {
      await api.post(API_ENDPOINTS.CHANNELS.SUBSCRIBE(channelId));
      return channelId;
    },
    onSuccess: (channelId) => {
      // Update channel detail cache
      queryClient.setQueryData(channelKeys.detail(channelId), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          isSubscribed: true,
          subscriberCount: old.subscriberCount + 1,
        };
      });
      
      // Invalidate subscriptions list
      queryClient.invalidateQueries({ 
        queryKey: channelKeys.subscriptions() 
      });
    },
  });
}

/**
 * Unsubscribe from channel
 */
export function useUnsubscribe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (channelId: string) => {
      await api.post(API_ENDPOINTS.CHANNELS.UNSUBSCRIBE(channelId));
      return channelId;
    },
    onSuccess: (channelId) => {
      queryClient.setQueryData(channelKeys.detail(channelId), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          isSubscribed: false,
          subscriberCount: Math.max(0, old.subscriberCount - 1),
        };
      });
      
      queryClient.invalidateQueries({ 
        queryKey: channelKeys.subscriptions() 
      });
    },
  });
}
