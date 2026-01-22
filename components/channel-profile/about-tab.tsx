import { FONTS } from "@/styles/global";
import { Channel } from "@/types/api.types";
import { fs, hp, spacing } from "@/utils/responsive";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

type AboutTabProps = {
  channel: Channel;
};

export function AboutTab({ channel }: AboutTabProps) {
  const handleOpenWebsite = () => {
    if (channel.websiteUrl) {
      Linking.openURL(channel.websiteUrl);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>About {channel.name}</Text>

      <Text style={styles.description}>{channel.description}</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>
            {channel.subscriberCount.toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>Subscribers</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>
            {channel.videoCount.toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>Videos</Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoLabel}>Channel Details</Text>

        <View style={styles.infoRow}>
          <Text style={styles.rowLabel}>Joined</Text>
          <Text style={styles.rowValue}>
            {channel.joinedAt
              ? new Date(channel.joinedAt).toLocaleDateString()
              : new Date(channel.createdAt).toLocaleDateString()}
          </Text>
        </View>

        {channel.websiteUrl && (
          <Pressable style={styles.infoRow} onPress={handleOpenWebsite}>
            <Text style={styles.rowLabel}>Website</Text>
            <Text style={[styles.rowValue, styles.link]}>
              {channel.websiteUrl}
            </Text>
          </Pressable>
        )}

        <View style={styles.infoRow}>
          <Text style={styles.rowLabel}>Handle</Text>
          <Text style={styles.rowValue}>@{channel.slug}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: fs(20),
    fontFamily: FONTS.bold,
    color: "#000000",
    marginBottom: hp(16),
  },
  description: {
    fontSize: fs(15),
    fontFamily: FONTS.regular,
    color: "#444",
    lineHeight: fs(24),
    marginBottom: hp(24),
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: hp(24),
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: fs(18),
    fontFamily: FONTS.bold,
    color: "#000000",
  },
  statLabel: {
    fontSize: fs(12),
    fontFamily: FONTS.regular,
    color: "#737373",
    marginTop: hp(4),
  },
  infoSection: {
    marginTop: hp(8),
  },
  infoLabel: {
    fontSize: fs(16),
    fontFamily: FONTS.semibold,
    color: "#000000",
    marginBottom: hp(12),
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: hp(12),
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  rowLabel: {
    fontSize: fs(14),
    fontFamily: FONTS.medium,
    color: "#737373",
  },
  rowValue: {
    fontSize: fs(14),
    fontFamily: FONTS.regular,
    color: "#000000",
  },
  link: {
    color: "#0066CC",
  },
});
