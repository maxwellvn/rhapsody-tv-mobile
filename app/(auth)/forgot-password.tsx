import Loader from "@/components/loader";
import { useToast } from "@/context/ToastContext";
import { authService } from "@/services/auth.service";
import { styles } from "@/styles/register.styles";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { email: emailParam } = useLocalSearchParams<{ email?: string }>();
  const { showError, showSuccess, showInfo } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    if (typeof emailParam === "string" && emailParam.trim()) {
      setEmail(emailParam.trim().toLowerCase());
    }
  }, [emailParam]);

  const handleBack = () => {
    router.back();
  };

  const handleSendReset = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      showError("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      showError("Please enter a valid email address");
      return;
    }

    try {
      setIsSubmitting(true);
      await authService.forgotPassword(normalizedEmail);
      showSuccess("If your email exists, a reset link has been sent.");
      router.replace({
        pathname: "/(auth)/signin",
        params: { email: normalizedEmail, tab: "signin" },
      });
    } catch (error: any) {
      if (error?.statusCode === 404) {
        showInfo("If your email exists, a reset link will be sent.");
        router.replace({
          pathname: "/(auth)/signin",
          params: { email: normalizedEmail, tab: "signin" },
        });
        return;
      }

      if (error?.statusCode === 501 || error?.statusCode === 405) {
        showError("Password reset is not enabled on this server yet.");
        return;
      }

      showError(error?.message || "Failed to request password reset.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.blueSection} />

        <Pressable onPress={handleBack} style={styles.backButton} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color="#FAFAFA" />
        </Pressable>

        <Text style={styles.welcomeText}>Reset your{"\n"}password</Text>

        <ScrollView
          style={styles.formContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.formContent}
        >
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

          <Text style={[styles.forgotPasswordText, { marginTop: 8, color: "#334155" }]}>
            Enter your account email and we will send a reset link.
          </Text>

          <Pressable
            style={[styles.registerButton, isSubmitting && styles.registerButtonDisabled]}
            onPress={handleSendReset}
            disabled={isSubmitting}
          >
            <Text style={styles.registerButtonText}>Send Reset Link</Text>
          </Pressable>

          {isSubmitting && <Loader />}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
