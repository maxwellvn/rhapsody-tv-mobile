import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (design is based on iPhone 14 Pro: 393 x 852)
const BASE_WIDTH = 393;
const BASE_HEIGHT = 852;

/**
 * Calculates responsive width based on screen width
 * @param size - Size from design
 * @returns Responsive width
 */
export const wp = (size: number): number => {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
};

/**
 * Calculates responsive height based on screen height
 * @param size - Size from design
 * @returns Responsive height
 */
export const hp = (size: number): number => {
  return (SCREEN_HEIGHT / BASE_HEIGHT) * size;
};

/**
 * Calculates responsive font size
 * @param size - Font size from design
 * @returns Responsive font size
 */
export const fs = (size: number): number => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

/**
 * Get screen dimensions
 */
export const dimensions = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmallDevice: SCREEN_WIDTH < 375,
  isMediumDevice: SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414,
  isLargeDevice: SCREEN_WIDTH >= 414,
  isTablet: SCREEN_WIDTH >= 768,
};

/**
 * Platform specific values
 */
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isWeb = Platform.OS === 'web';

/**
 * Get platform specific value
 */
export const platformValue = <T,>(ios: T, android: T, web?: T): T => {
  if (isWeb && web !== undefined) return web;
  return Platform.select({ ios, android, default: android }) as T;
};

/**
 * Responsive spacing
 */
export const spacing = {
  xs: wp(6),
  sm: wp(10),
  md: wp(14),
  lg: wp(16),
  xl: wp(20),
  xxl: wp(24),
  xxxl: wp(28),
};

/**
 * Responsive border radius
 */
export const borderRadius = {
  xs: wp(4),
  sm: wp(8),
  md: wp(12),
  lg: wp(16),
  xl: wp(20),
  full: 9999,
};
