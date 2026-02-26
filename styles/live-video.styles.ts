import { FONTS } from "@/styles/global";
import { dimensions, fs, hp, spacing, wp } from "@/utils/responsive";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
  detailsContainer: {
    padding: dimensions.isTablet ? spacing.lg : spacing.md,
    backgroundColor: "#FFFFFF",
  },
  videoTitle: {
    fontSize: dimensions.isTablet ? fs(24) : fs(20),
    fontWeight: "700",
    color: "#0F0F0F",
    marginBottom: dimensions.isTablet ? spacing.md : spacing.sm,
    fontFamily: FONTS.bold,
  },
  channelInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: dimensions.isTablet ? spacing.lg : spacing.md,
    gap: dimensions.isTablet ? spacing.sm : spacing.xs,
    minWidth: 0,
  },
  channelIcon: {
    width: dimensions.isTablet ? wp(40) : wp(32),
    height: dimensions.isTablet ? hp(40) : hp(32),
    borderRadius: dimensions.isTablet ? wp(20) : wp(16),
  },
  channelName: {
    fontSize: dimensions.isTablet ? fs(16) : fs(14),
    fontWeight: "500",
    color: "#000000",
    fontFamily: FONTS.medium,
    flexShrink: 1,
    minWidth: 0,
    marginRight: dimensions.isTablet ? spacing.sm : spacing.xs,
  },
  viewCountContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    flexShrink: 1,
    minWidth: 0,
    marginRight: 0,
  },
  viewCount: {
    fontSize: dimensions.isTablet ? fs(16) : fs(14),
    color: "#737373",
    fontFamily: FONTS.regular,
    flexShrink: 1,
    minWidth: 0,
  },
  startedTime: {
    fontSize: dimensions.isTablet ? fs(16) : fs(14),
    color: "#737373",
    fontFamily: FONTS.regular,
    flexShrink: 0,
    marginLeft: "auto",
    paddingLeft: dimensions.isTablet ? spacing.sm : spacing.xs,
  },
  actionButtonsContainer: {
    flexGrow: 0,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: dimensions.isTablet ? spacing.sm : spacing.xs,
    paddingRight: dimensions.isTablet ? spacing.lg : spacing.md,
  },
  subscribeButton: {
    backgroundColor: "#0000FF",
    paddingHorizontal: dimensions.isTablet ? spacing.md : spacing.sm,
    paddingVertical: dimensions.isTablet ? spacing.sm : spacing.xs,
    borderRadius: dimensions.isTablet ? 12 : 10,
    minWidth: dimensions.isTablet ? wp(100) : wp(85),
    alignItems: "center",
    justifyContent: "center",
  },
  subscribedButton: {
    backgroundColor: "#E5E5E5",
    borderWidth: 1,
    borderColor: "#CCCCCC",
  },
  subscribeButtonText: {
    fontSize: dimensions.isTablet ? fs(16) : fs(14),
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: FONTS.semibold,
  },
  subscribedButtonText: {
    color: "#000000",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: dimensions.isTablet ? spacing.xs : 6,
    paddingHorizontal: dimensions.isTablet ? spacing.md : spacing.sm,
    paddingVertical: dimensions.isTablet ? spacing.sm : spacing.xs,
    borderRadius: dimensions.isTablet ? 12 : 10,
    backgroundColor: "#F2F2F2",
  },
  actionButtonActive: {
    backgroundColor: "#FFE5E5",
  },
  actionButtonText: {
    fontSize: dimensions.isTablet ? fs(16) : fs(14),
    fontWeight: "500",
    color: "#0F0F0F",
    fontFamily: FONTS.medium,
  },
  actionButtonTextActive: {
    color: "#E50914",
  },
  recommendationsContainer: {
    padding: dimensions.isTablet ? spacing.lg : spacing.md,
  },
  loadingContainer: {
    width: "100%",
    height: dimensions.isTablet ? hp(350) : hp(245),
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: dimensions.isTablet ? fs(18) : fs(14),
    marginTop: dimensions.isTablet ? spacing.md : spacing.sm,
    fontFamily: FONTS.regular,
  },
  errorContainer: {
    width: "100%",
    height: dimensions.isTablet ? hp(350) : hp(245),
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    padding: dimensions.isTablet ? spacing.lg : spacing.md,
  },
  errorText: {
    color: "#FF0000",
    fontSize: dimensions.isTablet ? fs(18) : fs(14),
    textAlign: "center",
    fontFamily: FONTS.regular,
  },
});
