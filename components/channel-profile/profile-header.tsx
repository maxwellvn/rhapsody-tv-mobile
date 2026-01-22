import { Button } from "@/components/button";
import {
  useSubscribe,
  useUnsubscribe,
} from "@/hooks/queries/useChannelQueries";
import { FONTS } from "@/styles/global";
import { Channel } from "@/types/api.types";
import { borderRadius, fs, hp, spacing, wp } from "@/utils/responsive";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";

type ChannelProfileHeaderProps = {
  channel: Channel;
};

export function ChannelProfileHeader({ channel }: ChannelProfileHeaderProps) {
  const subscribeMutation = useSubscribe();
  const unsubscribeMutation = useUnsubscribe();

  const isSubscribing =
    subscribeMutation.isPending || unsubscribeMutation.isPending;

  const handleToggleSubscribe = () => {
    if (channel.isSubscribed) {
      unsubscribeMutation.mutate({ id: channel.id, slug: channel.slug });
    } else {
      subscribeMutation.mutate({ id: channel.id, slug: channel.slug });
    }
  };

  return (
    <View style={styles.container}>
      {/* Blue Background with Full Width Logo/Banner */}
      <View style={styles.bannerContainer}>
        {channel.coverImageUrl ? (
          <Image
            source={{ uri: channel.coverImageUrl }}
            style={styles.banner}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.bannerPlaceholder} />
        )}
      </View>

      {/* Profile Info Section */}
      <View style={styles.profileSection}>
        {/* Avatar and Channel Name */}
        <View style={styles.infoRow}>
          <Image
            source={
              channel.avatar
                ? { uri: channel.avatar }
                : require("@/assets/logo/Logo.png")
            }
            style={styles.avatar}
            resizeMode="cover"
          />

          <View style={styles.infoContainer}>
            <Text style={styles.channelName}>{channel.name}</Text>
            <Text style={styles.stats}>
              {channel.subscriberCount.toLocaleString()} subscribers |{" "}
              {channel.videoCount} videos
            </Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description} numberOfLines={2}>
          {channel.description}
        </Text>

        {/* Subscribe Button */}
        <Button
          onPress={handleToggleSubscribe}
          style={[
            styles.subscribeButton,
            channel.isSubscribed && styles.subscribedButton,
            isSubscribing && styles.disabledButton,
          ]}
          textStyle={[
            styles.subscribeButtonText,
            channel.isSubscribed && styles.subscribedButtonText,
          ]}
          disabled={isSubscribing}
        >
          {isSubscribing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : channel.isSubscribed ? (
            "Subscribed"
          ) : (
            "Subscribe"
          )}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
  },
  bannerContainer: {
    width: "100%",
    height: hp(150),
    backgroundColor: "#1A237E",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  banner: {
    width: "100%",
    height: "100%",
  },
  bannerPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#1A237E",
  },
  profileSection: {
    paddingHorizontal: spacing.xl,
    paddingTop: hp(16),
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(12),
  },
  avatar: {
    width: wp(64),
    height: wp(64),
    borderRadius: wp(32),
    marginRight: spacing.md,
    overflow: "hidden",
    backgroundColor: "#F5F5F5",
  },
  infoContainer: {
    flex: 1,
  },
  channelName: {
    fontSize: fs(18),
    fontFamily: FONTS.bold,
    color: "#000000",
    marginBottom: hp(4),
  },
  stats: {
    fontSize: fs(12),
    fontFamily: FONTS.regular,
    color: "#737373",
  },
  description: {
    fontSize: fs(14),
    fontFamily: FONTS.regular,
    color: "#737373",
    lineHeight: fs(20),
    marginBottom: hp(16),
  },
  subscribeButton: {
    backgroundColor: "#0000FF",
    borderRadius: borderRadius.sm,
    paddingVertical: hp(12),
    marginBottom: hp(24),
  },
  subscribedButton: {
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  disabledButton: {
    opacity: 0.7,
  },
  subscribeButtonText: {
    fontSize: fs(16),
    fontFamily: FONTS.semibold,
    color: "#FFFFFF",
    textAlign: "center",
  },
  subscribedButtonText: {
    color: "#737373",
  },
});
