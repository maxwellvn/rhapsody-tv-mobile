import { API_ENDPOINTS } from "@/config/api.config";
import {
  ApiResponse,
  AuthResponse,
  KingsChatLoginRequest,
  LoginRequest,
  RegisterRequest,
} from "@/types/api.types";
import { api } from "./api.client";

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
class AuthService {
  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
  }

  /**
   * Login with KingsChat
   */
  async loginWithKingsChat(
    payload: KingsChatLoginRequest,
  ): Promise<ApiResponse<AuthResponse>> {
    return api.post<AuthResponse>(API_ENDPOINTS.AUTH.KINGSCHAT, payload);
  }

  /**
   * Register new user
   */
  async register(
    userData: RegisterRequest,
  ): Promise<ApiResponse<AuthResponse>> {
    return api.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, userData);
  }

  /**
   * Logout user
   */
  async logout(): Promise<ApiResponse<void>> {
    return api.post<void>(API_ENDPOINTS.AUTH.LOGOUT);
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthResponse>> {
    return api.post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
      refreshToken,
    });
  }

  /**
   * Request email verification code
   */
  async requestEmailVerification(
    email: string,
  ): Promise<ApiResponse<{ email: string }>> {
    return api.post<{ email: string }>(
      API_ENDPOINTS.AUTH.REQUEST_EMAIL_VERIFICATION,
      { email },
    );
  }

  /**
   * Verify email with 6-digit code
   */
  async verifyEmail(email: string, code: string): Promise<ApiResponse<{}>> {
    return api.post<{}>(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { email, code });
  }

  /**
   * Forgot password
   */
  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    return api.post<void>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  }

  /**
   * Reset password
   */
  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<ApiResponse<void>> {
    return api.post<void>(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      token,
      newPassword,
    });
  }

  /**
   * Change password
   */
  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<ApiResponse<void>> {
    return api.post<void>(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
    });
  }
}

export const authService = new AuthService();
