import React from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { FONTS } from "@/styles/global";
import { fs, hp, spacing, wp, borderRadius } from "@/utils/responsive";

interface EspeesModalProps {
  visible: boolean;
  onClose: () => void;
}

export function EspeesModal({ visible, onClose }: EspeesModalProps) {
  const code = "RORTV01";

  const handleCopy = async () => {
    await Clipboard.setStringAsync(code);
    Alert.alert("Copied!", "Espees code copied to clipboard.");
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>Donate with Espees</Text>
          <Text style={styles.description}>
            Use the code below to send your Espees donation:
          </Text>

          <View style={styles.codeContainer}>
            <Text style={styles.code}>{code}</Text>
          </View>

          <Pressable style={styles.copyButton} onPress={handleCopy}>
            <Text style={styles.copyButtonText}>Copy Code</Text>
          </Pressable>

          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.lg,
    padding: spacing.xxl,
    width: "100%",
    maxWidth: wp(340),
    alignItems: "center",
  },
  title: {
    fontSize: fs(20),
    fontFamily: FONTS.bold,
    color: "#000000",
    marginBottom: hp(8),
  },
  description: {
    fontSize: fs(14),
    fontFamily: FONTS.regular,
    color: "#666666",
    textAlign: "center",
    marginBottom: hp(20),
  },
  codeContainer: {
    backgroundColor: "#F0F0FF",
    borderRadius: borderRadius.md,
    paddingVertical: hp(16),
    paddingHorizontal: spacing.xxl,
    marginBottom: hp(20),
    borderWidth: 2,
    borderColor: "#0000FF",
    borderStyle: "dashed",
  },
  code: {
    fontSize: fs(28),
    fontFamily: FONTS.bold,
    color: "#0000FF",
    letterSpacing: 4,
    textAlign: "center",
  },
  copyButton: {
    backgroundColor: "#0000FF",
    borderRadius: borderRadius.sm,
    paddingVertical: hp(12),
    paddingHorizontal: spacing.xxl,
    width: "100%",
    alignItems: "center",
    marginBottom: hp(10),
  },
  copyButtonText: {
    fontSize: fs(16),
    fontFamily: FONTS.semibold,
    color: "#FFFFFF",
  },
  closeButton: {
    paddingVertical: hp(10),
    width: "100%",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: fs(14),
    fontFamily: FONTS.medium,
    color: "#666666",
  },
});
