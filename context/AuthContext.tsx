import { AuthResponse, User } from "@/types/api.types";
import { userService } from "@/services/user.service";
import { storage } from "@/utils/storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (authData: AuthResponse) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const validateProfileInBackground = async (cachedUser?: User | null) => {
    try {
      const response = await userService.getProfile();
      const freshUser = response.data;
      setUser(freshUser);
      await storage.saveUserData(freshUser);
    } catch (profileError: any) {
      const status = profileError?.statusCode ?? profileError?.status;
      if (status === 401 || status === 403 || status === 404) {
        await Promise.all([storage.clearTokens(), storage.clearUserData()]);
        setUser(null);
      } else if (cachedUser) {
        // Network/server issue: keep cached user so app can continue loading.
        setUser(cachedUser);
      }
    }
  };

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const [token, userData] = await Promise.all([
        storage.getAccessToken(),
        storage.getUserData<User>(),
      ]);

      if (!token) {
        setUser(null);
        return;
      }

      if (userData) {
        // Use cached auth data immediately so app startup isn't blocked by network.
        setUser(userData);
        setIsLoading(false);

        // Validate token against the backend in the background.
        void validateProfileInBackground(userData);
        return;
      }

      // Token exists but cached user is missing: fetch profile now so content can load.
      await validateProfileInBackground(null);
    } catch (error) {
      console.error("Error checking auth status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (authData: AuthResponse) => {
    try {
      // Save tokens
      await storage.saveTokens(authData.accessToken, authData.refreshToken);

      // Save user data
      await storage.saveUserData(authData.user);

      // Update state
      setUser(authData.user);
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Clear tokens and user data
      await Promise.all([storage.clearTokens(), storage.clearUserData()]);

      // Update state
      setUser(null);
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      storage.saveUserData(updatedUser);
    }
  };

  const refreshUserData = async () => {
    try {
      const userData = await storage.getUserData<User>();
      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
