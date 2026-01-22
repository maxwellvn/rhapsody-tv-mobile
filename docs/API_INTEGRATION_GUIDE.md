# API Integration Guide

## Overview
This guide explains how the API integration infrastructure is set up and how to use it when integrating your backend endpoints.

## 📁 Project Structure

```
├── config/
│   └── api.config.ts          # API endpoints and configuration
├── types/
│   └── api.types.ts           # TypeScript types for API
├── services/
│   ├── api.client.ts          # Axios client with interceptors
│   ├── auth.service.ts        # Authentication API calls
│   ├── user.service.ts        # User API calls
│   └── video.service.ts       # Video API calls
├── context/
│   └── AuthContext.tsx        # Authentication state management
├── hooks/
│   ├── useApi.ts              # Hook for manual API calls
│   └── useFetch.ts            # Hook for auto-fetching data
└── utils/
    ├── storage.ts             # Local storage utilities
    ├── validation.ts          # Form validation functions
    └── formatters.ts          # Data formatting utilities
```

## 🚀 Setup Instructions

### 1. Update API Base URL

In `config/api.config.ts`, update the `BASE_URL`:

```typescript
export const API_CONFIG = {
  BASE_URL: 'https://your-api.com/api/v1', // Update this!
  TIMEOUT: 30000,
  VERSION: 'v1',
};
```

### 2. Wrap App with AuthProvider

In your root `app/_layout.tsx`:

```typescript
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      {/* Your app content */}
    </AuthProvider>
  );
}
```

## 📖 Usage Examples

### Authentication

#### Login Example
```typescript
import { authService } from '@/services/auth.service';
import { useAuth } from '@/context/AuthContext';

const LoginScreen = () => {
  const { login } = useAuth();
  const { execute, loading, error } = useApi();

  const handleLogin = async () => {
    try {
      const response = await execute(() =>
        authService.login({
          email: 'user@example.com',
          password: 'password123',
        })
      );

      // Save auth data to context
      await login(response);

      // Navigate to home
      router.replace('/home');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <Button 
      onPress={handleLogin} 
      loading={loading}
    />
  );
};
```

#### Register Example
```typescript
const RegisterScreen = () => {
  const { login } = useAuth();
  const { execute, loading } = useApi();

  const handleRegister = async () => {
    const response = await execute(() =>
      authService.register({
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123',
        confirmPassword: 'SecurePass123',
      })
    );

    await login(response);
    router.replace('/home');
  };
};
```

#### Logout Example
```typescript
const handleLogout = async () => {
  const { logout } = useAuth();

  await execute(() => authService.logout());
  await logout();
  router.replace('/login');
};
```

### Fetching Data

#### Auto-fetch on Mount
```typescript
import { useFetch } from '@/hooks/useFetch';
import { videoService } from '@/services/video.service';

const HomeScreen = () => {
  const { data, loading, error, refetch } = useFetch(
    () => videoService.getTrendingVideos({ page: 1, limit: 20 })
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <FlatList
      data={data?.items}
      onRefresh={refetch}
      refreshing={loading}
    />
  );
};
```

#### Manual API Calls
```typescript
import { useApi } from '@/hooks/useApi';
import { videoService } from '@/services/video.service';

const VideoScreen = () => {
  const { execute, loading } = useApi({
    onSuccess: (data) => {
      Alert.alert('Success', 'Video liked!');
    },
    onError: (error) => {
      Alert.alert('Error', error.message);
    },
  });

  const handleLike = async (videoId: string) => {
    await execute(() => videoService.likeVideo(videoId));
  };

  return <LikeButton onPress={() => handleLike('123')} />;
};
```

### Protected Routes

```typescript
const { isAuthenticated, isLoading } = useAuth();

if (isLoading) {
  return <SplashScreen />;
}

if (!isAuthenticated) {
  return <Redirect href="/login" />;
}

return <MainApp />;
```

### Search Implementation
```typescript
const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const { data, loading, execute } = useApi();

  const handleSearch = async () => {
    await execute(() =>
      videoService.searchVideos(query, { page: 1, limit: 20 })
    );
  };

  return (
    <SearchBar
      value={query}
      onChangeText={setQuery}
      onSubmit={handleSearch}
    />
  );
};
```

## 🔧 Creating New Services

### Example: Channel Service

```typescript
// services/channel.service.ts
import { api } from './api.client';
import { API_ENDPOINTS } from '@/config/api.config';

class ChannelService {
  async getChannel(id: string) {
    return api.get(API_ENDPOINTS.CHANNELS.DETAILS(id));
  }

  async subscribe(id: string) {
    return api.post(API_ENDPOINTS.CHANNELS.SUBSCRIBE(id));
  }
}

export const channelService = new ChannelService();
```

## 🎯 Key Features

### 1. **Automatic Token Management**
- Tokens are automatically added to all requests
- Refresh tokens automatically on 401 errors
- Secure storage with AsyncStorage

### 2. **Error Handling**
- Centralized error handling in API client
- Consistent error format across app
- Network error detection

### 3. **Type Safety**
- Full TypeScript support
- Type-safe API responses
- IntelliSense support

### 4. **Request/Response Logging**
- Automatic logging in development mode
- Easy debugging of API calls

### 5. **File Upload Support**
- Built-in multipart/form-data support
- Progress tracking for uploads

## 🛠 Utility Functions

### Validation
```typescript
import { validateEmail, validatePassword } from '@/utils/validation';

const isValid = validateEmail('test@example.com'); // true
const passwordCheck = validatePassword('weak'); // { isValid: false, errors: [...] }
```

### Formatting
```typescript
import { formatNumber, formatDuration, formatRelativeTime } from '@/utils/formatters';

formatNumber(1500);          // "1.5K"
formatDuration(125);         // "2:05"
formatRelativeTime(date);    // "2 hours ago"
```

### Storage
```typescript
import { storage } from '@/utils/storage';

await storage.setItem('key', { data: 'value' });
const data = await storage.getItem('key');
await storage.removeItem('key');
```

## 📝 Next Steps

1. Update `API_CONFIG.BASE_URL` with your backend URL
2. Add AuthProvider to app layout
3. Update API endpoints if needed in `api.config.ts`
4. Adjust TypeScript types based on your API response structure
5. Implement API calls in your screens using the hooks
6. Test authentication flow
7. Implement error handling UI

## 🔒 Security Notes

- Tokens are stored securely using AsyncStorage
- HTTPS should be used in production
- Never log sensitive data in production
- Implement proper token expiration handling
- Use environment variables for sensitive config

## ⚡ Performance Tips

- Use `useFetch` for data that needs to load on mount
- Use `useApi` for manual/user-triggered actions
- Implement pagination for large lists
- Cache responses when appropriate
- Optimize image loading with proper sizes
