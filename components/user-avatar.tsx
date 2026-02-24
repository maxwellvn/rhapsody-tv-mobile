import { API_CONFIG } from "@/config/api.config";
import { DEFAULT_PROFILE_AVATAR } from "@/constants/avatar";
import { Image, ImageStyle, StyleProp, StyleSheet, ViewStyle } from "react-native";

type UserAvatarProps = {
  avatarKey?: string | null;
  gender?: string | null;
  seed?: string | null;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export function UserAvatar({
  avatarKey,
  gender,
  seed,
  size = 40,
  style,
}: UserAvatarProps) {
  const isImageAvatar =
    !!avatarKey &&
    (avatarKey.startsWith("http://") ||
      avatarKey.startsWith("https://") ||
      avatarKey.startsWith("file://") ||
      avatarKey.startsWith("/"));

  const resolvedAvatarUri =
    avatarKey && avatarKey.startsWith("/")
      ? `${API_CONFIG.BASE_URL.replace(/\/v1\/?$/, "")}${avatarKey}`
      : avatarKey || undefined;

  if (isImageAvatar) {
    return (
      <Image
        source={{ uri: resolvedAvatarUri }}
        style={[
          styles.image,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
          style as StyleProp<ImageStyle>,
        ]}
      />
    );
  }

  return (
    <Image
      source={DEFAULT_PROFILE_AVATAR}
      style={[
        {
          width: size,
          height: size,
        },
        style as StyleProp<ImageStyle>,
      ]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: "#E5E7EB",
  },
});
