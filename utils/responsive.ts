import { Dimensions, PixelRatio, Platform } from 'react-native';

// Cap effective width to the largest standard phone width (iPhone 16 Pro Max).
// This prevents foldable inner screens from inflating the UI.
export const MAX_PHONE_WIDTH = 430;

// Base dimensions (design is based on iPhone 14 Pro: 393 x 852)
const BASE_WIDTH = 393;
const BASE_HEIGHT = 852;

// Mutable screen dimensions that update on fold/unfold/rotation
let _rawWidth = Dimensions.get('window').width;
let _height = Dimensions.get('window').height;
let _width = Math.min(_rawWidth, MAX_PHONE_WIDTH);

Dimensions.addEventListener('change', ({ window }) => {
  _rawWidth = window.width;
  _height = window.height;
  _width = Math.min(_rawWidth, MAX_PHONE_WIDTH);
});

/**
 * Calculates responsive width based on screen width
 * @param size - Size from design
 * @returns Responsive width
 */
export const wp = (size: number): number => {
  return (_width / BASE_WIDTH) * size;
};

/**
 * Calculates responsive height based on screen height
 * @param size - Size from design
 * @returns Responsive height
 */
export const hp = (size: number): number => {
  return (_height / BASE_HEIGHT) * size;
};

/**
 * Calculates responsive font size
 * @param size - Font size from design
 * @returns Responsive font size
 */
export const fs = (size: number): number => {
  const scale = _width / BASE_WIDTH;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

/**
 * Get screen dimensions (live values)
 */
export const dimensions = {
  get width() { return _width; },
  get rawWidth() { return _rawWidth; },
  get height() { return _height; },
  get isSmallDevice() { return _width < 375; },
  get isMediumDevice() { return _width >= 375 && _width < 414; },
  get isLargeDevice() { return _width >= 414; },
  get isTablet() { return _rawWidth >= 768; },
  get isFoldableInner() { return _rawWidth > MAX_PHONE_WIDTH; },
};

/**
 * Caps a dynamic width (e.g. from useWindowDimensions) to phone-like max.
 */
export const clampWidth = (width: number): number =>
  Math.min(width, MAX_PHONE_WIDTH);

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
  get xs() { return wp(6); },
  get sm() { return wp(10); },
  get md() { return wp(14); },
  get lg() { return wp(16); },
  get xl() { return wp(20); },
  get xxl() { return wp(24); },
  get xxxl() { return wp(28); },
};

/**
 * Responsive border radius
 */
export const borderRadius = {
  get xs() { return wp(4); },
  get sm() { return wp(8); },
  get md() { return wp(12); },
  get lg() { return wp(16); },
  get xl() { return wp(20); },
  full: 9999,
};
