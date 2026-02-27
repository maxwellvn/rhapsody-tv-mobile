import { FONTS } from "@/styles/global";
import { borderRadius, fs, hp, wp } from "@/utils/responsive";
import {
  getCardDimensions,
  VIDEO_MEDIA_ASPECT_RATIO,
} from "@/utils/card-dimensions";
import { Ionicons } from "@expo/vector-icons";
import { memo, useMemo } from "react";
import {
    GestureResponderEvent,
    ImageSourcePropType,
    Pressable,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from "react-native";
import { Image } from "expo-image";

const blurhash = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

type ProfileVideoCardProps = {
  imageSource: ImageSourcePropType;
  title: string;
  badgeLabel?: string;
  badgeColor?: string;
  showBadge?: boolean;
  fitToContainer?: boolean;
  onPress?: () => void;
  onRemovePress?: () => void;
};

export const ProfileVideoCard = memo(function ProfileVideoCard({
  imageSource,
  title,
  badgeLabel,
  badgeColor,
  showBadge = false,
  fitToContainer = false,
  onPress,
  onRemovePress,
}: ProfileVideoCardProps) {
  const { width: windowWidth } = useWindowDimensions();
  const cardDimensions = useMemo(
    () => getCardDimensions(windowWidth),
    [windowWidth],
  );

  const handleRemovePress = (event: GestureResponderEvent) => {
    event.stopPropagation?.();
    onRemovePress?.();
  };

  return (
    <Pressable
      style={[
        styles.container,
        !fitToContainer && {
          width: cardDimensions.compactVideoCardWidth,
          marginRight: cardDimensions.compactVideoCardGap,
        },
        fitToContainer && styles.fitContainer,
      ]}
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        <Image source={imageSource} style={styles.image} contentFit="cover" placeholder={{ blurhash }} transition={200} cachePolicy="memory-disk" />
        {onRemovePress && (
          <Pressable
            style={styles.removeButton}
            onPress={handleRemovePress}
            hitSlop={8}
          >
            <Ionicons name="close" size={14} color="#FFFFFF" />
          </Pressable>
        )}
        {showBadge && badgeLabel && (
          <View
            style={[
              styles.badgeContainer,
              { backgroundColor: badgeColor || "#2563EB" },
            ]}
          >
            <Text style={styles.badgeText}>{badgeLabel}</Text>
          </View>
        )}
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
  },
  fitContainer: {
    width: "100%",
    marginRight: 0,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    aspectRatio: VIDEO_MEDIA_ASPECT_RATIO,
    borderRadius: borderRadius.md,
    overflow: "hidden",
    backgroundColor: "#E5E5E5",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  removeButton: {
    position: "absolute",
    top: hp(6),
    right: wp(6),
    width: wp(22),
    height: wp(22),
    borderRadius: wp(11),
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeContainer: {
    position: "absolute",
    top: wp(4),
    left: wp(4),
    borderRadius: borderRadius.full,
    paddingHorizontal: wp(6),
    paddingVertical: wp(2),
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: fs(8),
    fontFamily: FONTS.bold,
    letterSpacing: 0.4,
  },
  title: {
    marginTop: 8,
    fontSize: 15,
    fontFamily: FONTS.semibold,
    color: "#000000",
    lineHeight: 20,
  },
});
