import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ToastMessage } from '@/context/ToastContext';
import { fs, hp, wp } from '@/utils/responsive';
import { FONTS } from '@/styles/global';

interface ToastProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export const Toast = ({ toasts, onRemove }: ToastProps) => {
  if (toasts.length === 0) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </View>
  );
};

interface ToastItemProps {
  toast: ToastMessage;
  onRemove: (id: string) => void;
}

const ToastItem = ({ toast, onRemove }: ToastItemProps) => {
  const slideAnim = useRef(new Animated.Value(-200)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        handleRemove();
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleRemove = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -200,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onRemove(toast.id);
    });
  };

  const getToastConfig = () => {
    switch (toast.type) {
      case 'success':
        return { color: '#0000FF', icon: 'checkmark-circle' as const };
      case 'error':
        return { color: '#EF4444', icon: 'close-circle' as const };
      case 'warning':
        return { color: '#F59E0B', icon: 'warning' as const };
      case 'info':
        return { color: '#0000FF', icon: 'information-circle' as const };
      default:
        return { color: '#0000FF', icon: 'information-circle' as const };
    }
  };

  const { color, icon } = getToastConfig();

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <View style={[styles.accentBorder, { backgroundColor: color }]} />
      <View style={styles.content}>
        <Ionicons name={icon} size={24} color={color} style={styles.icon} />
        <Text style={styles.message} numberOfLines={2}>
          {toast.message}
        </Text>
        <TouchableOpacity onPress={handleRemove} style={styles.closeButton} hitSlop={8}>
          <Ionicons name="close" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: hp(50),
    left: wp(20),
    right: wp(20),
    zIndex: 9999,
    alignItems: 'center',
  },
  toast: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: hp(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  accentBorder: {
    width: 4,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(14),
    paddingHorizontal: wp(16),
  },
  icon: {
    marginRight: wp(12),
  },
  message: {
    flex: 1,
    color: '#1F2937',
    fontSize: fs(14),
    fontFamily: FONTS.semibold,
  },
  closeButton: {
    marginLeft: wp(12),
    padding: wp(4),
  },
});
