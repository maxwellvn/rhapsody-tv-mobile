import { StyleSheet } from 'react-native';
import { FONTS } from './global';
import { borderRadius, fs, hp, spacing, wp } from '@/utils/responsive';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: spacing.lg,
    marginBottom: hp(16),
  },
  containerLive: {
    borderColor: '#EF4444',
    borderWidth: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp(12),
  },
  timeSection: {
    gap: hp(4),
  },
  time: {
    fontSize: fs(20),
    fontFamily: FONTS.bold,
    color: '#000000',
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(4),
  },
  clockIcon: {
    width: wp(16),
    height: hp(16),
    tintColor: '#6B7280',
  },
  duration: {
    fontSize: fs(14),
    fontFamily: FONTS.regular,
    color: '#6B7280',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(8),
    marginBottom: hp(12),
  },
  categoryIcon: {
    width: wp(20),
    height: hp(20),
    tintColor: '#6B7280',
  },
  category: {
    fontSize: fs(14),
    fontFamily: FONTS.medium,
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: fs(18),
    fontFamily: FONTS.bold,
    color: '#000000',
    marginBottom: hp(8),
  },
  description: {
    fontSize: fs(14),
    fontFamily: FONTS.regular,
    color: '#6B7280',
    lineHeight: fs(20),
    marginBottom: hp(16),
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(16),
    flex: 1,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(6),
  },
  infoIcon: {
    width: wp(18),
    height: hp(18),
    tintColor: '#6B7280',
  },
  infoText: {
    fontSize: fs(14),
    fontFamily: FONTS.regular,
    color: '#6B7280',
  },
  watchingText: {
    fontSize: fs(14),
    fontFamily: FONTS.regular,
    color: '#6B7280',
  },
  watchButton: {
    backgroundColor: '#0000FF',
    paddingHorizontal: wp(20),
    paddingVertical: hp(10),
    borderRadius: borderRadius.md,
  },
  watchButtonText: {
    fontSize: fs(14),
    fontFamily: FONTS.semibold,
    color: '#FFFFFF',
  },
});
