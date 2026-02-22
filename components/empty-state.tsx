import { Ionicons } from "@expo/vector-icons";
import { FONTS } from "@/styles/global";
import { fs, hp } from "@/utils/responsive";
import { StyleSheet, Text, View } from "react-native";

type EmptyStateProps = {
  title: string;
  subtitle?: string;
  iconName?: string;
  compact?: boolean;
};

export function EmptyState({
  title,
  subtitle,
  iconName = "albums-outline",
  compact = false,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, compact && styles.containerCompact]}>
      <View style={styles.iconWrap}>
        <Ionicons name={iconName as any} size={20} color="#334155" />
      </View>
      <Text style={styles.title}>{title}</Text>
      {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: hp(16),
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: hp(16),
    paddingVertical: hp(18),
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(8),
  },
  containerCompact: {
    paddingVertical: hp(14),
    marginTop: hp(4),
  },
  iconWrap: {
    width: hp(36),
    height: hp(36),
    borderRadius: hp(18),
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp(8),
  },
  title: {
    fontSize: fs(14),
    color: "#0F172A",
    fontFamily: FONTS.semibold,
    textAlign: "center",
  },
  subtitle: {
    marginTop: hp(4),
    fontSize: fs(12),
    lineHeight: fs(16),
    color: "#475569",
    fontFamily: FONTS.regular,
    textAlign: "center",
  },
});
