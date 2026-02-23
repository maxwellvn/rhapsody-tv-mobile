import { API_ENDPOINTS } from "@/config/api.config";
import { ApiResponse } from "@/types/api.types";
import { api } from "./api.client";

export interface PaymentIntentResponse {
  clientSecret: string;
  donationId: string;
  publishableKey: string;
}

export interface EspeesDonationResponse {
  donationId: string;
  status: string;
}

export interface DonationRecord {
  id: string;
  amount: number;
  currency: string;
  method: "stripe" | "espees";
  status: "pending" | "completed" | "failed" | "refunded";
  createdAt: string;
}

export interface MyDonationsResponse {
  donations: DonationRecord[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

class DonationService {
  async createPaymentIntent(
    amount: number,
    currency?: string,
  ): Promise<ApiResponse<PaymentIntentResponse>> {
    return api.post<PaymentIntentResponse>(
      API_ENDPOINTS.DONATIONS.PAYMENT_INTENT,
      { amount, currency },
    );
  }

  async confirmDonation(
    donationId: string,
  ): Promise<ApiResponse<{ donationId: string; status: string }>> {
    return api.post<{ donationId: string; status: string }>(
      API_ENDPOINTS.DONATIONS.CONFIRM(donationId),
      {},
    );
  }

  async createEspeesDonation(
    amount: number,
  ): Promise<ApiResponse<EspeesDonationResponse>> {
    return api.post<EspeesDonationResponse>(API_ENDPOINTS.DONATIONS.ESPEES, {
      amount,
    });
  }

  async getMyDonations(
    page?: number,
    limit?: number,
  ): Promise<ApiResponse<MyDonationsResponse>> {
    const params = new URLSearchParams();
    if (page) params.append("page", page.toString());
    if (limit) params.append("limit", limit.toString());
    const query = params.toString();
    const url = query
      ? `${API_ENDPOINTS.DONATIONS.MY}?${query}`
      : API_ENDPOINTS.DONATIONS.MY;
    return api.get<MyDonationsResponse>(url);
  }
}

export const donationService = new DonationService();
