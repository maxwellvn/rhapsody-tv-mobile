import { AuthTabs } from "@/components/auth-tabs";
import Loader from "@/components/loader";
import { useToast } from "@/context/ToastContext";
import { useKingsChatLogin, useLogin, useRegister } from "@/hooks/mutations";
import { styles } from "@/styles/register.styles";
import {
  handleKingsChatAuthError,
  handleKingsChatAuthSuccess,
} from "@/utils/kingschat-auth";
import { storage } from "@/utils/storage";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
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

type AuthTab = "register" | "signin";

export default function AuthScreen() {
  const router = useRouter();
  const { email: emailParam, tab: tabParam } = useLocalSearchParams<{
    email?: string;
    tab?: string;
  }>();
  const { showError, showSuccess, showWarning } = useToast();
  const [activeTab, setActiveTab] = useState<AuthTab>(
    tabParam === "register" ? "register" : "signin",
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const formTransition = useRef(new Animated.Value(1)).current;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (tabParam === "register" || tabParam === "signin") {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    if (typeof emailParam === "string" && emailParam.trim()) {
      setEmail(emailParam.trim().toLowerCase());
    }
  }, [emailParam]);

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const kingsChatLoginMutation = useKingsChatLogin();

  const isLoading = loginMutation.isPending || registerMutation.isPending;
  const isKingsChatLoading = kingsChatLoginMutation.isPending;
  const isSubmitting = isLoading || isKingsChatLoading;

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/onboarding");
    }
  };

  const animateToTab = (nextTab: AuthTab) => {
    if (activeTab === nextTab || isSubmitting) {
      return;
    }

    Animated.sequence([
      Animated.timing(formTransition, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(formTransition, {
        toValue: 1,
        duration: 240,
        useNativeDriver: true,
      }),
    ]).start();

    setFocusedField(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setActiveTab(nextTab);
  };

  const validateSignInForm = () => {
    if (!email.trim()) {
      showError("Please enter your email address");
      return false;
    }

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

  const validateRegisterForm = () => {
    if (!fullName.trim()) {
      showError("Please enter your full name");
      return false;
    }

    if (!email.trim()) {
      showError("Please enter your email address");
      return false;
    }

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

  const handleSignIn = async () => {
    if (!validateSignInForm()) {
      return;
    }

    loginMutation.mutate(
      {
        email: email.trim().toLowerCase(),
        password,
      },
      {
        onSuccess: async (data) => {
          await storage.saveTokens(data.accessToken, data.refreshToken);
          await storage.saveUserData(data.user);

          if (!data.isEmailVerified) {
            router.push({
              pathname: "/(auth)/verify-email",
              params: { email: email.trim().toLowerCase() },
            });

            showWarning("Please verify your email address to continue.");
          } else {
            router.replace("/(tabs)");
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

  const handleRegister = async () => {
    if (!validateRegisterForm()) {
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
          router.replace("/(tabs)"),
        );
      },
      onError: (error: any) => {
        handleKingsChatAuthError(error, showError);
      },
    });
  };

  const registerFields = (
    <>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={[styles.input, focusedField === "fullName" && styles.inputFocused]}
          placeholder="Full Name"
          placeholderTextColor="#999"
          value={fullName}
          onChangeText={setFullName}
          onFocus={() => setFocusedField("fullName")}
          onBlur={() => setFocusedField(null)}
          autoCorrect={false}
          editable={!isSubmitting}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={[styles.input, focusedField === "email" && styles.inputFocused]}
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
      </View>

      <View style={styles.fieldGroup}>
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
            onPress={() => setShowPassword((prev) => !prev)}
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
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Confirm Password</Text>
        <View
          style={[
            styles.passwordContainer,
            focusedField === "confirmPassword" && styles.passwordContainerFocused,
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
            onPress={() => setShowConfirmPassword((prev) => !prev)}
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
      </View>

      <View style={styles.fieldGroup}>
        <Pressable
          style={[styles.registerButton, isSubmitting && styles.registerButtonDisabled]}
          onPress={handleRegister}
          disabled={isSubmitting}
        >
          <Text style={styles.registerButtonText}>Register</Text>
        </Pressable>
      </View>
    </>
  );

  const signInFields = (
    <>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={[styles.input, focusedField === "email" && styles.inputFocused]}
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
      </View>

      <View style={styles.fieldGroup}>
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
            onPress={() => setShowPassword((prev) => !prev)}
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
      </View>

      <View style={styles.fieldGroup}>
        <Pressable
          style={styles.forgotPasswordContainer}
          onPress={() =>
            router.push({
              pathname: "/(auth)/forgot-password",
              params: email.trim()
                ? { email: email.trim().toLowerCase() }
                : undefined,
            })
          }
          disabled={isSubmitting}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password</Text>
        </Pressable>
      </View>

      <View style={styles.fieldGroup}>
        <Pressable
          style={[styles.registerButton, isSubmitting && styles.registerButtonDisabled]}
          onPress={handleSignIn}
          disabled={isSubmitting}
        >
          <Text style={styles.registerButtonText}>Sign In</Text>
        </Pressable>
      </View>
    </>
  );

  const animatedFormStyle = useMemo(
    () => ({
      opacity: formTransition,
      transform: [
        {
          translateY: formTransition.interpolate({
            inputRange: [0, 1],
            outputRange: [12, 0],
          }),
        },
      ],
    }),
    [formTransition],
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.blueSection} />

        <Pressable onPress={handleBack} style={styles.backButton} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color="#FAFAFA" />
        </Pressable>

        <Text style={styles.welcomeText}>Welcome to{"\n"}Rhapsody TV</Text>

        <View style={styles.tabsContainer}>
          <AuthTabs
            activeTab={activeTab}
            onTabChange={animateToTab}
            disabled={isSubmitting}
          />
        </View>

        <ScrollView
          style={styles.formContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.formContent}
        >
          <Animated.View style={animatedFormStyle}>
            {activeTab === "register" ? registerFields : signInFields}

            {isSubmitting && <Loader />}

            <Text style={styles.orText}>OR</Text>

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
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
