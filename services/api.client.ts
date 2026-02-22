import { API_CONFIG } from "@/config/api.config";
import { ApiError, ApiResponse } from "@/types/api.types";
import { storage } from "@/utils/storage";
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

/**
 * Create Axios instance with default configuration
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const API_DEBUG_LOGS_ENABLED =
  __DEV__ && process.env.EXPO_PUBLIC_API_DEBUG_LOGS === "1";

/**
 * Request Interceptor
 * Adds authentication token to all requests
 */
apiClient.interceptors.request.use(
  async (config) => {
    // Get access token from storage
    const token = await storage.getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // // Log request in development
    // if (__DEV__) {
    //   console.log(`📤 API Request: ${JSON.stringify(config)}`);
    // }

    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  },
);

/**
 * Response Interceptor
 * Handles errors and token refresh
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // Log response in development
    if (API_DEBUG_LOGS_ENABLED) {
      console.log(`📥 API Response: ${JSON.stringify(response.data)}`);
    }

    return response;
  },
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
      skipToast?: boolean;
    };
    const suppressErrorLog =
      error.config?.headers &&
      ((error.config.headers as Record<string, unknown>)["x-silent-error-log"] ===
        "1" ||
        (error.config.headers as Record<string, unknown>)["x-silent-error-log"] ===
          1);

    // Log error in development
    if (API_DEBUG_LOGS_ENABLED && !suppressErrorLog) {
      console.log("📥 API Error Response:", error);
      console.error("❌ API Error:", {
        status: error.response?.status,
        url: error.config?.url,
        success: false,
      });
    }

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshToken = await storage.getRefreshToken();

        if (refreshToken) {
          const response = await axios.post(
            `${API_CONFIG.BASE_URL}/auth/refresh`,
            { refreshToken },
          );

          const { accessToken, refreshToken: newRefreshToken } =
            response.data.data;

          // Save new tokens
          await storage.saveTokens(accessToken, newRefreshToken);

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }

          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - clear tokens and redirect to login
        await storage.clearTokens();
        await storage.clearUserData();

        // You can emit an event here to navigate to login
        // EventEmitter.emit('UNAUTHORIZED');

        return Promise.reject(refreshError);
      }
    }

    // Handle stale auth when switching environments (e.g. prod token on local DB)
    if (error.response?.status === 404 && error.config?.url === "/users/me") {
      await storage.clearTokens();
      await storage.clearUserData();
    }

    return Promise.reject(error);
  },
);

/**
 * API Client Class with typed methods
 */
class ApiClient {
  /**
   * GET request
   */
  async get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.get<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * POST request
   */
  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.post<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * PUT request
   */
  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.put<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * PATCH request
   */
  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.patch<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * DELETE request
   */
  async delete<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.delete<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Upload file with multipart/form-data
   */
  async upload<T>(
    url: string,
    formData: FormData,
    onUploadProgress?: (progressEvent: any) => void,
  ): Promise<ApiResponse<T>> {
    void onUploadProgress;
    try {
      const token = await storage.getAccessToken();
      const controller = new AbortController();
      const timeout = setTimeout(
        () => controller.abort(),
        Math.max(API_CONFIG.TIMEOUT, 120000),
      );

      const response = await fetch(`${API_CONFIG.BASE_URL}${url}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
        signal: controller.signal,
      });
      clearTimeout(timeout);

      const responseBody = await response.json().catch(() => null);

      if (!response.ok) {
        throw {
          isUploadHttpError: true,
          status: response.status,
          data: responseBody,
        };
      }

      return responseBody as ApiResponse<T>;
    } catch (error) {
      if ((error as any)?.isUploadHttpError) {
        const httpError = error as {
          status: number;
          data?: { message?: string; errors?: unknown };
        };
        throw {
          success: false,
          message: httpError.data?.message || "Upload failed",
          errors: httpError.data?.errors,
          statusCode: httpError.status,
        } as ApiError;
      }
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): ApiError {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiError>;

      if (axiosError.response) {
        // Server responded with error
        return {
          success: false,
          message: axiosError.response.data?.message || "An error occurred",
          errors: axiosError.response.data?.errors,
          statusCode: axiosError.response.status,
        };
      } else if (axiosError.request) {
        // Request made but no response
        return {
          success: false,
          message:
            "No response from server. Please check your internet connection.",
          statusCode: 0,
        };
      }
    }

    // Unknown error
    return {
      success: false,
      message: "An unexpected error occurred",
      statusCode: 500,
    };
  }
}

export const api = new ApiClient();
export default apiClient;
