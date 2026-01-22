import { BottomNav } from '@/components/bottom-nav';
import { ChannelsListSection } from '@/components/home/channels-list-section';
import { ContinueWatchingSection } from '@/components/home/continue-watching-section';
import { FeaturedVideosSection } from '@/components/home/featured-videos-section';
import { LiveNowSection } from '@/components/home/live-now-section';
import { ProgramHighlightsSection } from '@/components/home/program-highlights-section';
import { ProgramsSection } from '@/components/home/programs-section';
import { SearchBar } from '@/components/search-bar';
import { styles } from '@/styles/home.styles';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image, Pressable, ScrollView, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  const handleNotificationPress = () => {
    router.push('/notifications');
  };

  const handleSearch = (text: string) => {
    console.log('Search:', text);
  };

  const handleTabPress = (tab: string) => {
    if (tab === 'Discover') {
      router.push('/(tabs)/discover');
    } else if (tab === 'Schedule') {
      router.push('/(tabs)/schedule');
    } else if (tab === 'Profile') {
      router.push('/(tabs)/profile');
    } else if (tab === 'Home') {
      // Already on home
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('@/assets/logo/Logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Pressable onPress={handleNotificationPress} style={styles.notificationButton}>
          <Image
            source={require('@/assets/Icons/Bell.png')}
            style={styles.notificationIcon}
            resizeMode="contain"
          />
        </Pressable>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchBar 
          placeholder="Search channels and programs..."
          onSearch={handleSearch}
        />
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <LiveNowSection />
        <ContinueWatchingSection />
        <ChannelsListSection />
        <ProgramsSection />
        <FeaturedVideosSection />
        <ProgramHighlightsSection />
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav activeTab="Home" onTabPress={handleTabPress} />
    </View>
  );
}
