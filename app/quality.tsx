import { SettingsGroupTitle } from '@/components/settings/settings-group-title';
import { SettingsItemRadio } from '@/components/settings/settings-item-radio';
import { SettingsSection } from '@/components/settings/settings-section';
import { FONTS } from '@/styles/global';
import { fs, hp, spacing, wp } from '@/utils/responsive';
import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type QualityOption = 'auto' | 'higher' | 'data-saver';
type AudioOption = 'auto' | 'higher' | 'normal';

export default function QualityScreen() {
  const [mobileQuality, setMobileQuality] = useState<QualityOption>('auto');
  const [wifiQuality, setWifiQuality] = useState<QualityOption>('auto');
  const [audioQuality, setAudioQuality] = useState<AudioOption>('auto');

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={handleBack} style={styles.backButton} hitSlop={8}>
            <Image
              source={require('@/assets/Icons/back.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </Pressable>
          <Text style={styles.headerTitle}>Quality</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>
              Set your preferred streaming quality as your default setting for all videos. You can change streaming quality in player settings for each video
            </Text>
          </View>

          {/* Video Quality on mobile network */}
          <SettingsSection>
            <SettingsGroupTitle title="Video Quality on mobile network" />
            <SettingsItemRadio
              label="Auto (recommended)"
              description="Adjust to give you the best experience for your condition"
              selected={mobileQuality === 'auto'}
              onPress={() => setMobileQuality('auto')}
            />
            <SettingsItemRadio
              label="Higher picture quality"
              description="Uses most data."
              selected={mobileQuality === 'higher'}
              onPress={() => setMobileQuality('higher')}
            />
            <SettingsItemRadio
              label="Data Saver"
              description="Lower picture quality"
              selected={mobileQuality === 'data-saver'}
              onPress={() => setMobileQuality('data-saver')}
            />
          </SettingsSection>

          {/* Video Quality on Wi-fi */}
          <SettingsSection>
            <SettingsGroupTitle title="Video Quality on Wi-fi" />
            <SettingsItemRadio
              label="Auto (recommended)"
              description="Adjust to give you the best experience for your condition"
              selected={wifiQuality === 'auto'}
              onPress={() => setWifiQuality('auto')}
            />
            <SettingsItemRadio
              label="Higher picture quality"
              description="Uses most data."
              selected={wifiQuality === 'higher'}
              onPress={() => setWifiQuality('higher')}
            />
            <SettingsItemRadio
              label="Data Saver"
              description="Lower picture quality"
              selected={wifiQuality === 'data-saver'}
              onPress={() => setWifiQuality('data-saver')}
            />
          </SettingsSection>

          {/* Audio Quality */}
          <SettingsSection>
            <SettingsGroupTitle title="Audio Quality" />
            <SettingsItemRadio
              label="Auto (recommended)"
              description="Adjust to give you the best listening experience based on your connection."
              selected={audioQuality === 'auto'}
              onPress={() => setAudioQuality('auto')}
            />
            <SettingsItemRadio
              label="Higher audio quality"
              description="Adjust for some videos with YouTube Premium. Uses more data."
              selected={audioQuality === 'higher'}
              onPress={() => setAudioQuality('higher')}
            />
            <SettingsItemRadio
              label="Normal"
              description="Uses less data."
              selected={audioQuality === 'normal'}
              onPress={() => setAudioQuality('normal')}
            />
          </SettingsSection>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: hp(10),
    paddingBottom: hp(12),
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: wp(4),
  },
  backIcon: {
    width: wp(24),
    height: hp(24),
    tintColor: '#000000',
  },
  headerTitle: {
    flex: 1,
    fontSize: fs(20),
    fontFamily: FONTS.bold,
    color: '#000000',
    marginLeft: spacing.md,
  },
  headerSpacer: {
    width: wp(32),
  },
  scrollView: {
    flex: 1,
  },
  descriptionContainer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: hp(16),
    backgroundColor: '#F5F5F5',
  },
  description: {
    fontSize: fs(14),
    fontFamily: FONTS.regular,
    color: '#999999',
    lineHeight: fs(20),
  },
  bottomSpacer: {
    height: hp(20),
  },
});
