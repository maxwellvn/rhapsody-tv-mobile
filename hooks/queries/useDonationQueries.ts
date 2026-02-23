import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { donationService } from "@/services/donation.service";

export const donationKeys = {
  all: ["donations"] as const,
  my: (params?: { page?: number; limit?: number }) =>
    [...donationKeys.all, "my", params] as const,
};

export function useCreatePaymentIntent() {
  return useMutation({
    mutationFn: async ({
      amount,
      currency,
    }: {
      amount: number;
      currency?: string;
    }) => {
      const response = await donationService.createPaymentIntent(
        amount,
        currency,
      );
      return response.data;
    },
  });
}

export function useCreateEspeesDonation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amount: number) => {
      const response = await donationService.createEspeesDonation(amount);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: donationKeys.all });
    },
  });
}

export function useMyDonations(page?: number, limit?: number) {
  return useQuery({
    queryKey: donationKeys.my({ page, limit }),
    queryFn: async () => {
      const response = await donationService.getMyDonations(page, limit);
      return response.data;
    },
  });
}
