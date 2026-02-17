import { KingsChatAuthError } from "@/services/kingschat.service";
import { AuthResponse } from "@/types/api.types";
import { storage } from "@/utils/storage";

type ShowError = (message: string) => void;
type ShowSuccess = (message: string) => void;
type NavigateToApp = () => void;

export async function handleKingsChatAuthSuccess(
  data: AuthResponse,
  showSuccess: ShowSuccess,
  navigateToApp: NavigateToApp,
) {
  await storage.saveTokens(data.accessToken, data.refreshToken);
  await storage.saveUserData(data.user);

  showSuccess("Sign in successful!");
  navigateToApp();
}

export function handleKingsChatAuthError(error: any, showError: ShowError) {
  console.error("KingsChat login error:", error);

  if (error instanceof KingsChatAuthError) {
    if (error.code === "AUTH_CANCELLED") {
      return;
    }

    if (error.code === "CONFIG_MISSING") {
      showError("KingsChat sign-in is not configured yet.");
      return;
    }

    if (error.code === "INVALID_CALLBACK") {
      showError("No authentication data received.");
      return;
    }
  }

  if (error?.statusCode === 401) {
    showError("KingsChat login failed. Please try again.");
    return;
  }

  showError(
    "Unable to complete login right now. Please check your connection and retry.",
  );
}
