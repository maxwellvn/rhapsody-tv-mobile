import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { FONTS } from '@/styles/global';
import { fs, hp, wp } from '@/utils/responsive';

export interface AlertButton {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void;
}

interface AppAlertProps {
  visible: boolean;
  title: string;
  message?: string;
  buttons: AlertButton[];
  onDismiss: () => void;
}

export const AppAlert = ({
  visible,
  title,
  message,
  buttons,
  onDismiss,
}: AppAlertProps) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 65,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  const handleButtonPress = (button: AlertButton) => {
    onDismiss();
    button.onPress?.();
  };

  const getButtonTextStyle = (button: AlertButton) => {
    if (button.style === 'destructive') return styles.buttonTextDestructive;
    if (button.style === 'cancel') return styles.buttonTextCancel;
    return styles.buttonTextDefault;
  };

  const isStacked = buttons.length > 2;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onDismiss}
    >
      <Pressable style={styles.overlay} onPress={onDismiss}>
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={styles.body}>
              <Text style={styles.title}>{title}</Text>
              {message ? <Text style={styles.message}>{message}</Text> : null}
            </View>

            <View
              style={isStacked ? styles.buttonColumn : styles.buttonRow}
            >
              {buttons.map((button, index) => (
                <Pressable
                  key={index}
                  style={[
                    isStacked ? styles.buttonStacked : styles.button,
                    isStacked
                      ? index > 0 && styles.buttonBorderTop
                      : index > 0 && styles.buttonBorderLeft,
                  ]}
                  onPress={() => handleButtonPress(button)}
                  android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
                >
                  <Text
                    style={[styles.buttonText, getButtonTextStyle(button)]}
                    numberOfLines={1}
                  >
                    {button.text}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(40),
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 10,
    overflow: 'hidden',
  },
  body: {
    paddingTop: hp(24),
    paddingBottom: hp(20),
    paddingHorizontal: wp(24),
    alignItems: 'center',
  },
  title: {
    fontSize: fs(17),
    fontFamily: FONTS.bold,
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: hp(4),
  },
  message: {
    fontSize: fs(13),
    fontFamily: FONTS.regular,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: fs(18),
    marginTop: hp(4),
  },
  buttonRow: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },
  buttonColumn: {
    flexDirection: 'column',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },
  button: {
    flex: 1,
    paddingVertical: hp(14),
    paddingHorizontal: wp(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStacked: {
    paddingVertical: hp(14),
    paddingHorizontal: wp(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonBorderLeft: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: '#E5E7EB',
  },
  buttonBorderTop: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },
  buttonText: {
    fontSize: fs(16),
  },
  buttonTextDefault: {
    fontFamily: FONTS.semibold,
    color: '#0000FF',
  },
  buttonTextCancel: {
    fontFamily: FONTS.regular,
    color: '#6B7280',
  },
  buttonTextDestructive: {
    fontFamily: FONTS.semibold,
    color: '#EF4444',
  },
});
