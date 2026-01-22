import { StyleSheet } from 'react-native';
import { FONTS } from './global';
import { fs, hp, spacing } from '@/utils/responsive';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: hp(10),
    paddingBottom: hp(12),
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 4,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#000000',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerIcon: {
    width: 24,
    height: 24,
    tintColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },
  tab: {
    paddingVertical: hp(12),
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#0000FF',
  },
  tabText: {
    fontSize: fs(14),
    fontFamily: FONTS.medium,
    color: '#737373',
  },
  activeTabText: {
    color: '#000000',
    fontFamily: FONTS.semibold,
  },
  tabContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: hp(16),
  },
});
