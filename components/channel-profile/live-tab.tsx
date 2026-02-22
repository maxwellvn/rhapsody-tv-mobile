import { LiveStreamCard } from "@/components/live/live-stream-card";
import { useChannelLivestreams } from "@/hooks/queries/useChannelQueries";
import { FONTS } from "@/styles/global";
import { fs, hp } from "@/utils/responsive";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

type LiveTabProps = {
  slug: string;
};

export function LiveTab({ slug }: LiveTabProps) {
  const router = useRouter();
  const { data: livestreams = [], isLoading } = useChannelLivestreams(slug, 50);

  if (isLoading) {
    return <Text style={styles.metaText}>Loading livestreams...</Text>;
  }

  if (livestreams.length === 0) {
    return <Text style={styles.metaText}>No livestreams available</Text>;
  }

  return (
    <View>
      {livestreams.map((livestream) => (
        <LiveStreamCard
          key={livestream.id}
          title={livestream.title}
          description={livestream.description}
          thumbnailUrl={livestream.thumbnailUrl}
          status={livestream.status}
          onPress={() => router.push(`/live-video?liveStreamId=${livestream.id}`)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  metaText: {
    fontSize: fs(14),
    fontFamily: FONTS.regular,
    color: "#666666",
    marginTop: hp(8),
  },
});
