import { SettingsItemToggle } from '@/components/settings/settings-item-toggle';
import { SettingsSection } from '@/components/settings/settings-section';
import { FONTS } from '@/styles/global';
import { fs, hp, spacing, wp } from '@/utils/responsive';
import { router, Stack } from 'expo-router';
import { Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationsSettingsScreen() {
  const handleBack = () => {
    router.back();
  };

  const handleSubscriptionsChange = (value: boolean) => {
    console.log('Subscriptions changed to:', value);
  };

  const handleRecommendedVideosChange = (value: boolean) => {
    console.log('Recommended Videos changed to:', value);
  };

  const handleActivityCommentsChange = (value: boolean) => {
    console.log('Activity on my comments changed to:', value);
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
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <SettingsSection>
            <SettingsItemToggle
              label="Subscriptions"
              description="Get notified about new activity from your subscribed channels and programs."
              value={true}
              onValueChange={handleSubscriptionsChange}
            />
            <SettingsItemToggle
              label="Recommended Videos"
              description="Get notified about videos recommended for you based on your viewing history."
              value={false}
              onValueChange={handleRecommendedVideosChange}
            />
            <SettingsItemToggle
              label="Recommended Videos"
              description="Get notified about videos recommended for you based on your viewing history."
              value={true}
              onValueChange={handleRecommendedVideosChange}
            />
            <SettingsItemToggle
              label="Activity on my comments"
              description="Get notified about replies, likes, and other activity on your comments and posts in channels and programs."
              value={true}
              onValueChange={handleActivityCommentsChange}
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
