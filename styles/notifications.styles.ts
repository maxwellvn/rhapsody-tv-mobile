import { fs, hp, spacing, wp } from "@/utils/responsive";
import { StyleSheet } from "react-native";
import { FONTS } from "./global";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  tabsContainer: {
    flexDirection: "row",
    marginHorizontal: spacing.xl,
    marginVertical: hp(8),
    padding: wp(3),
    gap: spacing.xs,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  searchContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: hp(8),
  },
  searchInput: {
    height: hp(42),
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: wp(12),
    fontSize: fs(14),
    fontFamily: FONTS.regular,
    color: "#111827",
    backgroundColor: "#FFFFFF",
  },
  tab: {
    paddingHorizontal: wp(12),
    paddingVertical: hp(6),
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  tabText: {
    fontSize: fs(14),
    fontFamily: FONTS.medium,
    color: "#0A0A0A",
  },
  activeTabText: {
    color: "#000000",
    fontFamily: FONTS.medium,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: hp(8),
  },
  errorContainer: {
    marginHorizontal: spacing.xl,
    marginTop: hp(8),
    padding: spacing.md,
    backgroundColor: "#FEF2F2",
    borderRadius: 8,
  },
  errorText: {
    fontSize: fs(14),
    fontFamily: FONTS.medium,
    color: "#B91C1C",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: hp(24),
    paddingHorizontal: spacing.xl,
  },
  emptyText: {
    fontSize: fs(14),
    fontFamily: FONTS.medium,
    color: "#6B7280",
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: hp(16),
  },
});
