import { KingsChatTokens } from "@/types/api.types";
import Constants from "expo-constants";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

type KingsChatAuthErrorCode =
  | "CONFIG_MISSING"
  | "AUTH_CANCELLED"
  | "INVALID_CALLBACK";

export class KingsChatAuthError extends Error {
  code: KingsChatAuthErrorCode;

  constructor(code: KingsChatAuthErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

class KingsChatService {
  private getOauthUrl(redirectUri: string) {
    const extra = Constants.expoConfig?.extra as
      | {
          kingschatOauthUrl?: string;
          kingschat?: { oauthUrl?: string };
        }
      | undefined;

    const baseOauthUrl =
      extra?.kingschatOauthUrl ?? extra?.kingschat?.oauthUrl ?? "";

    if (!baseOauthUrl) {
      throw new KingsChatAuthError(
        "CONFIG_MISSING",
        "KingsChat OAuth URL is not configured",
      );
    }

    if (baseOauthUrl.includes("redirect_uri=")) {
      return baseOauthUrl;
    }

    const separator = baseOauthUrl.includes("?") ? "&" : "?";
    return `${baseOauthUrl}${separator}redirect_uri=${encodeURIComponent(redirectUri)}`;
  }

  private getTokenFromUrl(url: string): KingsChatTokens | null {
    const parsed = Linking.parse(url);
    const queryParams = (parsed.queryParams ?? {}) as Record<string, unknown>;

    const getString = (value: unknown) =>
      typeof value === "string" && value.trim() ? value.trim() : undefined;

    const parsePayload = (value: unknown) => {
      if (typeof value !== "string") return {} as Record<string, unknown>;
      try {
        return JSON.parse(value) as Record<string, unknown>;
      } catch {
        return {} as Record<string, unknown>;
      }
    };

    const payload = {
      ...parsePayload(queryParams.data),
      ...parsePayload(queryParams.payload),
      ...parsePayload(queryParams.tokenData),
    };

    const urlObject = new URL(url);
    const hashParams = new URLSearchParams(urlObject.hash.replace(/^#/, ""));

    const accessToken =
      getString(queryParams.accessToken) ??
      getString(queryParams.access_token) ??
      getString(queryParams.token) ??
      getString(payload.accessToken) ??
      getString(payload.access_token) ??
      getString(hashParams.get("accessToken")) ??
      getString(hashParams.get("access_token"));

    if (!accessToken) {
      return null;
    }

    const refreshToken =
      getString(queryParams.refreshToken) ??
      getString(queryParams.refresh_token) ??
      getString(payload.refreshToken) ??
      getString(payload.refresh_token) ??
      getString(hashParams.get("refreshToken")) ??
      getString(hashParams.get("refresh_token"));

    return {
      accessToken,
      refreshToken,
    };
  }

  async login(): Promise<KingsChatTokens> {
    const redirectUri = Linking.createURL("auth/kingschat/callback");
    const oauthUrl = this.getOauthUrl(redirectUri);

    const result = await WebBrowser.openAuthSessionAsync(oauthUrl, redirectUri);

    if (result.type !== "success") {
      throw new KingsChatAuthError(
        "AUTH_CANCELLED",
        "KingsChat login was cancelled",
      );
    }

    const tokenData = this.getTokenFromUrl(result.url);

    if (!tokenData?.accessToken) {
      throw new KingsChatAuthError(
        "INVALID_CALLBACK",
        "No authentication data received",
      );
    }

    return tokenData;
  }
}

export const kingsChatService = new KingsChatService();
