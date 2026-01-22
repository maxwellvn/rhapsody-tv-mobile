import { borderRadius, dimensions, fs, hp, spacing, wp } from '@/utils/responsive';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

type SkeletonProps = {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
};

export function Skeleton({ width = '100%', height = 20, borderRadius = 8, style }: SkeletonProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: '#E5E7EB',
          opacity,
        },
        style,
      ]}
    />
  );
}

export function LiveNowSkeleton() {
  return (
    <View style={skeletonStyles.container}>
      <View style={skeletonStyles.header}>
        <Skeleton width={wp(100)} height={dimensions.isTablet ? fs(28) : fs(24)} borderRadius={borderRadius.xs} />
        <Skeleton width={wp(8)} height={wp(8)} borderRadius={wp(4)} />
      </View>
      <View style={skeletonStyles.card}>
        <Skeleton width="100%" height={dimensions.isTablet ? hp(250) : hp(200)} borderRadius={borderRadius.lg} />
        <View style={skeletonStyles.badgeContainer}>
          <Skeleton width={wp(60)} height={dimensions.isTablet ? fs(28) : fs(24)} borderRadius={borderRadius.sm} />
        </View>
        <View style={skeletonStyles.infoOverlay}>
          <Skeleton width="80%" height={dimensions.isTablet ? fs(24) : fs(20)} borderRadius={borderRadius.xs} style={{ marginBottom: spacing.sm }} />
          <Skeleton width="60%" height={dimensions.isTablet ? fs(20) : fs(16)} borderRadius={borderRadius.xs} style={{ marginBottom: spacing.sm }} />
          <Skeleton width="40%" height={dimensions.isTablet ? fs(18) : fs(14)} borderRadius={borderRadius.xs} />
        </View>
      </View>
    </View>
  );
}

export function ContinueWatchingSkeleton() {
  const isTablet = dimensions.isTablet;
  return (
    <View style={skeletonStyles.container}>
      <View style={skeletonStyles.header}>
        <Skeleton width={wp(150)} height={dimensions.isTablet ? fs(28) : fs(24)} borderRadius={borderRadius.xs} />
      </View>
      <View style={skeletonStyles.scrollContent}>
        {[...Array(3)].map((_, i) => (
          <View key={i} style={skeletonStyles.videoCard}>
            <Skeleton width={isTablet ? wp(200) : wp(160)} height={isTablet ? hp(120) : hp(90)} borderRadius={borderRadius.sm} />
            <Skeleton width={isTablet ? wp(180) : wp(140)} height={isTablet ? fs(20) : fs(16)} borderRadius={borderRadius.xs} style={{ marginTop: spacing.sm }} />
          </View>
        ))}
      </View>
    </View>
  );
}

export function ProgramsSkeleton() {
  const isTablet = dimensions.isTablet;
  return (
    <View style={skeletonStyles.container}>
      <View style={[skeletonStyles.header, { justifyContent: 'space-between' }]}>
        <Skeleton width={wp(100)} height={dimensions.isTablet ? fs(28) : fs(24)} borderRadius={borderRadius.xs} />
        <Skeleton width={wp(60)} height={dimensions.isTablet ? fs(18) : fs(14)} borderRadius={borderRadius.xs} />
      </View>
      <View style={skeletonStyles.scrollContent}>
        {[...Array(3)].map((_, i) => (
          <View key={i} style={skeletonStyles.videoCard}>
            <Skeleton width={isTablet ? wp(200) : wp(160)} height={isTablet ? hp(120) : hp(90)} borderRadius={borderRadius.sm} />
            <Skeleton width={isTablet ? wp(180) : wp(140)} height={isTablet ? fs(20) : fs(16)} borderRadius={borderRadius.xs} style={{ marginTop: spacing.sm }} />
          </View>
        ))}
      </View>
    </View>
  );
}

export function ProgramHighlightsSkeleton() {
  const isTablet = dimensions.isTablet;
  return (
    <View style={skeletonStyles.container}>
      <View style={[skeletonStyles.header, { justifyContent: 'space-between' }]}>
        <Skeleton width={wp(150)} height={dimensions.isTablet ? fs(28) : fs(24)} borderRadius={borderRadius.xs} />
        <Skeleton width={wp(60)} height={dimensions.isTablet ? fs(18) : fs(14)} borderRadius={borderRadius.xs} />
      </View>
      <View style={skeletonStyles.scrollContent}>
        {[...Array(3)].map((_, i) => (
          <View key={i} style={skeletonStyles.videoCard}>
            <Skeleton width={isTablet ? wp(200) : wp(160)} height={isTablet ? hp(120) : hp(90)} borderRadius={borderRadius.sm} />
            <Skeleton width={isTablet ? wp(180) : wp(140)} height={isTablet ? fs(20) : fs(16)} borderRadius={borderRadius.xs} style={{ marginTop: spacing.sm }} />
          </View>
        ))}
      </View>
    </View>
  );
}

export function FeaturedVideosSkeleton() {
  const isTablet = dimensions.isTablet;
  return (
    <View style={skeletonStyles.container}>
      <View style={[skeletonStyles.header, { justifyContent: 'space-between' }]}>
        <Skeleton width={wp(140)} height={dimensions.isTablet ? fs(28) : fs(24)} borderRadius={borderRadius.xs} />
        <Skeleton width={wp(60)} height={dimensions.isTablet ? fs(18) : fs(14)} borderRadius={borderRadius.xs} />
      </View>
      <View style={skeletonStyles.scrollContent}>
        {[...Array(3)].map((_, i) => (
          <View key={i} style={skeletonStyles.videoCard}>
            <Skeleton width={isTablet ? wp(200) : wp(160)} height={isTablet ? hp(120) : hp(90)} borderRadius={borderRadius.sm} />
            <Skeleton width={isTablet ? wp(180) : wp(140)} height={isTablet ? fs(20) : fs(16)} borderRadius={borderRadius.xs} style={{ marginTop: spacing.sm }} />
          </View>
        ))}
      </View>
    </View>
  );
}

const skeletonStyles = StyleSheet.create({
  container: {
    marginBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  card: {
    position: 'relative',
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  badgeContainer: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    zIndex: 2,
  },
  infoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: spacing.lg,
    zIndex: 1,
  },
  scrollContent: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  videoCard: {
    width: dimensions.isTablet ? wp(200) : wp(160),
    marginRight: spacing.md,
  },
});
