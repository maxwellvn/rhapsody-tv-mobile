import { FONTS } from "@/styles/global";
import { borderRadius, fs, hp, wp } from "@/utils/responsive";
import {
  getCardDimensions,
  VIDEO_MEDIA_ASPECT_RATIO,
} from "@/utils/card-dimensions";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import {
    GestureResponderEvent,
    Image,
    ImageSourcePropType,
    Pressable,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from "react-native";
import { Badge } from "../badge";

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

export function ProfileVideoCard({
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
        <Image source={imageSource} style={styles.image} resizeMode="cover" />
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
          <View style={styles.badgeContainer}>
            <Badge label={badgeLabel} dotColor={badgeColor} />
          </View>
        )}
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowColor: "#94A3B8",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
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
    top: hp(8),
    left: wp(8),
  },
  title: {
    marginTop: hp(8),
    fontSize: fs(14),
    fontFamily: FONTS.medium,
    color: "#000000",
    lineHeight: fs(18),
  },
});
