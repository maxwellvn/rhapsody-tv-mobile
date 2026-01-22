/**
 * API Configuration
 * Update the BASE_URL with your actual backend URL when ready
 */

export const API_CONFIG = {
  // Backend API base URL
  BASE_URL: 'https://rhapsody-tv-backend.fly.dev/v1',
  
  // Timeout duration in milliseconds
  TIMEOUT: 30000,
  
  // API version
  VERSION: 'v1',
} as const;

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    REQUEST_EMAIL_VERIFICATION: '/auth/email/request-verification',
    VERIFY_EMAIL: '/auth/verify-email',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  
  // User
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile/update',
    UPLOAD_AVATAR: '/user/avatar',
    PREFERENCES: '/user/preferences',
  },
  
  // Videos
  VIDEOS: {
    LIST: '/videos',
    TRENDING: '/videos/trending',
    RECOMMENDED: '/videos/recommended',
    SEARCH: '/videos/search',
    DETAILS: (id: string) => `/videos/${id}`,
    RELATED: (id: string) => `/videos/${id}/related`,
    STREAM: (id: string) => `/videos/${id}/stream`,
  },
  
  // Channels
  CHANNELS: {
    LIST: '/channels',
    DETAILS: (id: string) => `/channels/${id}`,
    VIDEOS: (id: string) => `/channels/${id}/videos`,
    SUBSCRIBE: (id: string) => `/channels/${id}/subscribe`,
    UNSUBSCRIBE: (id: string) => `/channels/${id}/unsubscribe`,
    SUBSCRIPTIONS: '/channels/subscriptions',
  },
  
  // Playlists
  PLAYLISTS: {
    LIST: '/playlists',
    DETAILS: (id: string) => `/playlists/${id}`,
    CREATE: '/playlists',
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
    WATCH_HISTORY: '/history/watch',
    SEARCH_HISTORY: '/history/search',
    CLEAR_HISTORY: '/history/clear',
  },
  
  // Downloads
  DOWNLOADS: {
    LIST: '/downloads',
    START: '/downloads/start',
    DELETE: (id: string) => `/downloads/${id}`,
  },
  
  // Notifications
  NOTIFICATIONS: {
    LIST: '/notifications',
    READ: (id: string) => `/notifications/${id}/read`,
    SETTINGS: '/notifications/settings',
    UPDATE_SETTINGS: '/notifications/settings/update',
  },
  
  // Settings
  SETTINGS: {
    GET: '/settings',
    UPDATE: '/settings/update',
  },
  
  // Homepage
  HOMEPAGE: {
    LIVE_NOW: '/homepage/live-now',
    CONTINUE_WATCHING: '/homepage/continue-watching',
    CHANNELS: '/homepage/channels',
    PROGRAMS: '/homepage/programs',
    FEATURED_VIDEOS: '/homepage/featured-videos',
    PROGRAM_HIGHLIGHTS: '/homepage/program-highlights',
  },
} as const;
