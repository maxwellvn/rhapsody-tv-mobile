/**
 * API Configuration
 * Update the BASE_URL with your actual backend URL when ready
 */

export const API_CONFIG = {
  // Backend API base URL
  // BASE_URL: "http://localhost:3000/v1", // Use for web or iOS Simulator
  // BASE_URL: "http://192.168.0.84:3000/v1", // Use your machine's IP for physical devices/Android emulator
  BASE_URL: "https://rtv.movortech.com/v1",

  // Timeout duration in milliseconds
  TIMEOUT: 30000,

  // API version
  VERSION: "v1",
} as const;

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH_TOKEN: "/auth/refresh",
    REQUEST_EMAIL_VERIFICATION: "/auth/email/request-verification",
    VERIFY_EMAIL: "/auth/email/verify",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    CHANGE_PASSWORD: "/auth/change-password",
  },

  // User
  USER: {
    PROFILE: "/users/me",
    UPDATE_PROFILE: "/users/me",
    UPLOAD_AVATAR: "/users/me/avatar",
    SETTINGS: "/users/me/settings",
    WATCHLIST: "/users/me/watchlist",
    WATCHLIST_ITEM: (videoId: string) => `/users/me/watchlist/${videoId}`,
    HISTORY: "/users/me/history",
    HISTORY_ITEM: (videoId: string) => `/users/me/history/${videoId}`,
  },

  // Videos
  VIDEOS: {
    LIST: "/videos",
    TRENDING: "/videos/trending",
    RECOMMENDED: "/videos/recommended",
    SEARCH: "/videos/search",
    DETAILS: (id: string) => `/videos/${id}`,
    RELATED: (id: string) => `/videos/${id}/related`,
    STREAM: (id: string) => `/videos/${id}/stream`,
  },

  // VOD (Video on Demand)
  VOD: {
    LIST: "/vod",
    DETAILS: (id: string) => `/vod/${id}`,
    LIKE: (id: string) => `/vod/${id}/like`,
    LIKE_STATUS: (id: string) => `/vod/${id}/like-status`,
    COMMENTS: (id: string) => `/vod/${id}/comments`,
    COMMENT_REPLY: (videoId: string, commentId: string) =>
      `/vod/${videoId}/comments/${commentId}/reply`,
    COMMENT_DELETE: (commentId: string) => `/vod/comments/${commentId}`,
    COMMENT_LIKE: (commentId: string) => `/vod/comments/${commentId}/like`,
    COMMENT_LIKE_STATUS: (commentId: string) =>
      `/vod/comments/${commentId}/like-status`,
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: "/notifications",
    READ: (id: string) => `/notifications/${id}/read`,
    READ_ALL: "/notifications/read-all",
  },

  // Subscriptions
  SUBSCRIPTIONS: {
    SUBSCRIBE: (channelId: string) => `/subscriptions/channels/${channelId}`,
    STATUS: (channelId: string) => `/subscriptions/channels/${channelId}`,
    UNSUBSCRIBE: (channelId: string) =>
      `/subscriptions/channels/${channelId}/unsubscribe`,
    SETTINGS: (channelId: string) =>
      `/subscriptions/channels/${channelId}/settings`,
  },

  // Channels
  CHANNELS: {
    LIST: "/channels",
    DETAILS: (slug: string) => `/channels/${slug}`,
    VIDEOS: (slug: string) => `/channels/${slug}/videos`,
    SCHEDULE: (slug: string) => `/channels/${slug}/schedule`,
    SUBSCRIBE: (id: string) => `/channels/${id}/subscribe`,
    UNSUBSCRIBE: (id: string) => `/channels/${id}/unsubscribe`,
    SUBSCRIPTIONS: "/channels/subscriptions",
  },

  // Playlists
  PLAYLISTS: {
    LIST: "/playlists",
    DETAILS: (id: string) => `/playlists/${id}`,
    CREATE: "/playlists",
    UPDATE: (id: string) => `/playlists/${id}`,
    DELETE: (id: string) => `/playlists/${id}`,
    ADD_VIDEO: (id: string) => `/playlists/${id}/videos`,
  },

  // Interactions
  INTERACTIONS: {
    LIKE: (videoId: string) => `/videos/${videoId}/like`,
    UNLIKE: (videoId: string) => `/videos/${videoId}/unlike`,
    COMMENT: (videoId: string) => `/videos/${videoId}/comments`,
    DELETE_COMMENT: (commentId: string) => `/comments/${commentId}`,
    VIEW: (videoId: string) => `/videos/${videoId}/view`,
  },

  // History
  HISTORY: {
    WATCH_HISTORY: "/history/watch",
    SEARCH_HISTORY: "/history/search",
    CLEAR_HISTORY: "/history/clear",
  },

  // Downloads
  DOWNLOADS: {
    LIST: "/downloads",
    START: "/downloads/start",
    DELETE: (id: string) => `/downloads/${id}`,
  },

  // Settings
  SETTINGS: {
    GET: "/settings",
    UPDATE: "/settings/update",
  },

  // Homepage
  HOMEPAGE: {
    LIVE_NOW: "/homepage/live-now",
    CONTINUE_WATCHING: "/homepage/continue-watching",
    CHANNELS: "/homepage/channels",
    PROGRAMS: "/homepage/programs",
    FEATURED_VIDEOS: "/homepage/featured-videos",
    PROGRAM_HIGHLIGHTS: "/homepage/program-highlights",
    WATCH_LIVESTREAM: (livestreamId: string) =>
      `/homepage/watch-livestream/${livestreamId}`,
  },
} as const;
