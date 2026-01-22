import { SettingsItem } from '@/components/settings/settings-item';
import { SettingsSection } from '@/components/settings/settings-section';
import { SettingsTitle } from '@/components/settings/settings-title';
import { FONTS } from '@/styles/global';
import { fs, hp, spacing, wp } from '@/utils/responsive';
import { router, Stack } from 'expo-router';
import { Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const handleBack = () => {
    router.back();
  };

  const handleGeneral = () => {
    router.push('/general');
  };

  const handleNotifications = () => {
    router.push('/notifications-settings');
  };

  const handleManageHistory = () => {
    console.log('Manage all history pressed');
  };

  const handlePrivacy = () => {
    console.log('Privacy pressed');
  };

  const handleQuality = () => {
    router.push('/quality');
  };

  const handleDownloads = () => {
    router.push('/downloads');
  };

  const handleHelp = () => {
    console.log('Help pressed');
  };

  const handleAbout = () => {
    console.log('About pressed');
  };

  const handleSignOut = () => {
    console.log('Sign out pressed');
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
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* General Settings Section */}
          <SettingsSection>
            <SettingsItem
              icon={require('@/assets/Icons/settings.png')}
              label="General"
              onPress={handleGeneral}
            />
            <SettingsItem
              icon={require('@/assets/Icons/bells.png')}
              label="Notifications"
              onPress={handleNotifications}
            />
            <SettingsItem
              icon={require('@/assets/Icons/history.png')}
              label="Manage all history"
              onPress={handleManageHistory}
            />
            <SettingsItem
              icon={require('@/assets/Icons/lock.png')}
              label="Privacy"
              onPress={handlePrivacy}
            />
          </SettingsSection>

          {/* Video Quality and Audio Preferences */}
          <SettingsSection>
            <SettingsTitle title="Video Quality and Audio Preferences" />
            <SettingsItem
              icon={require('@/assets/Icons/watch.png')}
              label="Quality"
              onPress={handleQuality}
            />
            <SettingsItem
              icon={require('@/assets/Icons/download.png')}
              label="Downloads"
              onPress={handleDownloads}
            />
          </SettingsSection>

          {/* Help and Policies */}
          <SettingsSection>
            <SettingsTitle title="Help and  Policies" />
            <SettingsItem
              icon={require('@/assets/Icons/settings.png')}
              label="Help"
              onPress={handleHelp}
            />
            <SettingsItem
              icon={require('@/assets/Icons/info.png')}
              label="About"
              onPress={handleAbout}
            />
          </SettingsSection>

          {/* Sign Out */}
          <SettingsSection>
            <SettingsTitle title="Sign Out" />
            <SettingsItem
              icon={require('@/assets/Icons/logout.png')}
              label="Sign Out"
              onPress={handleSignOut}
              isDestructive
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
  bottomSpacer: {
    height: hp(20),
  },
});
