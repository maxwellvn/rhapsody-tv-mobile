import { programSubscriptionService } from "@/services/program-subscription.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const programSubscriptionKeys = {
  all: ["program-subscriptions"] as const,
  status: (programId: string) =>
    [...programSubscriptionKeys.all, "status", programId] as const,
};

export function useProgramSubscriptionStatus(programId?: string) {
  return useQuery({
    queryKey: programSubscriptionKeys.status(programId || ""),
    queryFn: async () => {
      if (!programId) {
        return { programId: "", isSubscribed: false, subscriberCount: 0 };
      }
      const response = await programSubscriptionService.getStatus(programId);
      return response.data;
    },
    enabled: !!programId,
  });
}

export function useProgramSubscribe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (programId: string) => {
      const response = await programSubscriptionService.subscribe(programId);
      return response.data;
    },
    onSuccess: (_data, programId) => {
      queryClient.invalidateQueries({
        queryKey: programSubscriptionKeys.status(programId),
      });
    },
  });
}

export function useProgramUnsubscribe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (programId: string) => {
      const response = await programSubscriptionService.unsubscribe(programId);
      return response.data;
    },
    onSuccess: (_data, programId) => {
      queryClient.invalidateQueries({
        queryKey: programSubscriptionKeys.status(programId),
      });
    },
  });
}
