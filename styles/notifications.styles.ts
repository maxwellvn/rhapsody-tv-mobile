import { fs, hp, spacing, wp } from '@/utils/responsive';
import { StyleSheet } from 'react-native';
import { FONTS } from './global';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: spacing.xl,
    marginVertical: hp(8),
    padding: wp(3),
    gap: spacing.xs,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  tab: {
    paddingHorizontal: wp(12),
    paddingVertical: hp(6),
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
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
    color: '#0A0A0A',
  },
  activeTabText: {
    color: '#000000',
    fontFamily: FONTS.medium,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: hp(16),
  },
});
