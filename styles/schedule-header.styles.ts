import { StyleSheet } from 'react-native';
import { FONTS } from './global';
import { borderRadius, fs, hp, spacing, wp } from '@/utils/responsive';

export const styles = StyleSheet.create({
  container: {
    marginTop: hp(24),
    marginBottom: hp(16),
  },
  title: {
    fontSize: fs(20),
    fontFamily: FONTS.bold,
    color: '#000000',
    marginBottom: hp(4),
  },
  dateText: {
    fontSize: fs(14),
    fontFamily: FONTS.regular,
    color: '#9CA3AF',
    marginBottom: hp(16),
  },
  navigationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(8),
  },
  arrowButton: {
    width: wp(40),
    height: hp(40),
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowIcon: {
    width: wp(16),
    height: hp(16),
    tintColor: '#000000',
  },
  leftArrow: {
    transform: [{ rotate: '90deg' }],
  },
  rightArrow: {
    transform: [{ rotate: '-90deg' }],
  },
  todayButton: {
    paddingHorizontal: wp(10),
    height: hp(40),
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.md,
    borderWidth: 0,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayText: {
    fontSize: fs(16),
    fontFamily: FONTS.semibold,
    color: '#000000',
  },
  pickDateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: hp(40),
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: spacing.md,
    gap: wp(8),
  },
  calendarIcon: {
    width: wp(20),
    height: hp(20),
    tintColor: '#9CA3AF',
  },
  pickDateText: {
    fontSize: fs(14),
    fontFamily: FONTS.regular,
    color: '#9CA3AF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    paddingBottom: hp(40),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: hp(16),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: fs(18),
    fontFamily: FONTS.semibold,
    color: '#000000',
  },
  modalButton: {
    fontSize: fs(16),
    fontFamily: FONTS.medium,
    color: '#6B7280',
  },
  modalButtonPrimary: {
    color: '#0000FF',
  },
  datePicker: {
    height: hp(200),
  },
});
