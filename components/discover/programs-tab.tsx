import { usePrograms } from '@/hooks/queries/useHomepageQueries';
import { FONTS } from '@/styles/global';
import { useRouter } from 'expo-router';
import { ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { EmptyState } from '@/components/empty-state';
import { VideoCard } from './video-card';

type ProgramsTabProps = {
  query?: string;
};

export function ProgramsTab({ query = '' }: ProgramsTabProps) {
  const router = useRouter();
  const { data: programs = [] } = usePrograms(50);

  const q = query.trim().toLowerCase();
  const filteredPrograms = programs.filter(
    (program) =>
      !q ||
      program.title.toLowerCase().includes(q) ||
      (program.channel?.name || '').toLowerCase().includes(q),
  );

  const handleProgramPress = (
    programId: string,
    channelId?: string,
    channelSlug?: string,
  ) => {
    router.push(
      `/program-profile?id=${programId}&channelId=${channelId || ""}&channelSlug=${channelSlug || ""}`,
    );
  };

  return (
    <>
      <Text style={styles.sectionTitle}>Programs</Text>
      {filteredPrograms.length === 0 ? (
        <EmptyState
          iconName="tv-outline"
          title={q ? "No matching programs" : "No programs yet"}
          subtitle={
            q
              ? `Try another keyword for "${query}".`
              : "Programs will appear here once available."
          }
          compact
        />
      ) : (
        <View style={styles.grid}>
          {filteredPrograms.map((program) => (
            <View key={program.id} style={styles.videoCardWrapper}>
              <VideoCard
                imageSource={
                  (program.channel?.coverImageUrl
                    ? ({ uri: program.channel.coverImageUrl } as ImageSourcePropType)
                    : (require('@/assets/images/Image-4.png') as ImageSourcePropType))
                }
                title={program.title}
                badgeLabel={program.isLive ? 'Live' : 'Series'}
                badgeColor={program.isLive ? '#DC2626' : '#2563EB'}
                showBadge={true}
                onPress={() =>
                  handleProgramPress(
                    program.id,
                    program.channel?.id,
                    program.channel?.slug,
                  )
                }
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
  videoCardWrapper: {
    width: '47.5%',
    marginBottom: 8,
  },
});
