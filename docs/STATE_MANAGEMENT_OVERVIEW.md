# 🎯 State Management - Complete Overview

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        APP PROVIDER                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              QUERY PROVIDER (React Query)              │ │
│  │                                                        │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │         AUTH PROVIDER (React Context)            │ │ │
│  │  │                                                  │ │ │
│  │  │  ┌────────────────────────────────────────────┐ │ │ │
│  │  │  │           YOUR APP SCREENS              │ │ │ │
│  │  │  │                                          │ │ │ │
│  │  │  │  • Home                                  │ │ │ │
│  │  │  │  • Search                                │ │ │ │
│  │  │  │  • Profile                               │ │ │ │
│  │  │  │  • Video Player                          │ │ │ │
│  │  │  └────────────────────────────────────────────┘ │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 State Management Layers

### Layer 1: React Query (Server State) ⚡

**Purpose**: Manage ALL data from the backend API

**What it handles**:
- Videos, channels, playlists
- User profile data
- Search results
- Comments, likes
- Subscriptions

**Features**:
- ✅ Automatic caching
- ✅ Background refetching
- ✅ Optimistic updates
- ✅ Loading & error states
- ✅ Infinite scroll
- ✅ Request deduplication

**Example**:
```typescript
// Automatically caches and manages video data
const { data, isLoading } = useTrendingVideos();
```

---

### Layer 2: React Context (Global App State) 🌐

**Purpose**: Manage app-wide state that's NOT from the API

**What it handles**:
- Authentication state (user, tokens)
- Theme preferences
- App settings
- Global UI state

**Features**:
- ✅ Accessible from any component
- ✅ Persists across app
- ✅ Simple to use

**Example**:
```typescript
const { user, isAuthenticated, logout } = useAuth();
```

---

### Layer 3: Local Component State (UI State) 🎨

**Purpose**: Manage component-specific state

**What it handles**:
- Form inputs
- Modal visibility
- Dropdown state
- Tab selection
- Temporary UI state

**Example**:
```typescript
const [isModalOpen, setIsModalOpen] = useState(false);
```

---

## 🔄 Data Flow

```
┌─────────────┐
│   Backend   │
│     API     │
└──────┬──────┘
       │
       │ HTTP Request (via Axios)
       ▼
┌─────────────────────┐
│   React Query       │
│   • Caching         │
│   • Refetching      │
│   • State Updates   │
└──────┬──────────────┘
       │
       │ useQuery / useMutation
       ▼
┌─────────────────────┐
│   Component         │
│   • Display data    │
│   • Handle actions  │
└─────────────────────┘
```

---

## 🎯 Decision Tree: Which State Management?

```
Need to store data?
  │
  ├─ Is it from the API? ──────────────► React Query ⚡
  │
  ├─ Is it app-wide state? ────────────► Context 🌐
  │
  └─ Is it UI-specific? ───────────────► useState 🎨
```

---

## 📁 File Organization

```
hooks/
├── queries/
│   ├── useAuthQueries.ts       # Login, register, profile
│   ├── useVideoQueries.ts      # Videos, search, like
│   └── useChannelQueries.ts    # Channels, subscribe
├── useApi.ts                   # Manual API calls
├── useFetch.ts                 # Auto-fetching
└── useDebounce.ts              # Search debouncing

context/
├── AuthContext.tsx             # Auth state
├── QueryProvider.tsx           # React Query setup
└── AppProvider.tsx             # Combined providers

services/
├── api.client.ts               # Axios instance
├── auth.service.ts             # Auth API calls
├── user.service.ts             # User API calls
└── video.service.ts            # Video API calls
```

---

## 🚀 Real-World Examples

### Example 1: Login Screen

```typescript
import { useLogin } from '@/hooks/queries/useAuthQueries';
import { useState } from 'react';

const LoginScreen = () => {
  // Local UI state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // React Query mutation
  const loginMutation = useLogin();

  const handleLogin = () => {
    loginMutation.mutate({ email, password });
  };

  return (
    <View>
      <TextInput value={email} onChangeText={setEmail} />
      <TextInput value={password} onChangeText={setPassword} />
      <Button 
        onPress={handleLogin}
        loading={loginMutation.isPending}
      />
    </View>
  );
};
```

**State layers used**:
- ✅ `useState` for form inputs (local)
- ✅ `useLogin` for API call (React Query)
- ✅ `useAuth` for auth state (Context - handled internally)

---

### Example 2: Home Screen with Videos

```typescript
import { useTrendingVideos } from '@/hooks/queries/useVideoQueries';

const HomeScreen = () => {
  // React Query handles all the complexity
  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = useTrendingVideos({ page: 1, limit: 20 });

  return (
    <FlatList
      data={data?.items}
      refreshing={isLoading}
      onRefresh={refetch}
    />
  );
};
```

**State layers used**:
- ✅ `useTrendingVideos` for video data (React Query)
- ✅ Automatic loading, error, and data states

---

### Example 3: Video Player with Like

```typescript
import { useVideoDetails, useLikeVideo } from '@/hooks/queries/useVideoQueries';

const VideoPlayer = ({ videoId }) => {
  const { data: video } = useVideoDetails(videoId);
  const likeMutation = useLikeVideo();

  const handleLike = () => {
    likeMutation.mutate(videoId, {
      // Optimistic update - UI updates immediately
      onMutate: () => {
        // Video updates instantly, API call in background
      }
    });
  };

  return (
    <View>
      <VideoComponent source={video?.streamUrl} />
      <Button onPress={handleLike}>
        {video?.isLiked ? '👍 Liked' : '👍 Like'}
      </Button>
    </View>
  );
};
```

**State layers used**:
- ✅ `useVideoDetails` for video data (React Query)
- ✅ `useLikeVideo` for like action (React Query mutation)
- ✅ Optimistic update for instant UI feedback

---

### Example 4: Protected Profile Screen

```typescript
import { useAuth } from '@/context/AuthContext';
import { useUserProfile } from '@/hooks/queries/useAuthQueries';

const ProfileScreen = () => {
  // Auth context
  const { user, isAuthenticated, logout } = useAuth();
  
  // Additional profile data from API
  const { data: profile, isLoading } = useUserProfile();

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <View>
      <Text>{user?.fullName}</Text>
      <Text>{profile?.email}</Text>
      <Button onPress={logout}>Logout</Button>
    </View>
  );
};
```

**State layers used**:
- ✅ `useAuth` for auth state (Context)
- ✅ `useUserProfile` for extended profile data (React Query)

---

## 💡 Key Benefits

### 1. **Automatic Caching**
```typescript
// First call - fetches from API
const screen1 = useTrendingVideos();

// Second call - uses cached data (instant!)
const screen2 = useTrendingVideos();
```

### 2. **Background Refetching**
```typescript
// Data updates automatically in background
// User always sees fresh data
const { data } = useTrendingVideos();
```

### 3. **Optimistic Updates**
```typescript
// UI updates instantly, API call in background
likeMutation.mutate(videoId);
// ✅ Button changes immediately
// ✅ API request happens in background
// ✅ Rollback if error
```

### 4. **Loading States**
```typescript
const { data, isLoading, error } = useTrendingVideos();

if (isLoading) return <Skeleton />;
if (error) return <Error />;
return <VideoList data={data} />;
```

### 5. **Pull to Refresh**
```typescript
const { data, refetch } = useTrendingVideos();

<FlatList onRefresh={refetch} />
```

---

## 📝 Quick Reference

| Need | Hook/Context | Example |
|------|-------------|---------|
| Fetch videos | `useTrendingVideos()` | `const { data } = useTrendingVideos()` |
| Search videos | `useSearchVideos(query)` | `const { data } = useSearchVideos('react')` |
| Like video | `useLikeVideo()` | `likeMutation.mutate(videoId)` |
| Login | `useLogin()` | `loginMutation.mutate({ email, password })` |
| Check auth | `useAuth()` | `const { isAuthenticated } = useAuth()` |
| Get user | `useAuth()` | `const { user } = useAuth()` |
| Logout | `useAuth()` | `const { logout } = useAuth()` |
| Channel info | `useChannel(id)` | `const { data } = useChannel(id)` |
| Subscribe | `useSubscribe()` | `subscribeMutation.mutate(channelId)` |
| Infinite scroll | `useInfiniteVideos()` | `const { data, fetchNextPage } = useInfiniteVideos()` |

---

## ✅ Summary

✅ **React Query** = All API data (videos, users, channels)  
✅ **Context** = Global app state (auth, settings)  
✅ **useState** = Local UI state (forms, modals)  
✅ **Automatic** = Caching, refetching, error handling  
✅ **Type-safe** = Full TypeScript support  
✅ **Optimized** = Fast, efficient, production-ready  

You now have enterprise-grade state management! 🚀
