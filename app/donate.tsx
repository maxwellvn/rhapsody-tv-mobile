import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Stack, useFocusEffect } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";
import { FONTS } from "@/styles/global";
import { fs, hp, spacing, wp, borderRadius } from "@/utils/responsive";
import { useCreatePaymentIntent } from "@/hooks/queries/useDonationQueries";
import { donationService } from "@/services/donation.service";
import { useToast } from "@/context/ToastContext";
import { useVideoOverlay } from "@/context/VideoOverlayContext";
import { STRIPE_PUBLISHABLE_KEY } from "@/context/AppProvider";

import {
  CardForm as StripeCardForm,
  CardField as StripeCardField,
  useConfirmPayment,
} from "@stripe/stripe-react-native";

const PRESET_AMOUNTS = [5, 10, 25, 50];

type PaymentMethod = "stripe" | "espees";

export default function DonateScreen() {
  const { showSuccess, showError } = useToast();
  const { confirmPayment } = useConfirmPayment();
  const { isPlaying, setIsPlaying } = useVideoOverlay();
  const wasPlayingRef = useRef(false);

  // Pause video when entering donate screen, resume when leaving
  useFocusEffect(
    useCallback(() => {
      if (isPlaying) {
        wasPlayingRef.current = true;
        setIsPlaying(false);
      }
      return () => {
        if (wasPlayingRef.current) {
          setIsPlaying(true);
          wasPlayingRef.current = false;
        }
      };
    }, [])
  );

  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("stripe");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);

  const createPaymentIntent = useCreatePaymentIntent();

  const activeAmount =
    selectedAmount ?? (customAmount ? Number(customAmount) : 0);

  const handlePresetSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (text: string) => {
    const cleaned = text.replace(/[^0-9.]/g, "");
    setCustomAmount(cleaned);
    setSelectedAmount(null);
  };

  const handleCopyCode = async () => {
    await Clipboard.setStringAsync("RORTV01");
    showSuccess("Code copied to clipboard!");
  };

  const handleDonate = async () => {
    if (!activeAmount || activeAmount < 1) {
      showError("Please select or enter a donation amount.");
      return;
    }

    setIsProcessing(true);
    try {
      const { clientSecret, donationId, publishableKey } = await createPaymentIntent.mutateAsync({
        amount: activeAmount,
      });

      // Prevent confusing Stripe errors like "No such payment_intent" when
      // backend and app are configured with keys from different Stripe accounts.
      if (
        publishableKey &&
        STRIPE_PUBLISHABLE_KEY &&
        publishableKey !== STRIPE_PUBLISHABLE_KEY
      ) {
        showError(
          "Stripe keys do not match. Update EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY to the same Stripe account as the backend and reload the app.",
        );
        return;
      }

      const { error } = await confirmPayment(clientSecret, {
        paymentMethodType: "Card",
      });

      if (error) {
        showError(error.message || "Payment failed. Please try again.");
      } else {
        // Confirm the donation status on backend
        try {
          await donationService.confirmDonation(donationId);
        } catch {
          // Non-critical - webhook can still update status
        }
        showSuccess("Thank you for your donation!");
        router.back();
      }
    } catch (err: any) {
      showError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
            hitSlop={8}
          >
            <Image
              source={require("@/assets/Icons/back.png")}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </Pressable>
          <Text style={styles.headerTitle}>Donate</Text>
          <View style={styles.headerSpacer} />
        </View>

        <KeyboardAvoidingView
          style={styles.scrollView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Image
              source={require("@/assets/Icons/sponsor-icon.png")}
              style={styles.heroIcon}
              resizeMode="contain"
            />
            <Text style={styles.heroTitle}>Support Rhapsody TV</Text>
            <Text style={styles.heroDescription}>
              Your generosity helps us continue spreading the gospel through
              media to people around the world.
            </Text>
          </View>

          {/* Payment Method Tabs */}
          <View style={styles.section}>
            <Text style={styles.label}>Payment Method</Text>
            <View style={styles.methodRow}>
              <Pressable
                style={[
                  styles.methodCard,
                  selectedMethod === "stripe" && styles.methodCardActive,
                ]}
                onPress={() => setSelectedMethod("stripe")}
              >
                <Ionicons
                  name="card-outline"
                  size={fs(22)}
                  color={selectedMethod === "stripe" ? "#1D4ED8" : "#737373"}
                />
                <Text
                  style={[
                    styles.methodLabel,
                    selectedMethod === "stripe" && styles.methodLabelActive,
                  ]}
                >
                  Card
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.methodCard,
                  selectedMethod === "espees" && styles.methodCardActive,
                ]}
                onPress={() => setSelectedMethod("espees")}
              >
                <Ionicons
                  name="wallet-outline"
                  size={fs(22)}
                  color={selectedMethod === "espees" ? "#1D4ED8" : "#737373"}
                />
                <Text
                  style={[
                    styles.methodLabel,
                    selectedMethod === "espees" && styles.methodLabelActive,
                  ]}
                >
                  Espees
                </Text>
              </Pressable>
            </View>
          </View>

          {selectedMethod === "stripe" ? (
            <>
              {/* Amount Selection */}
              <View style={styles.section}>
                <Text style={styles.label}>Select Amount</Text>
                <View style={styles.presetGrid}>
                  {PRESET_AMOUNTS.map((amount) => (
                    <Pressable
                      key={amount}
                      style={[
                        styles.presetButton,
                        selectedAmount === amount && styles.presetButtonActive,
                      ]}
                      onPress={() => handlePresetSelect(amount)}
                    >
                      <Text
                        style={[
                          styles.presetText,
                          selectedAmount === amount && styles.presetTextActive,
                        ]}
                      >
                        ${amount}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Custom Amount */}
              <View style={styles.section}>
                <Text style={styles.label}>Custom Amount</Text>
                <View style={styles.customInputContainer}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={styles.customInput}
                    placeholder="0.00"
                    placeholderTextColor="#999999"
                    keyboardType="decimal-pad"
                    value={customAmount}
                    onChangeText={handleCustomAmountChange}
                  />
                </View>
              </View>

              {/* Card Details */}
              <View style={styles.section}>
                <Text style={styles.label}>Card Details</Text>
                <View
                  style={[
                    styles.cardFieldContainer,
                    Platform.OS === "android" && styles.cardFormContainerAndroid,
                  ]}
                >
                  {Platform.OS === "android" ? (
                    <StripeCardForm
                      style={styles.cardForm}
                      cardStyle={{
                        backgroundColor: "#FFFFFF",
                        textColor: "#000000",
                        placeholderColor: "#999999",
                        borderColor: "#E5E5E5",
                        borderRadius: 8,
                        borderWidth: 1,
                        fontSize: 16,
                      }}
                      onFormComplete={(details: any) => {
                        setCardComplete(!!details?.complete);
                      }}
                    />
                  ) : (
                    <StripeCardField
                      postalCodeEnabled={false}
                      placeholders={{ number: "Card number" }}
                      cardStyle={{
                        backgroundColor: "#FFFFFF",
                        textColor: "#000000",
                        placeholderColor: "#999999",
                        fontSize: 16,
                        borderWidth: 0,
                      }}
                      style={styles.cardField}
                      onCardChange={(details: any) => {
                        setCardComplete(!!details?.complete);
                      }}
                    />
                  )}
                </View>
              </View>

              {/* Donate Button */}
              <View style={styles.section}>
                <Pressable
                  style={[
                    styles.donateButton,
                    (!activeAmount || activeAmount < 1 || isProcessing) && styles.donateButtonDisabled,
                  ]}
                  onPress={handleDonate}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <View style={styles.donateButtonContent}>
                      <Ionicons
                        name="shield-checkmark-outline"
                        size={fs(18)}
                        color="#FFFFFF"
                      />
                      <Text style={styles.donateButtonText}>
                        Donate ${activeAmount || 0}
                      </Text>
                    </View>
                  )}
                </Pressable>
                <View style={styles.secureRow}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={fs(12)}
                    color="#999999"
                  />
                  <Text style={styles.secureText}>
                    Secured by Stripe
                  </Text>
                </View>
              </View>
            </>
          ) : (
            /* Espees Section */
            <View style={styles.section}>
              <View style={styles.espeesCard}>
                <View style={styles.espeesIconRow}>
                  <View style={styles.espeesIconContainer}>
                    <Ionicons name="wallet" size={fs(20)} color="#1D4ED8" />
                  </View>
                  <Text style={styles.espeesCardTitle}>
                    Espees Donation Code
                  </Text>
                </View>
                <Text style={styles.espeesDescription}>
                  Use the code below in your Espees wallet to send your
                  donation to Rhapsody TV.
                </Text>
                <View style={styles.espeesCodeContainer}>
                  <Text style={styles.espeesCode}>RORTV01</Text>
                </View>
                <Pressable
                  style={styles.copyCodeButton}
                  onPress={handleCopyCode}
                >
                  <Ionicons
                    name="copy-outline"
                    size={fs(16)}
                    color="#FFFFFF"
                  />
                  <Text style={styles.copyCodeButtonText}>Copy Code</Text>
                </Pressable>
              </View>
            </View>
          )}

          <View style={styles.bottomSpacer} />
        </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingTop: hp(10),
    paddingBottom: hp(12),
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
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
  scrollContent: {
    flexGrow: 1,
  },

  /* Hero */
  heroSection: {
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingTop: hp(24),
    paddingBottom: hp(8),
  },
  heroIcon: {
    width: wp(80),
    height: wp(80),
    marginBottom: hp(12),
  },
  heroTitle: {
    fontSize: fs(22),
    fontFamily: FONTS.bold,
    color: "#0F0F0F",
    marginBottom: hp(6),
  },
  heroDescription: {
    fontSize: fs(14),
    fontFamily: FONTS.regular,
    color: "#737373",
    lineHeight: fs(20),
    textAlign: "center",
  },

  /* Sections */
  section: {
    paddingHorizontal: spacing.xl,
    paddingTop: hp(20),
  },
  label: {
    fontSize: fs(13),
    fontFamily: FONTS.semibold,
    color: "#0F0F0F",
    marginBottom: hp(10),
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  /* Method Tabs */
  methodRow: {
    flexDirection: "row",
    gap: wp(12),
  },
  methodCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp(8),
    backgroundColor: "#F5F5F5",
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: "#E5E5E5",
    paddingVertical: hp(14),
  },
  methodCardActive: {
    borderColor: "#1D4ED8",
    backgroundColor: "#EEF2FF",
  },
  methodLabel: {
    fontSize: fs(15),
    fontFamily: FONTS.medium,
    color: "#737373",
  },
  methodLabelActive: {
    color: "#1D4ED8",
    fontFamily: FONTS.semibold,
  },

  /* Preset Amounts */
  presetGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: wp(10),
  },
  presetButton: {
    flex: 1,
    minWidth: wp(70),
    backgroundColor: "#F5F5F5",
    borderRadius: borderRadius.sm,
    borderWidth: 1.5,
    borderColor: "#E5E5E5",
    paddingVertical: hp(14),
    alignItems: "center",
  },
  presetButtonActive: {
    borderColor: "#1D4ED8",
    backgroundColor: "#EEF2FF",
  },
  presetText: {
    fontSize: fs(16),
    fontFamily: FONTS.semibold,
    color: "#0F0F0F",
  },
  presetTextActive: {
    color: "#1D4ED8",
  },

  /* Custom Input */
  customInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: borderRadius.sm,
    borderWidth: 1.5,
    borderColor: "#E5E5E5",
    paddingHorizontal: spacing.md,
  },
  currencySymbol: {
    fontSize: fs(18),
    fontFamily: FONTS.semibold,
    color: "#0F0F0F",
    marginRight: wp(6),
  },
  customInput: {
    flex: 1,
    fontSize: fs(18),
    fontFamily: FONTS.medium,
    color: "#000000",
    paddingVertical: hp(14),
  },

  /* Card Field */
  cardFieldContainer: {
    backgroundColor: "#F5F5F5",
    borderRadius: borderRadius.sm,
    borderWidth: 1.5,
    borderColor: "#E5E5E5",
    overflow: "hidden",
  },
  cardFormContainerAndroid: {
    overflow: "visible",
    backgroundColor: "transparent",
    padding: 0,
    borderWidth: 0,
    borderColor: "transparent",
    borderRadius: 0,
    minHeight: Math.max(hp(320), 320),
  },
  cardField: {
    width: "100%",
    height: hp(50),
  },
  cardForm: {
    width: "100%",
    height: Math.max(hp(320), 320),
  },

  /* Donate Button */
  donateButton: {
    backgroundColor: "#1D4ED8",
    borderRadius: borderRadius.sm,
    paddingVertical: hp(16),
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(10),
  },
  donateButtonDisabled: {
    backgroundColor: "#CCCCCC",
  },
  donateButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(8),
  },
  donateButtonText: {
    fontSize: fs(16),
    fontFamily: FONTS.bold,
    color: "#FFFFFF",
  },
  secureRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp(4),
    marginTop: hp(10),
  },
  secureText: {
    fontSize: fs(12),
    fontFamily: FONTS.regular,
    color: "#999999",
  },

  /* Espees */
  espeesCard: {
    backgroundColor: "#F5F5F5",
    borderRadius: borderRadius.md,
    padding: spacing.xl,
  },
  espeesIconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(10),
    marginBottom: hp(10),
  },
  espeesIconContainer: {
    width: wp(36),
    height: wp(36),
    borderRadius: wp(18),
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  espeesCardTitle: {
    fontSize: fs(16),
    fontFamily: FONTS.semibold,
    color: "#0F0F0F",
  },
  espeesDescription: {
    fontSize: fs(14),
    fontFamily: FONTS.regular,
    color: "#737373",
    lineHeight: fs(20),
    marginBottom: hp(16),
  },
  espeesCodeContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.sm,
    paddingVertical: hp(18),
    paddingHorizontal: spacing.xxl,
    borderWidth: 1.5,
    borderColor: "#E5E5E5",
    alignItems: "center",
    marginBottom: hp(16),
  },
  espeesCode: {
    fontSize: fs(28),
    fontFamily: FONTS.bold,
    color: "#1D4ED8",
    letterSpacing: 4,
  },
  copyCodeButton: {
    backgroundColor: "#1D4ED8",
    borderRadius: borderRadius.sm,
    paddingVertical: hp(14),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp(8),
  },
  copyCodeButtonText: {
    fontSize: fs(15),
    fontFamily: FONTS.semibold,
    color: "#FFFFFF",
  },
  bottomSpacer: {
    height: hp(40),
  },
});
