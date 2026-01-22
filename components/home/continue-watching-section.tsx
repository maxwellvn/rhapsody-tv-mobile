import { homepageService } from '@/services/homepage.service';
import { FONTS } from '@/styles/global';
import { ContinueWatchingItem } from '@/types/api.types';
import { borderRadius, dimensions, fs, hp, spacing, wp } from '@/utils/responsive';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ImageSourcePropType, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Skeleton } from '../skeleton';
import { VideoCard } from './video-card';

export function ContinueWatchingSection() {
  const router = useRouter();
  const [continueWatchingData, setContinueWatchingData] = useState<ContinueWatchingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchContinueWatching();
  }, []);

  const fetchContinueWatching = async () => {
    try {
      setIsLoading(true);
      const response = await homepageService.getContinueWatching();
      
      if (response.success && response.data && response.data.length > 0) {
        setContinueWatchingData(response.data);
      } else {
        // No data available - will show mock data
        setContinueWatchingData([]);
      }
    } catch (err: any) {
      console.error('Error fetching continue watching:', err);
      // On error, show mock data instead
      setContinueWatchingData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardPress = (videoId: string) => {
    router.push(`/video?id=${videoId}`);
  };

  // Mock data for fallback
  const mockData = [
    {
      imageSource: require('@/assets/images/carusel-2.png') as ImageSourcePropType,
      title: 'Your Loveworld Special with Pastor Chris Season 2 Phase 7',
      badgeLabel: 'Live',
      badgeColor: '#FF0000',
      showBadge: true,
      videoId: 'mock-1',
    },
    {
      imageSource: require('@/assets/images/Image-2.png') as ImageSourcePropType,
      title: 'Night Of A Thousand Crusades HIGHLIGHT 3',
      badgeLabel: 'New',
      badgeColor: '#2563EB',
      showBadge: true,
      videoId: 'mock-2',
    },
    {
      imageSource: require('@/assets/images/Image-1.png') as ImageSourcePropType,
      title: 'Rhapsody On The Daily Frontier',
      badgeLabel: 'Live',
      badgeColor: '#FF0000',
      showBadge: true,
      videoId: 'mock-3',
    },
  ];

  // Show loading state with skeleton
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Skeleton width={wp(180)} height={dimensions.isTablet ? fs(28) : fs(20)} borderRadius={borderRadius.xs} style={{ marginBottom: spacing.sm }} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollView}
        >
          {[1, 2, 3].map((item) => (
            <View key={item} style={styles.skeletonCard}>
              <Skeleton width={wp(160)} height={dimensions.isTablet ? hp(120) : hp(90)} borderRadius={borderRadius.sm} />
              <Skeleton width={wp(140)} height={dimensions.isTablet ? fs(18) : fs(14)} borderRadius={borderRadius.xs} style={{ marginTop: spacing.sm }} />
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  // Show mock data if no continue watching data available
  const displayData = continueWatchingData.length > 0 
    ? continueWatchingData.map((item) => ({
        imageSource: item.video.thumbnailUrl 
          ? { uri: item.video.thumbnailUrl } as ImageSourcePropType
          : require('@/assets/images/carusel-2.png') as ImageSourcePropType,
        title: item.video.title,
        badgeLabel: undefined,
        badgeColor: undefined,
        showBadge: false,
        videoId: item.video.id,
      }))
    : mockData;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Continue Watching</Text>
      {continueWatchingData.length === 0 && (
        <Text style={styles.noDataText}>No videos to continue watching</Text>
      )}
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {displayData.map((item, index) => (
          <VideoCard
            key={item.videoId || index}
            imageSource={item.imageSource}
            title={item.title}
            badgeLabel={item.badgeLabel}
            badgeColor={item.badgeColor}
            showBadge={item.showBadge}
            onPress={() => handleCardPress(item.videoId)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    marginBottom: spacing.xxl,
  },
  title: {
    fontSize: dimensions.isTablet ? fs(24) : fs(20),
    fontFamily: FONTS.bold,
    color: '#000000',
    marginBottom: spacing.sm,
  },
  scrollView: {
    marginLeft: 0,
  },
  scrollContent: {
    paddingRight: 0,
  },
  skeletonCard: {
    width: wp(160),
    marginRight: spacing.md,
  },
  noDataText: {
    fontSize: dimensions.isTablet ? fs(16) : fs(14),
    fontFamily: FONTS.regular,
    color: '#666666',
    marginBottom: spacing.sm,
  },
});
