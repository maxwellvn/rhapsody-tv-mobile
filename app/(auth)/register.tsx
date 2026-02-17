import { AuthTabs } from "@/components/auth-tabs";
import Loader from "@/components/loader";
import { useToast } from "@/context/ToastContext";
import { useKingsChatLogin, useRegister } from "@/hooks/mutations";
import { styles } from "@/styles/register.styles";
import {
  handleKingsChatAuthError,
  handleKingsChatAuthSuccess,
} from "@/utils/kingschat-auth";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
  const router = useRouter();
  const { showError, showSuccess } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Use Tanstack Query register mutation
  const registerMutation = useRegister();
  const kingsChatLoginMutation = useKingsChatLogin();
  const isLoading = registerMutation.isPending;
  const isKingsChatLoading = kingsChatLoginMutation.isPending;
  const isSubmitting = isLoading || isKingsChatLoading;

  const handleBack = () => {
    router.back();
  };

  const validateForm = () => {
    if (!fullName.trim()) {
      showError("Please enter your full name");
      return false;
    }

    if (!email.trim()) {
      showError("Please enter your email address");
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError("Please enter a valid email address");
      return false;
    }

    if (!password) {
      showError("Please enter a password");
      return false;
    }

    if (password.length < 6) {
      showError("Password must be at least 6 characters long");
      return false;
    }

    if (password !== confirmPassword) {
      showError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    registerMutation.mutate(
      {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
      },
      {
        onSuccess: () => {
          showSuccess("Registration successful! Please verify your email.");
          // Navigate to verify email screen
          router.push({
            pathname: "/(auth)/verify-email",
            params: { email: email.trim().toLowerCase() },
          });
        },
        onError: (error: any) => {
          console.error("Registration error:", error);

          if (error.statusCode === 409) {
            showError(
              "An account with this email already exists. Please sign in instead.",
            );
          } else {
            showError(
              error.message ||
                "An error occurred during registration. Please try again.",
            );
          }
        },
      },
    );
  };

  const handleKingsChatSignIn = async () => {
    kingsChatLoginMutation.mutate(undefined, {
      onSuccess: async (data) => {
        await handleKingsChatAuthSuccess(data, showSuccess, () =>
          router.push("/(tabs)"),
        );
      },
      onError: (error: any) => {
        handleKingsChatAuthError(error, showError);
      },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* Blue Background Section */}
        <View style={styles.blueSection} />

        {/* Back Button */}
        <Pressable onPress={handleBack} style={styles.backButton} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color="#FAFAFA" />
        </Pressable>

        {/* Welcome Text */}
        <Text style={styles.welcomeText}>Welcome to{"\n"}Rhapsody TV</Text>

        {/* Auth Tabs */}
        <View style={styles.tabsContainer}>
          <AuthTabs activeTab="register" />
        </View>

        {/* Form Container */}
        <ScrollView
          style={styles.formContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Full Name */}
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={[
              styles.input,
              focusedField === "fullName" && styles.inputFocused,
            ]}
            placeholder="Full Name"
            placeholderTextColor="#999"
            value={fullName}
            onChangeText={setFullName}
            onFocus={() => setFocusedField("fullName")}
            onBlur={() => setFocusedField(null)}
            autoCorrect={false}
            editable={!isSubmitting}
          />

          {/* Email Address */}
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={[
              styles.input,
              focusedField === "email" && styles.inputFocused,
            ]}
            placeholder="Email Address"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField(null)}
            editable={!isSubmitting}
          />

          {/* Password */}
          <Text style={styles.label}>Password</Text>
          <View
            style={[
              styles.passwordContainer,
              focusedField === "password" && styles.passwordContainerFocused,
            ]}
          >
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              editable={!isSubmitting}
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
              hitSlop={8}
              disabled={isSubmitting}
            >
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={24}
                color="#999"
              />
            </Pressable>
          </View>

          {/* Confirm Password */}
          <Text style={styles.label}>Confirm Password</Text>
          <View
            style={[
              styles.passwordContainer,
              focusedField === "confirmPassword" &&
                styles.passwordContainerFocused,
            ]}
          >
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirm Password"
              placeholderTextColor="#999"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
              onFocus={() => setFocusedField("confirmPassword")}
              onBlur={() => setFocusedField(null)}
              editable={!isSubmitting}
            />
            <Pressable
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeIcon}
              hitSlop={8}
              disabled={isSubmitting}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                size={24}
                color="#999"
              />
            </Pressable>
          </View>

          {/* Register Button */}
          <Pressable
            style={[
              styles.registerButton,
              isSubmitting && styles.registerButtonDisabled,
            ]}
            onPress={handleRegister}
            disabled={isSubmitting}
          >
            <Text style={styles.registerButtonText}>Register</Text>
          </Pressable>

          {/* Full Screen Loader Overlay */}
          {isSubmitting && <Loader />}

          {/* OR Divider */}
          <Text style={styles.orText}>OR</Text>

          {/* KingsChat Button */}
          <Pressable
            style={styles.kingschatButton}
            onPress={handleKingsChatSignIn}
            disabled={isSubmitting}
          >
            <Text style={styles.kingschatButtonText}>
              Sign In with KingsChat
            </Text>
            <Image
              source={require("@/assets/Icons/KC.png")}
              style={styles.kingschatIcon}
              resizeMode="contain"
            />
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
