# API Endpoints Template

This document serves as a template for documenting your actual backend endpoints. Fill this in when you receive the API documentation.

## Base URL
```
Production: https://api.example.com/api/v1
Staging: https://staging-api.example.com/api/v1
Development: http://localhost:3000/api/v1
```

---

## Authentication

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123",
  "dateOfBirth": "1990-01-15"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_123",
      "fullName": "John Doe",
      "email": "john@example.com",
      "avatar": null,
      "isVerified": false,
      "createdAt": "2026-01-15T10:00:00Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 3600
    }
  }
}
```

---

### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123",
  "rememberMe": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { /* User object */ },
    "tokens": { /* Token object */ }
  }
}
```

---

### POST /auth/logout
Logout current user.

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## Videos

### GET /videos
Get list of videos with pagination.

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `category` (string, optional)
- `sortBy` (string: "newest" | "popular" | "trending")

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "video_123",
        "title": "Amazing Video Title",
        "description": "Video description...",
        "thumbnail": "https://...",
        "duration": 125,
        "views": 1500,
        "likes": 150,
        "uploadDate": "2026-01-15T10:00:00Z",
        "channel": {
          "id": "channel_123",
          "name": "Channel Name",
          "avatar": "https://..."
        }
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### GET /videos/{id}
Get video details by ID.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "video_123",
    "title": "Video Title",
    "description": "Full description...",
    "thumbnail": "https://...",
    "duration": 125,
    "views": 1500,
    "likes": 150,
    "dislikes": 5,
    "isLiked": false,
    "streamUrl": "https://stream.example.com/video.m3u8",
    "qualityOptions": [
      { "quality": "1080p", "url": "https://..." },
      { "quality": "720p", "url": "https://..." }
    ],
    "channel": {
      "id": "channel_123",
      "name": "Channel Name",
      "avatar": "https://...",
      "subscriberCount": 10000,
      "isSubscribed": false
    }
  }
}
```

---

### POST /videos/{id}/like
Like a video.

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Video liked successfully"
}
```

---

## User Profile

### GET /user/profile
Get current user profile.

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "fullName": "John Doe",
    "email": "john@example.com",
    "avatar": "https://...",
    "isVerified": true,
    "createdAt": "2026-01-15T10:00:00Z"
  }
}
```

---

### PUT /user/profile/update
Update user profile.

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request Body:**
```json
{
  "fullName": "John Updated",
  "avatar": "https://..."
}
```

---

## Channels

### GET /channels/{id}
Get channel details.

### POST /channels/{id}/subscribe
Subscribe to a channel.

### POST /channels/{id}/unsubscribe
Unsubscribe from a channel.

### GET /channels/subscriptions
Get user's subscribed channels.

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["Email is required", "Email must be valid"],
    "password": ["Password must be at least 8 characters"]
  },
  "statusCode": 400
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized. Please login.",
  "statusCode": 401
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found",
  "statusCode": 404
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "statusCode": 500
}
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- All authenticated endpoints require `Authorization: Bearer {token}` header
- Pagination uses `page` and `limit` query parameters
- File uploads use `multipart/form-data` content type
- Rate limiting: 100 requests per minute per IP
