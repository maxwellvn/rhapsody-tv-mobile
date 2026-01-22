import { FONTS } from '@/styles/global';
import { homepageService } from '@/services/homepage.service';
import { HomepageProgram } from '@/types/api.types';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View, ImageSourcePropType } from 'react-native';
import { VideoCard } from './video-card';
import { useEffect, useState } from 'react';
import { wp, hp, fs, spacing, borderRadius, dimensions } from '@/utils/responsive';
import { ProgramsSkeleton } from '../skeleton';

export function ProgramsSection() {
  const [programsData, setProgramsData] = useState<HomepageProgram[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setIsLoading(true);
      const response = await homepageService.getPrograms(10);
      
      if (response.success && response.data && response.data.length > 0) {
        setProgramsData(response.data);
      } else {
        // No data available - will show mock data
        setProgramsData([]);
      }
    } catch (err: any) {
      console.error('Error fetching programs:', err);
      // On error, show mock data instead
      setProgramsData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardPress = (programId: string, videoId: string) => {
    if (videoId) {
      router.push(`/video?id=${videoId}`);
    } else {
      router.push(`/program-profile?id=${programId}`);
    }
  };

  const handleSeeAllPress = () => {
    router.push('/(tabs)/discover');
  };

  // Mock data for fallback
  const mockData = [
    {
      id: 'mock-1',
      videoId: 'mock-video-1',
      title: 'Rhapsody Dailies',
      coverImageUrl: require('@/assets/images/Image-4.png'),
      badgeLabel: 'Series',
      badgeColor: '#2563EB',
      isLive: false,
    },
    {
      id: 'mock-2',
      videoId: 'mock-video-2',
      title: 'Rhapsody On The Daily Frontier',
      coverImageUrl: require('@/assets/images/Image-1.png'),
      badgeLabel: 'New',
      badgeColor: '#2563EB',
      isLive: false,
    },
    {
      id: 'mock-3',
      videoId: 'mock-video-3',
      title: 'The Day God Spoke My Language',
      coverImageUrl: require('@/assets/images/Image-5.png'),
      badgeLabel: 'Live',
      badgeColor: '#DC2626',
      isLive: true,
    },
  ];

  // Show loading state with skeleton
  if (isLoading) {
    return <ProgramsSkeleton />;
  }

  // Show mock data if no programs data available
  const displayData = programsData.length > 0
    ? programsData.map((program) => ({
        id: program.id,
        videoId: program.videoId,
        title: program.title,
        coverImageUrl: program.channel.coverImageUrl
          ? { uri: program.channel.coverImageUrl } as ImageSourcePropType
          : require('@/assets/images/Image-4.png') as ImageSourcePropType,
        badgeLabel: program.isLive ? 'Live' : 'Series',
        badgeColor: program.isLive ? '#DC2626' : '#2563EB',
        isLive: program.isLive,
      }))
    : mockData;

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Programs</Text>
        <Pressable onPress={handleSeeAllPress}>
          <Text style={styles.seeAllText}>See all</Text>
        </Pressable>
      </View>
      {programsData.length === 0 && (
        <Text style={styles.noDataText}>No programs available</Text>
      )}

      {/* Videos Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {displayData.map((program) => (
          <VideoCard
            key={program.id}
            imageSource={program.coverImageUrl}
            title={program.title}
            badgeLabel={program.badgeLabel}
            badgeColor={program.badgeColor}
            showBadge={true}
            onPress={() => handleCardPress(program.id, program.videoId)}
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
