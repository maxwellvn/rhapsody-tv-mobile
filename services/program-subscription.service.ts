import { API_ENDPOINTS } from "@/config/api.config";
import { ApiResponse, ProgramSubscriptionStatusResponse } from "@/types/api.types";
import { api } from "./api.client";

class ProgramSubscriptionService {
  private fallbackPaths(programId: string) {
    return {
      status: [
        API_ENDPOINTS.PROGRAMS.SUBSCRIPTION_STATUS(programId),
        `/subscriptions/programs/${programId}/status`,
      ],
      subscribe: [
        API_ENDPOINTS.PROGRAMS.SUBSCRIBE(programId),
        `/subscriptions/programs/${programId}`,
        `/subscriptions/programs/${programId}/subscribe`,
      ],
      unsubscribe: [
        API_ENDPOINTS.PROGRAMS.UNSUBSCRIBE(programId),
        `/subscriptions/programs/${programId}/unsubscribe`,
      ],
    };
  }

  private async tryGet(
    urls: string[],
  ): Promise<ApiResponse<ProgramSubscriptionStatusResponse>> {
    let lastError: unknown;
    for (let index = 0; index < urls.length; index += 1) {
      const url = urls[index];
      const isFallbackAttempt = index < urls.length - 1;
      try {
        return await api.get<ProgramSubscriptionStatusResponse>(url, {
          headers: isFallbackAttempt ? { "x-silent-error-log": "1" } : undefined,
        });
      } catch (error) {
        lastError = error;
        if ((error as { statusCode?: number })?.statusCode !== 404) {
          throw error;
        }
      }
    }
    throw lastError;
  }

  private async tryPost(
    urls: string[],
  ): Promise<ApiResponse<ProgramSubscriptionStatusResponse>> {
    let lastError: unknown;
    for (let index = 0; index < urls.length; index += 1) {
      const url = urls[index];
      const isFallbackAttempt = index < urls.length - 1;
      try {
        return await api.post<ProgramSubscriptionStatusResponse>(
          url,
          undefined,
          {
            headers: isFallbackAttempt
              ? { "x-silent-error-log": "1" }
              : undefined,
          },
        );
      } catch (error) {
        lastError = error;
        if ((error as { statusCode?: number })?.statusCode !== 404) {
          throw error;
        }
      }
    }
    throw lastError;
  }

  async getStatus(
    programId: string,
  ): Promise<ApiResponse<ProgramSubscriptionStatusResponse>> {
    const endpoints = this.fallbackPaths(programId);
    return this.tryGet(endpoints.status);
  }

  async subscribe(
    programId: string,
  ): Promise<ApiResponse<ProgramSubscriptionStatusResponse>> {
    const endpoints = this.fallbackPaths(programId);
    return this.tryPost(endpoints.subscribe);
  }

  async unsubscribe(
    programId: string,
  ): Promise<ApiResponse<ProgramSubscriptionStatusResponse>> {
    const endpoints = this.fallbackPaths(programId);
    return this.tryPost(endpoints.unsubscribe);
  }
}

export const programSubscriptionService = new ProgramSubscriptionService();
