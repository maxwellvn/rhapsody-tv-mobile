import { useChannels } from '@/hooks/queries/useHomepageQueries';
import { Text, View, StyleSheet } from 'react-native';
import { ChannelCard } from './channel-card';
import { FONTS } from '@/styles/global';
import { useRouter } from 'expo-router';
import { ImageSourcePropType } from 'react-native';
import { EmptyState } from '@/components/empty-state';

type ChannelsTabProps = {
  query?: string;
};

export function ChannelsTab({ query = '' }: ChannelsTabProps) {
  const router = useRouter();
  const { data: channels = [] } = useChannels(50);

  const handleChannelPress = (slug: string) => {
    router.push({
      pathname: '/channel-profile',
      params: { slug },
    });
  };

  const q = query.trim().toLowerCase();
  const displayChannels = channels
    .filter((channel) => !q || channel.name.toLowerCase().includes(q))
    .map((channel) => ({
      slug: channel.slug,
      name: channel.name,
      logo: channel.logoUrl
        ? ({ uri: channel.logoUrl } as ImageSourcePropType)
        : (require('@/assets/logo/Logo.png') as ImageSourcePropType),
    }));

  return (
    <>
      <Text style={styles.sectionTitle}>Channels</Text>
      {displayChannels.length === 0 ? (
        <EmptyState
          iconName="people-outline"
          title={q ? "No matching channels" : "No channels yet"}
          subtitle={
            q
              ? `Try another keyword for "${query}".`
              : "Channels will appear here once available."
          }
          compact
        />
      ) : (
        <View style={styles.grid}>
          {displayChannels.map((channel) => (
            <View key={channel.slug} style={styles.channelCardWrapper}>
              <ChannelCard
                logoSource={channel.logo}
                channelName={channel.name}
                isLive={false}
                onPress={() => handleChannelPress(channel.slug)}
              />
            </View>
          ))}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: '#000000',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  channelCardWrapper: {
    width: '47%',
  },
});
