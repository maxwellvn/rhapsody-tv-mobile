import { ChannelCard } from '@/components/schedule/channel-card';
import { EmptyState } from '@/components/empty-state';
import { useChannels } from '@/hooks/queries/useHomepageQueries';
import { FONTS } from '@/styles/global';
import { borderRadius, dimensions, fs, spacing, wp } from '@/utils/responsive';
import { useMemo } from 'react';
import { ImageSourcePropType, StyleSheet, Text, View } from 'react-native';

type ScheduleChannelsListProps = {
  selectedChannelSlug?: string;
  onSelectChannel?: (slug: string) => void;
};

export function ScheduleChannelsList({
  selectedChannelSlug,
  onSelectChannel,
}: ScheduleChannelsListProps) {
  const { data: channels = [] } = useChannels(50);

  const handleChannelPress = (slug: string) => {
    onSelectChannel?.(slug);
  };

  const displayChannels = useMemo(
    () =>
      channels.map((channel) => ({
        slug: channel.slug,
        name:
          typeof channel.name === 'string' && channel.name.trim().length > 0
            ? channel.name.trim()
            : typeof channel.slug === 'string' && channel.slug.trim().length > 0
              ? channel.slug.trim()
              : 'Channel',
        fallbackLogo: channel.logoUrl
          ? ({ uri: channel.logoUrl } as ImageSourcePropType)
          : (require('@/assets/logo/Logo.png') as ImageSourcePropType),
        thumbnail: channel.coverImageUrl
          ? ({ uri: channel.coverImageUrl } as ImageSourcePropType)
          : channel.logoUrl
            ? ({ uri: channel.logoUrl } as ImageSourcePropType)
            : (require('@/assets/logo/Logo.png') as ImageSourcePropType),
        thumbnailKey: `${channel.coverImageUrl || ''}|${channel.logoUrl || ''}`,
        thumbnailResizeMode: (channel.coverImageUrl ? 'cover' : 'contain') as
          | 'cover'
          | 'contain',
      })),
    [channels],
  );

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Channels</Text>
        <View style={styles.liveChip}>
          <View style={styles.liveChipDot} />
          <Text style={styles.liveChipText}>LIVE</Text>
        </View>
      </View>

      {/* Channels Grid */}
      {displayChannels.length === 0 ? (
        <EmptyState
          iconName="calendar-outline"
          title="No channels available"
          subtitle="When channels are available, their schedules will show here."
          compact
        />
      ) : (
        <View style={styles.grid}>
          {displayChannels.map((channel) => (
            <View key={channel.slug} style={styles.cardWrapper}>
              <ChannelCard
                thumbnailSource={channel.thumbnail}
                fallbackSource={channel.fallbackLogo}
                finalFallbackSource={require('@/assets/logo/Logo.png')}
                thumbnailKey={channel.thumbnailKey}
                thumbnailResizeMode={channel.thumbnailResizeMode}
                fallbackResizeMode="contain"
                channelName={channel.name}
                isLive={false}
                isSelected={channel.slug === selectedChannelSlug}
                fitToContainer
                onPress={() => handleChannelPress(channel.slug)}
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: dimensions.isTablet ? fs(24) : fs(20),
    fontFamily: FONTS.bold,
    color: '#0F172A',
  },
  liveChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(5),
    backgroundColor: '#FEE2E2',
    paddingHorizontal: wp(10),
    paddingVertical: wp(4),
    borderRadius: borderRadius.full,
  },
  liveChipDot: {
    width: wp(6),
    height: wp(6),
    borderRadius: wp(3),
    backgroundColor: '#EF4444',
  },
  liveChipText: {
    fontSize: fs(10),
    fontFamily: FONTS.bold,
    color: '#EF4444',
    letterSpacing: 0.6,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.sm,
  },
  cardWrapper: {
    width: dimensions.isTablet ? '23.5%' : '48%',
  },
});
