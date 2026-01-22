# State Management Guide

## Overview

Rhapsody TV uses a **hybrid state management approach** combining:

1. **React Query** - Server state (API data)
2. **React Context** - Global client state (auth, settings)
3. **useState** - Local component state (UI state)

---

## 🎯 State Management Architecture

### 1. **Server State** → React Query

All data from the backend API is managed with **React Query**:

- Videos, channels, playlists
- User profile, preferences
- Comments, likes, subscriptions
- Search results

**Why React Query?**
- ✅ Automatic caching
- ✅ Background refetching
- ✅ Optimistic updates
- ✅ Pagination & infinite scroll
- ✅ Loading & error states
- ✅ Request deduplication

### 2. **Global Client State** → React Context

App-wide state that doesn't come from the API:

- Authentication state (`useAuth`)
- Theme preferences
- App settings
- Navigation state

### 3. **Local UI State** → useState/useReducer

Component-specific state:

- Form inputs
- Modal visibility
- Selected tabs
- Dropdown state

---

## 📚 Usage Examples

### Example 1: Fetching Videos (React Query)

```typescript
import { useTrendingVideos } from '@/hooks/queries/useVideoQueries';

const HomeScreen = () => {
  const { data, isLoading, error, refetch } = useTrendingVideos({
    page: 1,
    limit: 20,
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <FlatList
      data={data?.items}
      onRefresh={refetch}
      refreshing={isLoading}
      renderItem={({ item }) => <VideoCard video={item} />}
    />
  );
};
```

### Example 2: Authentication (Context)

```typescript
import { useAuth } from '@/context/AuthContext';

const ProfileScreen = () => {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <View>
      <Text>{user?.fullName}</Text>
      <Button onPress={logout}>Logout</Button>
    </View>
  );
};
```

### Example 3: Login with Mutation

```typescript
import { useLogin } from '@/hooks/queries/useAuthQueries';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const loginMutation = useLogin();

  const handleLogin = () => {
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          Alert.alert('Success', 'Logged in successfully!');
          // Navigation happens automatically in the mutation
        },
        onError: (error: any) => {
          Alert.alert('Error', error.message);
        },
      }
    );
  };

  return (
    <Button
      onPress={handleLogin}
      loading={loginMutation.isPending}
      disabled={loginMutation.isPending}
    >
      Login
    </Button>
  );
};
```

### Example 4: Like/Unlike Video (Optimistic Update)

```typescript
import { useLikeVideo, useUnlikeVideo } from '@/hooks/queries/useVideoQueries';

const VideoPlayer = ({ videoId }) => {
  const likeMutation = useLikeVideo();
  const unlikeMutation = useUnlikeVideo();
  const { data: video } = useVideoDetails(videoId);

  const toggleLike = () => {
    if (video?.isLiked) {
      unlikeMutation.mutate(videoId);
    } else {
      likeMutation.mutate(videoId);
    }
  };

  return (
    <Button 
      onPress={toggleLike}
      loading={likeMutation.isPending || unlikeMutation.isPending}
    >
      {video?.isLiked ? '👍 Liked' : '👍 Like'}
    </Button>
  );
};
```

### Example 5: Infinite Scroll

```typescript
import { useInfiniteVideos } from '@/hooks/queries/useVideoQueries';

const VideosListScreen = () => {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteVideos({ limit: 20 });

  const allVideos = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <FlatList
      data={allVideos}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? <LoadingSpinner /> : null
      }
    />
  );
};
```

### Example 6: Search with Debounce

```typescript
import { useState } from 'react';
import { useSearchVideos } from '@/hooks/queries/useVideoQueries';
import { useDebounce } from '@/hooks/useDebounce';

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500); // 500ms delay

  const { data, isLoading } = useSearchVideos(debouncedQuery, {
    page: 1,
    limit: 20,
  });

  return (
    <>
      <SearchBar value={query} onChangeText={setQuery} />
      {isLoading && <LoadingSpinner />}
      <FlatList data={data?.items} />
    </>
  );
};
```

### Example 7: Subscribe to Channel

```typescript
import { useSubscribe, useUnsubscribe } from '@/hooks/queries/useChannelQueries';

const ChannelScreen = ({ channelId }) => {
  const { data: channel } = useChannel(channelId);
  const subscribeMutation = useSubscribe();
  const unsubscribeMutation = useUnsubscribe();

  const toggleSubscribe = () => {
    if (channel?.isSubscribed) {
      unsubscribeMutation.mutate(channelId);
    } else {
      subscribeMutation.mutate(channelId);
    }
  };

  return (
    <Button onPress={toggleSubscribe}>
      {channel?.isSubscribed ? 'Subscribed' : 'Subscribe'}
    </Button>
  );
};
```

---

## 🔑 Query Keys Organization

Query keys are organized hierarchically:

```typescript
// Videos
['videos']                              // All videos
['videos', 'list']                      // All lists
['videos', 'list', { filters }]         // Specific list
['videos', 'trending', { filters }]     // Trending videos
['videos', 'detail', id]                // Single video
['videos', 'related', id]               // Related videos

// Channels
['channels']                            // All channels
['channels', 'detail', id]              // Single channel
['channels', 'videos', id]              // Channel videos
['channels', 'subscriptions']           // User subscriptions

// Auth
['auth']                                // All auth
['auth', 'profile']                     // User profile
['auth', 'preferences']                 // User preferences
```

---

## ⚡ Best Practices

### 1. **Use Queries for GET requests**
```typescript
const { data } = useQuery({
  queryKey: ['videos', id],
  queryFn: () => fetchVideo(id),
});
```

### 2. **Use Mutations for POST/PUT/DELETE**
```typescript
const mutation = useMutation({
  mutationFn: (data) => updateProfile(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['profile'] });
  },
});
```

### 3. **Invalidate Related Queries**
```typescript
onSuccess: () => {
  // Invalidate to refetch
  queryClient.invalidateQueries({ queryKey: ['videos'] });
  
  // Or update cache directly
  queryClient.setQueryData(['video', id], newData);
}
```

### 4. **Handle Loading States**
```typescript
if (isLoading) return <Skeleton />;
if (error) return <ErrorView />;
if (!data) return <EmptyState />;
```

### 5. **Use Optimistic Updates**
```typescript
onMutate: async (newData) => {
  // Cancel outgoing refetches
  await queryClient.cancelQueries({ queryKey: ['video', id] });
  
  // Snapshot previous value
  const previous = queryClient.getQueryData(['video', id]);
  
  // Optimistically update
  queryClient.setQueryData(['video', id], newData);
  
  return { previous };
},
onError: (err, newData, context) => {
  // Rollback on error
  queryClient.setQueryData(['video', id], context?.previous);
},
```

---

## 🎨 When to Use What?

| Type | Use Case | Tool |
|------|----------|------|
| API Data | Videos, users, channels | React Query |
| Authentication | User login state | Context |
| App Settings | Theme, language | Context |
| Form Input | Text fields, selections | useState |
| Modal State | Show/hide modals | useState |
| Navigation | Tab selection | useState |
| Computed Values | Filtered lists | useMemo |

---

## 📦 Configuration

React Query is configured in `context/QueryProvider.tsx`:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,      // 5 minutes
      gcTime: 1000 * 60 * 30,         // 30 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});
```

---

## 🚀 Summary

✅ **React Query** for all API/server data  
✅ **Context** for global app state  
✅ **useState** for local UI state  
✅ Automatic caching and refetching  
✅ Optimistic updates for better UX  
✅ Type-safe with TypeScript  

This approach gives you the best of both worlds: powerful server state management with React Query and simple global state with Context!
