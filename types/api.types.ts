/**
 * Common API Response Types
 */

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  statusCode: number;
}

/**
 * Authentication Types
 */

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface KingsChatTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface KingsChatLoginRequest {
  accessToken: string;
  refreshToken?: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  isEmailVerified: boolean;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  roles: string[];
}

/**
 * User Settings (server DTO shape)
 */
export interface UserGeneralSettings {
  appLanguage: string;
  autoRotateScreen: boolean;
}

export interface UserNotificationSettings {
  subscriptions: boolean;
  recommendedVideos: boolean;
  activityOnMyComments: boolean;
}

export interface UserQualitySettings {
  videoQualityMobile: string;
  videoQualityWifi: string;
  audioQuality: string;
}

export interface UserDownloadSettings {
  downloadQuality: string;
  downloadOverWifiOnly: boolean;
}

export interface UserSettingsResponse {
  general: UserGeneralSettings;
  notifications: UserNotificationSettings;
  quality: UserQualitySettings;
  downloads: UserDownloadSettings;
}

export interface UpdateUserSettingsRequest {
  general?: Partial<UserGeneralSettings>;
  notifications?: Partial<UserNotificationSettings>;
  quality?: Partial<UserQualitySettings>;
  downloads?: Partial<UserDownloadSettings>;
}

/**
 * Video Types
 */

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  views: number;
  likes: number;
  dislikes: number;
  isLiked?: boolean;
  isDisliked?: boolean;
  uploadDate: string;
  category: string;
  tags: string[];
  channel: {
    id: string;
    name: string;
    avatar: string;
    isSubscribed: boolean;
  };
  streamUrl?: string;
  qualityOptions?: VideoQuality[];
}

export interface VideoQuality {
  quality: string;
  url: string;
  size?: number;
}

export interface VideoListParams {
  page?: number;
  limit?: number;
  category?: string;
  sortBy?: "newest" | "popular" | "trending";
  search?: string;
}

/**
 * Channel Types
 */

export interface Channel {
  id: string;
  name: string;
  handle?: string;
  slug: string;
  avatar?: string;
  logoUrl?: string; // Added
  coverImageUrl?: string; // Added
  description: string;
  websiteUrl?: string; // Added
  subscriberCount: number;
  videoCount: number;
  isSubscribed: boolean;
  joinedAt?: string; // Added
  createdAt: string;
}

export interface ChannelDetail {
  channel: Channel;
  latestVideos: Video[];
}

export interface ChannelVideosResponse {
  videos: ChannelVideoListItemDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ChannelSchedule {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  durationInMinutes: number;
  category: string;
  isLive: boolean;
  viewerCount: number;
  bookmarkCount: number;
  videoId: string;
  liveStreamId: string;
}

export interface ChannelVideoListItemDto {
  id: string;
  title: string;
  description?: string;
  playbackUrl: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  viewCount: number;
  publishedAt?: string;
}

export interface ChannelVideosPaginatedDto {
  videos: ChannelVideoListItemDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Playlist Types
 */

export interface Playlist {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  videoCount: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  videos?: Video[];
}

export interface CreatePlaylistRequest {
  title: string;
  description?: string;
  isPublic: boolean;
}

/**
 * Comment Types
 */

export interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  likes: number;
  isLiked: boolean;
  createdAt: string;
  replies?: Comment[];
  replyCount: number;
}

export interface CreateCommentRequest {
  videoId: string;
  content: string;
  parentId?: string;
}

/**
 * Notification Types
 */

export interface Notification {
  id: string;
  type: "video_upload" | "comment" | "like" | "subscription" | "system";
  title: string;
  message: string;
  thumbnail?: string;
  isRead: boolean;
  createdAt: string;
  data?: Record<string, any>;
}

export interface NotificationSettings {
  subscriptions: boolean;
  recommendedVideos: boolean;
  comments: boolean;
  replies: boolean;
  mentions: boolean;
}

/**
 * Settings Types
 */

export interface UserSettings {
  general: {
    language: string;
    autoplay: boolean;
    restrictedMode: boolean;
  };
  video: {
    mobileQuality: "auto" | "higher" | "data-saver";
    wifiQuality: "auto" | "higher" | "data-saver";
    audioQuality: "auto" | "higher" | "normal";
  };
  downloads: {
    quality: "low" | "medium" | "high";
    wifiOnly: boolean;
  };
  notifications: NotificationSettings;
}

/**
 * History Types
 */

export interface WatchHistory {
  id: string;
  video: Video;
  watchedAt: string;
  progress: number; // Progress percentage (0-100)
  completed: boolean;
}

export interface WatchHistoryItemDto {
  video: any;
  progressSeconds: number;
  durationSeconds: number;
  watchedAt: string;
}

export interface PaginatedWatchHistoryResponseDto {
  items: WatchHistoryItemDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AddToWatchlistRequest {
  videoId: string;
}

export interface WatchlistItemDto {
  video: any;
  addedAt: string;
}

export interface PaginatedWatchlistResponseDto {
  items: WatchlistItemDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SearchHistory {
  id: string;
  query: string;
  searchedAt: string;
}

/**
 * Homepage Types
 */

export interface LiveNowProgram {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  isLive: boolean;
  channel: {
    id: string;
    name: string;
    slug: string;
    logoUrl: string;
    coverImageUrl: string;
  };
  videoId: string;
  liveStreamId: string;
}

export interface ContinueWatchingItem {
  video: {
    id: string;
    title: string;
    description: string;
    playbackUrl: string;
    thumbnailUrl: string;
    durationSeconds: number;
    channel: {
      id: string;
      name: string;
      slug: string;
      logoUrl: string;
      coverImageUrl: string;
    };
  };
  progressSeconds: number;
  durationSeconds: number;
}

export interface HomepageChannel {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  coverImageUrl: string;
}

export interface HomepageProgram {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  isLive: boolean;
  channel: {
    id: string;
    name: string;
    slug: string;
    logoUrl: string;
    coverImageUrl: string;
  };
  videoId: string;
  liveStreamId: string;
}

// Livestream details returned by stream/watch endpoints
export interface LiveStreamDetails extends LiveNowProgram {
  rtmpUrl?: string;
}

export interface HomepageFeaturedVideo {
  id: string;
  title: string;
  description: string;
  playbackUrl: string;
  thumbnailUrl: string;
  durationSeconds: number;
  channel: {
    id: string;
    name: string;
    slug: string;
    logoUrl: string;
    coverImageUrl: string;
  };
}

/**
 * VOD (Video on Demand) Types
 */

export interface VodVideoResponseDto {
  id: string;
  channelId: string;
  title: string;
  description: string;
  playbackUrl: string;
  thumbnailUrl: string;
  durationSeconds: number;
  viewCount: number;
  likeCount: number;
  isLiked: boolean;
  isDisliked: boolean;
  commentCount: number;
  channel: {
    id: string;
    name: string;
    slug: string;
    logoUrl: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface VodPaginatedVideosResponseDto {
  videos: VodVideoResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface VodCommentResponseDto {
  id: string;
  videoId: string;
  userId: string;
  content: string;
  likes: number;
  isLiked: boolean;
  replyCount: number;
  parentId?: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  replies?: VodCommentResponseDto[];
  createdAt: string;
  updatedAt: string;
}

export interface VodPaginatedCommentsResponseDto {
  comments: VodCommentResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateCommentDto {
  content: string;
  parentId?: string;
}

/**
 * Notification Types (from API docs)
 */

export interface NotificationDto {
  id: string;
  type:
    | "channel_new_video"
    | "channel_go_live"
    | "channel_new_program"
    | "comment_liked"
    | "comment_replied";
  title: string;
  body: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

export interface PaginatedNotificationsDto {
  notifications: NotificationDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Subscription Types (from API docs)
 */

export interface ChannelSubscriptionResponseDto {
  id: string;
  channelId: string;
  isSubscribed: boolean;
  notifyOnNewVideo: boolean;
  notifyOnGoLive: boolean;
  notifyOnNewProgram: boolean;
}

export interface UpdateChannelSubscriptionSettingsDto {
  notifyOnNewVideo?: boolean;
  notifyOnGoLive?: boolean;
  notifyOnNewProgram?: boolean;
}

export interface ChannelSubscriptionStatusResponse {
  channelId: string;
  isSubscribed: boolean;
  subscription?: ChannelSubscriptionResponseDto;
}

/**
 * Update Progress Types
 */

export interface UpdateProgressDto {
  videoId: string;
  progressSeconds: number;
  durationSeconds: number;
}

/**
 * Channel Details Types (from API docs)
 */

export interface ChannelDetailsDto {
  id: string;
  name: string;
  slug: string;
  description: string;
  logoUrl?: string;
  coverImageUrl?: string;
  websiteUrl?: string;
  subscriberCount: number;
  videoCount: number;
  joinedAt: string;
}

export interface ChannelDetailsResponseDto {
  channel: ChannelDetailsDto;
  latestVideos: ChannelVideoListItemDto[];
}

export interface ChannelProgramDto {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  durationInMinutes: number;
  category: string;
  isLive: boolean;
  viewerCount: number;
  bookmarkCount: number;
  videoId: string;
  liveStreamId: string;
}
