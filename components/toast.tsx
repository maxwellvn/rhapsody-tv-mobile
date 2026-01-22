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
    // Slide in from top
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

    // Auto remove if duration is set
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

  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return { backgroundColor: '#10B981', icon: 'checkmark-circle' as const };
      case 'error':
        return { backgroundColor: '#EF4444', icon: 'close-circle' as const };
      case 'warning':
        return { backgroundColor: '#F59E0B', icon: 'warning' as const };
      case 'info':
        return { backgroundColor: '#3B82F6', icon: 'information-circle' as const };
      default:
        return { backgroundColor: '#3B82F6', icon: 'information-circle' as const };
    }
  };

  const { backgroundColor, icon } = getToastStyles();

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor,
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <View style={styles.content}>
        <Ionicons name={icon} size={24} color="#FFFFFF" style={styles.icon} />
        <Text style={styles.message} numberOfLines={2}>
          {toast.message}
        </Text>
        <TouchableOpacity onPress={handleRemove} style={styles.closeButton} hitSlop={8}>
          <Ionicons name="close" size={20} color="#FFFFFF" />
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
    borderRadius: 12,
    paddingVertical: hp(14),
    paddingHorizontal: wp(16),
    marginBottom: hp(12),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: wp(12),
  },
  message: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: fs(14),
    fontFamily: FONTS.medium,
  },
  closeButton: {
    marginLeft: wp(12),
    padding: wp(4),
  },
});
