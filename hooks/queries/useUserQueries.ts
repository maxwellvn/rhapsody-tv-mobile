import { userService } from "@/services/user.service";
import {
    AddToWatchlistRequest,
    PaginatedWatchHistoryResponseDto,
    PaginatedWatchlistResponseDto,
    UpdateUserSettingsRequest,
    UserSettingsResponse,
} from "@/types/api.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const userKeys = {
  all: ["user"] as const,
  settings: () => [...userKeys.all, "settings"] as const,
  watchlist: (page: number, limit: number) =>
    [...userKeys.all, "watchlist", page, limit] as const,
  history: (page: number, limit: number) =>
    [...userKeys.all, "history", page, limit] as const,
};

export function useUserSettings() {
  return useQuery<UserSettingsResponse>({
    queryKey: userKeys.settings(),
    queryFn: async () => {
      const response = await userService.getSettings();
      return response.data;
    },
  });
}

export function useUpdateUserSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateUserSettingsRequest) => {
      const response = await userService.updateSettings(payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.settings() });
    },
  });
}

export function useWatchlist(page: number = 1, limit: number = 20) {
  return useQuery<PaginatedWatchlistResponseDto>({
    queryKey: userKeys.watchlist(page, limit),
    queryFn: async () => {
      const response = await userService.getWatchlist(page, limit);
      return response.data;
    },
  });
}

export function useAddToWatchlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AddToWatchlistRequest) => {
      await userService.addToWatchlist(payload);
      return payload;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

export function useRemoveFromWatchlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (videoId: string) => {
      await userService.removeFromWatchlist(videoId);
      return videoId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

export function useWatchHistory(page: number = 1, limit: number = 20) {
  return useQuery<PaginatedWatchHistoryResponseDto>({
    queryKey: userKeys.history(page, limit),
    queryFn: async () => {
      const response = await userService.getWatchHistory(page, limit);
      return response.data;
    },
  });
}

export function useClearWatchHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await userService.clearWatchHistory();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

export function useRemoveFromHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (videoId: string) => {
      await userService.removeFromHistory(videoId);
      return videoId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}
