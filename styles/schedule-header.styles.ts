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
    marginBottom: hp(12),
  },

  /* ── Date navigation: [<] [label] [>] ── */
  dateNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(10),
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
  arrowButtonDisabled: {
    opacity: 0.35,
  },
  arrowIcon: {
    width: wp(16),
    height: hp(16),
    tintColor: '#000000',
  },
  arrowIconDisabled: {
    tintColor: '#9CA3AF',
  },
  leftArrow: {
    transform: [{ rotate: '90deg' }],
  },
  rightArrow: {
    transform: [{ rotate: '-90deg' }],
  },
  dateLabelButton: {
    flex: 1,
    height: hp(40),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(8),
  },
  dateLabelText: {
    fontSize: fs(16),
    fontFamily: FONTS.semibold,
    color: '#000000',
    textAlign: 'center',
  },

  /* ── Pick a date — full width, stable position ── */
  pickDateButton: {
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

  /* ── Date picker modal ── */
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
