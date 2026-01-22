import { SettingsItemArrow } from '@/components/settings/settings-item-arrow';
import { SettingsItemToggle } from '@/components/settings/settings-item-toggle';
import { SettingsSection } from '@/components/settings/settings-section';
import { FONTS } from '@/styles/global';
import { fs, hp, spacing, wp } from '@/utils/responsive';
import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DownloadsScreen() {
  const [downloadOverWifiOnly, setDownloadOverWifiOnly] = useState(false);
  const [downloadQuality, setDownloadQuality] = useState('Medium (360p)');

  const handleBack = () => {
    router.back();
  };

  const handleDownloadQuality = () => {
    router.push('/download-quality');
  };

  const handleDeleteDownloads = () => {
    console.log('Delete Downloads pressed');
    // Show confirmation dialog or navigate to delete downloads page
  };

  const handleWifiToggle = (value: boolean) => {
    setDownloadOverWifiOnly(value);
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
          <Text style={styles.headerTitle}>Downloads</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <SettingsSection>
            <SettingsItemArrow
              label="Download Quality"
              value={downloadQuality}
              onPress={handleDownloadQuality}
            />
          </SettingsSection>

          <SettingsSection>
            <SettingsItemToggle
              label="Download over Wi-fi only"
              value={downloadOverWifiOnly}
              onValueChange={handleWifiToggle}
            />
          </SettingsSection>

          <SettingsSection>
            <View style={styles.deleteItem}>
              <Pressable onPress={handleDeleteDownloads} style={styles.deleteButton}>
                <Text style={styles.deleteLabel}>Delete Downloads</Text>
              </Pressable>
            </View>
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
  deleteItem: {
    backgroundColor: '#FFFFFF',
  },
  deleteButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: hp(14),
    backgroundColor: '#F5F5F5',
  },
  deleteLabel: {
    fontSize: fs(16),
    fontFamily: FONTS.regular,
    color: '#000000',
  },
  bottomSpacer: {
    height: hp(20),
  },
});
