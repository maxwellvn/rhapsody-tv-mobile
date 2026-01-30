import { AuthTabs } from "@/components/auth-tabs";
import Loader from "@/components/loader";
import { useToast } from "@/context/ToastContext";
import { useLogin } from "@/hooks/mutations";
import { styles } from "@/styles/register.styles";
import { storage } from "@/utils/storage";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
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

export default function SignInScreen() {
  const router = useRouter();
  const { email: emailParam } = useLocalSearchParams<{ email?: string }>();
  const { showError, showSuccess, showWarning } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (typeof emailParam === "string" && emailParam.trim()) {
      setEmail(emailParam.trim().toLowerCase());
    }
  }, [emailParam]);

  // Use Tanstack Query login mutation
  const loginMutation = useLogin();
  const isLoading = loginMutation.isPending;

  const handleBack = () => {
    router.back();
  };

  const validateForm = () => {
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
      showError("Please enter your password");
      return false;
    }

    return true;
  };

  const handleSignIn = async () => {
    if (!validateForm()) {
      return;
    }

    loginMutation.mutate(
      {
        email: email.trim().toLowerCase(),
        password,
      },
      {
        onSuccess: async (data) => {
          // Save tokens to storage
          await storage.saveTokens(data.accessToken, data.refreshToken);

          // Save user data
          await storage.saveUserData(data.user);

          // Check if email is verified
          if (!data.isEmailVerified) {
            // Navigate to verify email screen
            router.push({
              pathname: "/(auth)/verify-email",
              params: { email: email.trim().toLowerCase() },
            });

            showWarning("Please verify your email address to continue.");
          } else {
            // Navigate to main app
            showSuccess("Sign in successful!");
            router.push("/(tabs)");
          }
        },
        onError: (error: any) => {
          console.error("Login error:", error);

          if (error.statusCode === 401) {
            showError(
              "The email or password you entered is incorrect. Please try again.",
            );
          } else {
            showError(
              error.message ||
                "An error occurred during sign in. Please try again.",
            );
          }
        },
      },
    );
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
          <AuthTabs activeTab="signin" />
        </View>

        {/* Form Container */}
        <ScrollView
          style={styles.formContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Email Address or Username */}
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
            editable={!isLoading}
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
              editable={!isLoading}
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
              hitSlop={8}
              disabled={isLoading}
            >
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={24}
                color="#999"
              />
            </Pressable>
          </View>

          {/* Forgot Password Link */}
          <Pressable style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPasswordText}>Forgot Password</Text>
          </Pressable>

          {/* Sign In Button */}
          <Pressable
            style={[
              styles.registerButton,
              { marginTop: 100 },
              isLoading && styles.registerButtonDisabled,
            ]}
            onPress={handleSignIn}
            disabled={isLoading}
          >
            <Text style={styles.registerButtonText}>Sign In</Text>
          </Pressable>

          {/* Full Screen Loader Overlay */}
          {isLoading && <Loader />}

          {/* OR Divider */}
          <Text style={styles.orText}>OR</Text>

          {/* KingsChat Button */}
          <Pressable style={styles.kingschatButton}>
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
