import { StyleSheet } from 'react-native';

// Global font configuration using Inter (similar to Geist)
export const FONTS = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semibold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
};

// Global text styles
export const globalTextStyles = StyleSheet.create({
  regular: {
    fontFamily: FONTS.regular,
  },
  medium: {
    fontFamily: FONTS.medium,
  },
  semibold: {
    fontFamily: FONTS.semibold,
  },
  bold: {
    fontFamily: FONTS.bold,
  },
});
