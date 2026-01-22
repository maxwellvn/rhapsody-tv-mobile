import { fs, hp, spacing, wp } from '@/utils/responsive';
import { StyleSheet } from 'react-native';
import { FONTS } from './global';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0000FF',
  },
  skipButton: {
    position: 'absolute',
    top: hp(48),
    right: spacing.xl,
    paddingHorizontal: wp(24),
    paddingVertical: hp(10),
    backgroundColor: 'transparent',
    borderColor: '#FAFAFA',
    borderWidth: 1,
    borderRadius: 12,
    zIndex: 10,
  },
  skipButtonText: {
    color: '#FAFAFA',
    fontFamily: FONTS.medium,
    fontSize: fs(14),
  },
  headlineContainer: {
    paddingHorizontal: spacing.xl,
    paddingTop: hp(70),
    paddingBottom: hp(10),
  },
  headlineText: {
    color: '#FFFFFF',
    fontSize: fs(44),
    fontFamily: FONTS.bold,
    lineHeight: fs(52),
  },
  headlineAccent: {
    color: '#FFFFFF',
    fontSize: fs(44),
    fontFamily: FONTS.bold,
  },
  carouselWrapper: {
    marginTop: hp(30),
    marginBottom: hp(130),
  },
  carouselContent: {
    alignItems: 'center',
  },
  carouselCard: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselImage: {
    width: '100%',
    height: hp(340),
    borderRadius: 20,
  },
  buttonContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: hp(32),
  },
  getStartedButton: {
    paddingVertical: hp(16),
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    alignItems: 'center',
  },
  getStartedButtonText: {
    color: '#0000FF',
    fontFamily: FONTS.semibold,
    fontSize: fs(16),
  },
});
