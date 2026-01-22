import { FONTS } from '@/styles/global';
import { homepageService } from '@/services/homepage.service';
import { HomepageFeaturedVideo } from '@/types/api.types';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ImageSourcePropType, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { VideoCard } from './video-card';
import { FeaturedVideosSkeleton } from '../skeleton';
import { dimensions, fs, spacing } from '@/utils/responsive';

export function FeaturedVideosSection() {
  const router = useRouter();
  const [featuredVideos, setFeaturedVideos] = useState<HomepageFeaturedVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedVideos();
  }, []);

  const fetchFeaturedVideos = async () => {
    try {
      setIsLoading(true);
      const response = await homepageService.getFeaturedVideos(10);

      if (response.success && response.data && response.data.length > 0) {
        setFeaturedVideos(response.data);
      } else {
        setFeaturedVideos([]);
      }
    } catch (err: any) {
      console.error('Error fetching featured videos:', err);
      setFeaturedVideos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardPress = (videoId: string) => {
    router.push(`/video?id=${videoId}`);
  };

  const handleSeeAllPress = () => {
    router.push('/(tabs)/discover');
  };

  // Mock data fallback
  const mockData = [
    {
      id: 'mock-video-1',
      title: 'Your Loveworld Special with Pastor Chris Season 2 Phase 5',
      thumbnail: require('@/assets/images/carusel-2.png') as ImageSourcePropType,
      badgeLabel: 'Featured',
      badgeColor: '#2563EB',
    },
    {
      id: 'mock-video-2',
      title: 'NOTHING ON MEDIA IS NEUTRAL A CONVERSATION WITH BLOSSOM CHUKWUJEKWU',
      thumbnail: require('@/assets/images/Image-6.png') as ImageSourcePropType,
      badgeLabel: 'Featured',
      badgeColor: '#2563EB',
    },
    {
      id: 'mock-video-3',
      title: 'Your Loveworld Special with Pastor Chris Season 2 Phase 5',
      thumbnail: require('@/assets/images/carusel-2.png') as ImageSourcePropType,
      badgeLabel: 'Featured',
      badgeColor: '#2563EB',
    },
  ];

  if (isLoading) {
    return <FeaturedVideosSkeleton />;
  }

  const displayData =
    featuredVideos.length > 0
      ? featuredVideos.map((v) => ({
          id: v.id,
          title: v.title,
          thumbnail: (v.thumbnailUrl
            ? ({ uri: v.thumbnailUrl } as ImageSourcePropType)
            : (require('@/assets/images/carusel-2.png') as ImageSourcePropType)),
          badgeLabel: 'Featured',
          badgeColor: '#2563EB',
        }))
      : mockData;

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Featured Videos</Text>
        <Pressable onPress={handleSeeAllPress}>
          <Text style={styles.seeAllText}>See all</Text>
        </Pressable>
      </View>
      {featuredVideos.length === 0 && (
        <Text style={styles.noDataText}>No featured videos available</Text>
      )}

      {/* Videos Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {displayData.map((item) => (
          <VideoCard
            key={item.id}
            imageSource={item.thumbnail}
            title={item.title}
            badgeLabel={item.badgeLabel}
            badgeColor={item.badgeColor}
            showBadge={true}
            onPress={() => handleCardPress(item.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xxl,
    marginBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: dimensions.isTablet ? fs(24) : fs(20),
    fontFamily: FONTS.bold,
    color: '#000000',
  },
  seeAllText: {
    fontSize: dimensions.isTablet ? fs(16) : fs(14),
    fontFamily: FONTS.medium,
    color: '#666666',
  },
  scrollView: {
    marginLeft: 0,
  },
  scrollContent: {
    paddingRight: 0,
  },
  noDataText: {
    fontSize: dimensions.isTablet ? fs(16) : fs(14),
    fontFamily: FONTS.regular,
    color: '#666666',
    marginBottom: spacing.sm,
  },
});
