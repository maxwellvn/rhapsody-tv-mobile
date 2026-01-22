import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { userService } from '@/services/user.service';
import { useAuth } from '@/context/AuthContext';
import { LoginRequest, RegisterRequest } from '@/types/api.types';
import { router } from 'expo-router';

/**
 * Query Keys for Authentication
 */
export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
  preferences: () => [...authKeys.all, 'preferences'] as const,
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
      router.replace('/(tabs)');
    },
    onError: (error: any) => {
      console.error('Login error:', error);
    },
  });
}

/**
 * Register mutation
 */
export function useRegister() {
  const { login } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: RegisterRequest) => {
      const response = await authService.register(userData);
      return response.data;
    },
    onSuccess: async (data) => {
      // Save auth data to context
      await login(data);
      
      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: authKeys.all });
      
      // Navigate to home
      router.replace('/(tabs)');
    },
    onError: (error: any) => {
      console.error('Registration error:', error);
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
      
      // Navigate to login
      router.replace('/(auth)/login');
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
