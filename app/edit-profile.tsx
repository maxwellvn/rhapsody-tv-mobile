import { AppSpinner } from "@/components/app-spinner";
import { UserAvatar } from "@/components/user-avatar";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import {
  useUpdateProfile,
  useUserProfile,
} from "@/hooks/queries/useAuthQueries";
import { userService } from "@/services/user.service";
import { FONTS } from "@/styles/global";
import { fs, hp, spacing, wp } from "@/utils/responsive";
import { router, Stack } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as FileSystem from "expo-file-system/legacy";

async function getImagePickerModule() {
  try {
    return await import("expo-image-picker");
  } catch {
    return null;
  }
}

function isPhotoAvatar(value?: string | null) {
  if (!value) return false;
  return (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("file://") ||
    value.startsWith("/uploads/")
  );
}

export default function EditProfileScreen() {
  const { data: profile, isLoading } = useUserProfile();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const { showError, showSuccess } = useToast();
  const { user: authUser, updateUser } = useAuth();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  useEffect(() => {
    const resolvedFullName = profile?.fullName ?? authUser?.fullName ?? "";
    const resolvedUsername =
      profile?.username ??
      profile?.kingsChatUsername ??
      authUser?.username ??
      authUser?.kingsChatUsername ??
      "";

    if (resolvedFullName) {
      setFullName(resolvedFullName);
    }

    if (resolvedUsername) {
      setUsername(resolvedUsername);
    }

    const currentAvatarRaw = (profile as any)?.avatar ?? (authUser as any)?.avatar;
    const currentAvatar =
      typeof currentAvatarRaw === "string" ? currentAvatarRaw.trim() : "";
    if (isPhotoAvatar(currentAvatar)) {
      setProfileImageUrl(currentAvatar);
    } else {
      setProfileImageUrl("");
    }
  }, [
    authUser,
    authUser?.email,
    authUser?.fullName,
    authUser?.id,
    authUser?.kingsChatUsername,
    authUser?.username,
    profile,
    profile?.email,
    profile?.fullName,
    profile?.id,
    profile?.kingsChatUsername,
    profile?.username,
  ]);

  const trimmedName = fullName.trim();
  const initialFullName = profile?.fullName ?? "";
  const initialStoredAvatar =
    ((profile as any)?.avatar ?? (authUser as any)?.avatar ?? "").toString();
  const initialProfileImageUrl = isPhotoAvatar(initialStoredAvatar)
    ? initialStoredAvatar
    : "";

  const isDirty = useMemo(() => {
    return (
      trimmedName.length > 0 &&
      (trimmedName !== initialFullName ||
        profileImageUrl !== initialProfileImageUrl)
    );
  }, [
    initialFullName,
    initialProfileImageUrl,
    profileImageUrl,
    trimmedName,
  ]);

  const handleBack = () => {
    router.back();
  };

  const handleUploadAvatar = async () => {
    try {
      const ImagePicker = await getImagePickerModule();
      if (!ImagePicker) {
        showError("Image picker module not found. Please update app dependencies.");
        return;
      }

      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        showError("Please allow photo library access to upload a profile picture");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled || !result.assets?.[0]) return;

      const asset = result.assets[0];
      const fileName = asset.fileName || `avatar-${Date.now()}.jpg`;
      const mimeType = asset.mimeType || "image/jpeg";
      let uploadUri = asset.uri;

      // Some Android pickers return content:// URIs that fail in multipart upload.
      if (Platform.OS === "android" && uploadUri.startsWith("content://")) {
        const extension =
          (fileName.includes(".") && fileName.split(".").pop()?.toLowerCase()) ||
          "jpg";
        const normalizedExtension = ["jpg", "jpeg", "png", "webp"].includes(extension)
          ? extension
          : "jpg";
        const cacheTarget = `${FileSystem.cacheDirectory}avatar-upload-${Date.now()}.${normalizedExtension}`;
        await FileSystem.copyAsync({
          from: uploadUri,
          to: cacheTarget,
        });
        uploadUri = cacheTarget;
      }

      const formData = new FormData();
      formData.append("file", {
        uri: uploadUri,
        name: fileName,
        type: mimeType,
      } as any);

      setIsUploadingAvatar(true);
      const response = await userService.uploadAvatar(formData);
      const avatarUrl = response?.data?.avatar;

      if (!avatarUrl) {
        showError("Avatar upload failed. Please try again.");
        return;
      }

      setProfileImageUrl(avatarUrl);
      updateUser({ avatar: avatarUrl } as any);
      showSuccess("Profile picture updated");
    } catch (error: any) {
      showError(error?.message || "Failed to upload profile picture");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSave = () => {
    if (!trimmedName) {
      showError("Please enter your full name");
      return;
    }

    updateProfile(
      {
        fullName: trimmedName,
        avatar: profileImageUrl,
      },
      {
        onSuccess: () => {
          updateUser({
            fullName: trimmedName,
            avatar: profileImageUrl,
          } as any);
          router.back();
        },
        onError: (error: any) => {
          showError(
            error?.message || "Failed to update profile. Please try again.",
          );
        },
      },
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardContainer}
        >
          <View style={styles.header}>
            <Pressable
              onPress={handleBack}
              style={styles.backButton}
              hitSlop={8}
            >
              <Image
                source={require("@/assets/Icons/back.png")}
                style={styles.backIcon}
                resizeMode="contain"
              />
            </Pressable>
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {(isLoading || isUpdating) && (
              <View style={styles.loadingContainer}>
                <AppSpinner size="small" color="#000" />
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.label}>Profile Picture</Text>
              <View style={styles.avatarPreviewRow}>
                <UserAvatar
                  avatarKey={profileImageUrl}
                  size={64}
                />
                <View style={styles.avatarActions}>
                  <Text style={styles.avatarHelpText}>
                    Upload a profile photo. Your KingsChat image is also supported.
                  </Text>
                  <Pressable
                    style={[
                      styles.uploadButton,
                      isUploadingAvatar && styles.uploadButtonDisabled,
                    ]}
                    onPress={handleUploadAvatar}
                    disabled={isUploadingAvatar}
                  >
                    {isUploadingAvatar ? (
                      <AppSpinner size="small" color="#111827" />
                    ) : (
                      <Text style={styles.uploadButtonText}>Upload Photo</Text>
                    )}
                  </Pressable>
                </View>
              </View>

              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === "fullName" && styles.inputFocused,
                ]}
                placeholder="Enter your full name"
                placeholderTextColor="#999"
                value={fullName}
                onChangeText={setFullName}
                onFocus={() => setFocusedField("fullName")}
                onBlur={() => setFocusedField(null)}
                autoCorrect={false}
                editable={!isUpdating}
              />

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, styles.inputDisabled]}
                value={profile?.email ?? authUser?.email ?? ""}
                editable={false}
                placeholder="Email"
                placeholderTextColor="#999"
                autoCapitalize="none"
              />

              <Text style={styles.label}>Username</Text>
              <TextInput
                style={[styles.input, styles.inputDisabled]}
                value={username}
                editable={false}
                placeholder="No username available"
                placeholderTextColor="#999"
                autoCapitalize="none"
              />
            </View>

            <Pressable
              style={[
                styles.saveButton,
                (!isDirty || isUpdating || isUploadingAvatar) &&
                  styles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={!isDirty || isUpdating || isUploadingAvatar}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingTop: hp(10),
    paddingBottom: hp(12),
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    padding: wp(4),
  },
  backIcon: {
    width: wp(24),
    height: hp(24),
    tintColor: "#000000",
  },
  headerTitle: {
    flex: 1,
    fontSize: fs(20),
    fontFamily: FONTS.bold,
    color: "#000000",
    marginLeft: spacing.md,
  },
  headerSpacer: {
    width: wp(32),
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: hp(8),
  },
  section: {
    paddingHorizontal: spacing.xl,
    paddingTop: hp(16),
    paddingBottom: hp(8),
  },
  label: {
    fontSize: fs(14),
    fontFamily: FONTS.medium,
    color: "#111827",
    marginBottom: hp(6),
  },
  input: {
    height: hp(48),
    borderRadius: wp(10),
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: spacing.md,
    fontSize: fs(16),
    fontFamily: FONTS.regular,
    color: "#111827",
    marginBottom: hp(16),
  },
  inputFocused: {
    borderColor: "#2563EB",
  },
  inputDisabled: {
    backgroundColor: "#F3F4F6",
    color: "#6B7280",
  },
  avatarPreviewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: hp(16),
  },
  avatarActions: {
    flex: 1,
    gap: hp(8),
  },
  avatarHelpText: {
    fontSize: fs(14),
    fontFamily: FONTS.regular,
    color: "#6B7280",
    lineHeight: fs(18),
  },
  uploadButton: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
    borderRadius: wp(999),
    paddingHorizontal: wp(12),
    paddingVertical: hp(8),
    minWidth: wp(112),
    alignItems: "center",
    justifyContent: "center",
  },
  uploadButtonDisabled: {
    opacity: 0.6,
  },
  uploadButtonText: {
    fontSize: fs(13),
    fontFamily: FONTS.medium,
    color: "#111827",
  },
  saveButton: {
    marginHorizontal: spacing.xl,
    backgroundColor: "#2563EB",
    paddingVertical: hp(14),
    borderRadius: wp(12),
    alignItems: "center",
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: fs(16),
    fontFamily: FONTS.semibold,
    color: "#FFFFFF",
  },
});
