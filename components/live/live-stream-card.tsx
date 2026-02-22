import { Badge } from "@/components/badge";
import { FONTS } from "@/styles/global";
import { borderRadius, fs, hp, spacing } from "@/utils/responsive";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type LiveStreamCardProps = {
  title: string;
  description?: string;
  thumbnailUrl?: string;
  status: "scheduled" | "live" | "ended" | "canceled";
  onPress?: () => void;
};

const statusDotColor: Record<LiveStreamCardProps["status"], string> = {
  live: "#DC2626",
  scheduled: "#2563EB",
  ended: "#6B7280",
  canceled: "#EA580C",
};

const statusLabel: Record<LiveStreamCardProps["status"], string> = {
  live: "Live",
  scheduled: "Scheduled",
  ended: "Ended",
  canceled: "Canceled",
};

export function LiveStreamCard({
  title,
  description,
  thumbnailUrl,
  status,
  onPress,
}: LiveStreamCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Image
        source={
          thumbnailUrl
            ? { uri: thumbnailUrl }
            : require("@/assets/images/carusel-2.png")
        }
        style={styles.thumbnail}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <View style={styles.badgesRow}>
          <Badge label={statusLabel[status]} dotColor={statusDotColor[status]} />
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        {description ? (
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: hp(14),
    borderRadius: borderRadius.md,
    overflow: "hidden",
    backgroundColor: "#F8F8F8",
  },
  thumbnail: {
    width: "100%",
    height: hp(170),
  },
  content: {
    padding: spacing.md,
  },
  badgesRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: fs(16),
    fontFamily: FONTS.semibold,
    color: "#000000",
    marginBottom: hp(4),
  },
  description: {
    fontSize: fs(13),
    fontFamily: FONTS.regular,
    color: "#4B5563",
  },
});
