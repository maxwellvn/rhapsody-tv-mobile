/* eslint-disable @typescript-eslint/no-unused-vars */
import { useToast } from "@/context/ToastContext";
import {
  useUpdateProfile,
  useUserProfile,
} from "@/hooks/queries/useAuthQueries";
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

export default function EditProfileScreen() {
  const { data: profile, isLoading } = useUserProfile();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const { showError, showSuccess } = useToast();

  const [fullName, setFullName] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.fullName) {
      setFullName(profile.fullName);
    }
  }, [profile]);

  const trimmedName = fullName.trim();
  const isDirty = useMemo(() => {
    return trimmedName.length > 0 && trimmedName !== (profile?.fullName ?? "");
  }, [profile?.fullName, trimmedName]);

  const handleBack = () => {
    router.back();
  };

  const handleSave = () => {
    if (!trimmedName) {
      showError("Please enter your full name");
      return;
    }

    updateProfile(
      { fullName: trimmedName },
      {
        onSuccess: () => {
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
                <ActivityIndicator size="small" color="#000" />
              </View>
            )}

            <View style={styles.section}>
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
                value={profile?.email ?? ""}
                editable={false}
                placeholder="Email"
                placeholderTextColor="#999"
                autoCapitalize="none"
              />
            </View>

            <Pressable
              style={[
                styles.saveButton,
                (!isDirty || isUpdating) && styles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={!isDirty || isUpdating}
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
