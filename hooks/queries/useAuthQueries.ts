import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/auth.service";
import { kingsChatService } from "@/services/kingschat.service";
import { userService } from "@/services/user.service";
import { LoginRequest, RegisterRequest } from "@/types/api.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";

/**
 * Query Keys for Authentication
 */
export const authKeys = {
  all: ["auth"] as const,
  profile: () => [...authKeys.all, "profile"] as const,
  preferences: () => [...authKeys.all, "preferences"] as const,
};

/**
 * Get user profile query
 */
export function useUserProfile() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: async () => {
      const response = await userService.getProfile();
      return response.data;
    },
    enabled: isAuthenticated, // Only fetch if user is logged in
  });
}

/**
 * Login mutation
 */
export function useLogin() {
  const { login } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const response = await authService.login(credentials);
      return response.data;
    },
    onSuccess: async (data) => {
      // Save auth data to context
      await login(data);

      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: authKeys.all });

      // Navigate to home
      router.replace("/(tabs)");
    },
    onError: (error: any) => {
      console.error("Login error:", error);
    },
  });
}

/**
 * Register mutation
 */
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: RegisterRequest) => {
      const response = await authService.register(userData);
      return response.data;
    },
    onSuccess: async (data) => {
      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
    onError: (error: any) => {
      console.error("Registration error:", error);
    },
  });
}

/**
 * KingsChat login mutation
 */
export function useKingsChatLogin() {
  const { login } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const kingsChatTokens = await kingsChatService.login();
      const response = await authService.loginWithKingsChat({
        accessToken: kingsChatTokens.accessToken,
        refreshToken: kingsChatTokens.refreshToken,
      });

      return response.data;
    },
    onSuccess: async (data) => {
      await login(data);
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
    onError: (error: any) => {
      console.error("KingsChat login error:", error);
    },
  });
}

/**
 * Logout mutation
 */
export function useLogout() {
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await authService.logout();
    },
    onSuccess: async () => {
      // Clear auth state
      await logout();

      // Clear all queries
      queryClient.clear();

      // Navigate to auth entry
      router.replace({ pathname: "/(auth)/signin", params: { tab: "signin" } });
    },
  });
}

/**
 * Update profile mutation
 */
export function useUpdateProfile() {
  const { updateUser } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await userService.updateProfile(data);
      return response.data;
    },
    onSuccess: (data) => {
      // Update auth context
      updateUser(data);

      // Invalidate profile query
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
  });
}

/**
 * Verify email mutation
 */
export function useVerifyEmail() {
  return useMutation({
    mutationFn: async ({ email, code }: { email: string; code: string }) => {
      const response = await authService.verifyEmail(email, code);
      return response;
    },
    onError: (error: any) => {
      console.error("Email verification error:", error);
    },
  });
}

/**
 * Request email verification mutation
 */
export function useRequestEmailVerification() {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await authService.requestEmailVerification(email);
      return response.data;
    },
    onError: (error: any) => {
      console.error("Request verification error:", error);
    },
  });
}
