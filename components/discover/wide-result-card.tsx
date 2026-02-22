import { FONTS } from "@/styles/global";
import { borderRadius, dimensions, fs, spacing, wp } from "@/utils/responsive";
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from "react-native";

type WideResultCardProps = {
  imageSource: ImageSourcePropType;
  title: string;
  subtitle?: string;
  badgeLabel?: string;
  badgeColor?: string;
  onPress?: () => void;
};

export function WideResultCard({
  imageSource,
  title,
  subtitle,
  badgeLabel,
  badgeColor = "#2563EB",
  onPress,
}: WideResultCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
      android_ripple={{ color: "rgba(0, 0, 0, 0.06)", borderless: false }}
    >
      <View style={styles.thumbWrap}>
        <Image source={imageSource} style={styles.thumb} resizeMode="cover" />
        {!!badgeLabel && (
          <View style={[styles.badge, { backgroundColor: badgeColor }]}>
            <Text style={styles.badgeText}>{badgeLabel}</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text numberOfLines={2} style={styles.title}>
          {title}
        </Text>
        {!!subtitle && (
          <Text numberOfLines={1} style={styles.subtitle}>
            {subtitle}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  pressed: {
    opacity: 0.8,
  },
  thumbWrap: {
    width: wp(112),
    aspectRatio: 16 / 9,
    borderRadius: borderRadius.sm,
    overflow: "hidden",
    backgroundColor: "#E5E7EB",
    position: "relative",
    flexShrink: 0,
  },
  thumb: {
    width: "100%",
    height: "100%",
  },
  badge: {
    position: "absolute",
    top: spacing.xs,
    left: spacing.xs,
    borderRadius: borderRadius.full,
    paddingHorizontal: wp(8),
    paddingVertical: wp(3),
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: fs(9),
    fontFamily: FONTS.bold,
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: dimensions.isTablet ? fs(15) : fs(14),
    fontFamily: FONTS.semibold,
    color: "#0F172A",
    lineHeight: dimensions.isTablet ? fs(20) : fs(18),
  },
  subtitle: {
    marginTop: wp(3),
    fontSize: dimensions.isTablet ? fs(13) : fs(12),
    fontFamily: FONTS.regular,
    color: "#64748B",
  },
});
