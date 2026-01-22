import { BottomNav } from '@/components/bottom-nav';
import { DownloadedVideosItem } from '@/components/profile/downloaded-videos-item';
import { ProfileInfo } from '@/components/profile/profile-info';
import { ProfileSection } from '@/components/profile/profile-section';
import { hp, spacing, wp } from '@/utils/responsive';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const router = useRouter();

  const handleNotificationPress = () => {
    router.push('/notifications');
  };

  const handleSettingsPress = () => {
    router.push('/settings');
  };

  const handleEditProfile = () => {
    console.log('Edit profile pressed');
    // Edit profile navigation will go here
  };

  const handleDownloadedVideos = () => {
    console.log('Downloaded videos pressed');
    // Downloaded videos navigation will go here
  };

  const handleTabPress = (tab: string) => {
    if (tab === 'Home') {
      router.push('/(tabs)');
    } else if (tab === 'Discover') {
      router.push('/(tabs)/discover');
    } else if (tab === 'Schedule') {
      router.push('/(tabs)/schedule');
    } else if (tab === 'Profile') {
      // Already on profile
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        
        <View style={styles.headerRight}>
          <Pressable onPress={handleNotificationPress} hitSlop={8}>
            <Image
              source={require('@/assets/Icons/bells.png')}
              style={styles.headerIcon}
              resizeMode="contain"
            />
          </Pressable>

          <Pressable onPress={handleSettingsPress} hitSlop={8}>
            <Image
              source={require('@/assets/Icons/settings.png')}
              style={styles.headerIcon}
              resizeMode="contain"
            />
          </Pressable>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <ProfileInfo
          avatarSource={require('@/assets/images/Avatar.png')}
          name="Lennox Koko"
          onEditPress={handleEditProfile}
        />

        {/* History Section */}
        <ProfileSection
          title="History"
          onSeeAllPress={() => console.log('View all history')}
          items={[
            {
              imageSource: require('@/assets/images/Image-4.png'),
              title: 'Rhapsody Dailies',
              badgeLabel: 'Series',
              badgeColor: '#2563EB',
              showBadge: true,
              onPress: () => router.push('/program-profile'),
            },
            {
              imageSource: require('@/assets/images/Image-1.png'),
              title: 'Rhapsody On The Daily Frontier',
              badgeLabel: 'New',
              badgeColor: '#2563EB',
              showBadge: true,
              onPress: () => router.push('/program-profile'),
            },
            {
              imageSource: require('@/assets/images/Image-5.png'),
              title: 'The Day God Spoke My Language',
              badgeLabel: 'Live',
              badgeColor: '#DC2626',
              showBadge: true,
              onPress: () => router.push('/program-profile'),
            },
          ]}
        />

        {/* Watchlist Section */}
        <ProfileSection
          title="Watchlist"
          onSeeAllPress={() => console.log('View all watchlist')}
          items={[
            {
              imageSource: require('@/assets/images/Image-4.png'),
              title: 'Rhapsody Dailies',
              badgeLabel: 'Series',
              badgeColor: '#2563EB',
              showBadge: true,
              onPress: () => router.push('/program-profile'),
            },
            {
              imageSource: require('@/assets/images/Image-1.png'),
              title: 'Rhapsody On The Daily Frontier',
              badgeLabel: 'New',
              badgeColor: '#2563EB',
              showBadge: true,
              onPress: () => router.push('/program-profile'),
            },
            {
              imageSource: require('@/assets/images/Image-5.png'),
              title: 'The Day God Spoke My Language',
              badgeLabel: 'Live',
              badgeColor: '#DC2626',
              showBadge: true,
              onPress: () => router.push('/program-profile'),
            },
          ]}
        />

        {/* Downloaded Videos */}
        <DownloadedVideosItem onPress={handleDownloadedVideos} />
      </ScrollView>

      <BottomNav activeTab="Profile" onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: hp(12),
  },
  headerSpacer: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  headerIcon: {
    width: wp(20),
    height: hp(20),
    tintColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
});
