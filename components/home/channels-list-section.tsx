import { FONTS } from '@/styles/global';
import { homepageService } from '@/services/homepage.service';
import { HomepageChannel } from '@/types/api.types';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View, ImageSourcePropType } from 'react-native';
import { ChannelCard } from './channel-card';
import { useEffect, useState } from 'react';
import { wp, hp, fs, spacing, borderRadius, dimensions } from '@/utils/responsive';
import { Skeleton } from '../skeleton';

export function ChannelsListSection() {
  const [channelsData, setChannelsData] = useState<HomepageChannel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      setIsLoading(true);
      const response = await homepageService.getChannels(10);
      
      if (response.success && response.data && response.data.length > 0) {
        setChannelsData(response.data);
      } else {
        // No data available - will show mock data
        setChannelsData([]);
      }
    } catch (err: any) {
      console.error('Error fetching channels:', err);
      // On error, show mock data instead
      setChannelsData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChannelPress = (channelId: string, channelSlug: string) => {
    router.push(`/channel-profile?slug=${channelSlug}&id=${channelId}`);
  };

  const handleSeeAllPress = () => {
    router.push('/(tabs)/discover');
  };

  // Mock data for fallback
  const mockData = [
    {
      id: 'mock-1',
      name: 'Rhapsody TV',
      slug: 'rhapsody-tv',
      logoSource: require('@/assets/logo/Logo.png') as ImageSourcePropType,
      isLive: true,
    },
    {
      id: 'mock-2',
      name: 'RORK TV',
      slug: 'rork-tv',
      logoSource: require('@/assets/logo/logo-2.png') as ImageSourcePropType,
      isLive: true,
    },
    {
      id: 'mock-3',
      name: 'LingualTV',
      slug: 'lingual-tv',
      logoSource: require('@/assets/logo/logo-3.png') as ImageSourcePropType,
      isLive: true,
    },
    {
      id: 'mock-4',
      name: 'Rebroadcast Channel',
      slug: 'rebroadcast-channel',
      logoSource: require('@/assets/logo/logo-1.png') as ImageSourcePropType,
      isLive: true,
    },
  ];

  // Show loading state with skeleton
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Skeleton width={wp(150)} height={dimensions.isTablet ? fs(28) : fs(20)} borderRadius={borderRadius.xs} />
          <Skeleton width={wp(60)} height={dimensions.isTablet ? fs(18) : fs(14)} borderRadius={borderRadius.xs} />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollView}
        >
          {[1, 2, 3, 4].map((item) => (
            <View key={item} style={styles.skeletonCard}>
              <Skeleton width={dimensions.isTablet ? wp(140) : wp(120)} height={dimensions.isTablet ? hp(150) : hp(120)} borderRadius={borderRadius.md} />
              <Skeleton width={wp(100)} height={dimensions.isTablet ? fs(18) : fs(14)} borderRadius={borderRadius.xs} style={{ marginTop: spacing.sm }} />
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  // Show mock data if no channels data available
  const displayData = channelsData.length > 0 
    ? channelsData.map((channel) => ({
        id: channel.id,
        name: channel.name,
        slug: channel.slug,
        logoSource: channel.logoUrl 
          ? { uri: channel.logoUrl } as ImageSourcePropType
          : require('@/assets/logo/Logo.png') as ImageSourcePropType,
        isLive: false, // API doesn't provide isLive, set to false
      }))
    : mockData;

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Channels List</Text>
        <Pressable onPress={handleSeeAllPress}>
          <Text style={styles.seeAllText}>See all</Text>
        </Pressable>
      </View>
      {channelsData.length === 0 && (
        <Text style={styles.noDataText}>No channels available</Text>
      )}

      {/* Channels Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {displayData.map((channel) => (
          <ChannelCard
            key={channel.id}
            logoSource={channel.logoSource}
            channelName={channel.name}
            isLive={channel.isLive}
            onPress={() => handleChannelPress(channel.id, channel.slug)}
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
  skeletonCard: {
    width: dimensions.isTablet ? wp(140) : wp(120),
    marginRight: spacing.lg,
  },
  noDataText: {
    fontSize: dimensions.isTablet ? fs(16) : fs(14),
    fontFamily: FONTS.regular,
    color: '#666666',
    marginBottom: spacing.sm,
  },
});
