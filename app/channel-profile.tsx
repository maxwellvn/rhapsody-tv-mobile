import { AboutTab } from '@/components/channel-profile/about-tab';
import { HomeTab } from '@/components/channel-profile/home-tab';
import { ChannelProfileHeader } from '@/components/channel-profile/profile-header';
import { ScheduleTab } from '@/components/channel-profile/schedule-tab';
import { VideosTab } from '@/components/channel-profile/videos-tab';
import { styles } from '@/styles/channel-profile.styles';
import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChannelProfileScreen() {
  const [activeTab, setActiveTab] = useState<'Home' | 'Videos' | 'Schedule' | 'About'>('Home');

  const handleBack = () => {
    router.back();
  };

  const handleSearch = () => {
    // Search logic
  };

  const handleMenu = () => {
    // Menu logic
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header with Back, Search, and Menu */}
      <View style={styles.header}>
        {/* Back Button */}
        <Pressable onPress={handleBack} style={styles.backButton} hitSlop={8}>
          <Image
            source={require('@/assets/Icons/back.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </Pressable>

        {/* Right Actions */}
        <View style={styles.headerRight}>
          <Pressable onPress={handleSearch} hitSlop={8}>
            <Image
              source={require('@/assets/Icons/search.png')}
              style={styles.headerIcon}
              resizeMode="contain"
            />
          </Pressable>

          <Pressable onPress={handleMenu} hitSlop={8}>
            <Image
              source={require('@/assets/Icons/ellipsis.png')}
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
        {/* Channel Profile Section */}
        <ChannelProfileHeader
          logoImage={require('@/assets/logo/Logo.png')}
          avatarImage={require('@/assets/logo/Logo.png')}
          channelName="Rhapsody TV"
          subscriberCount="1k subscribers"
          videoCount="50 videos"
          description="This Morning with Rhapsody of Realities is a daily live program broadcast on Mondays to Saturdays. Its sole purpose is to inspire,..."
          onSubscribe={() => console.log('Subscribe pressed')}
        />

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <Pressable 
            style={[styles.tab, activeTab === 'Home' && styles.activeTab]}
            onPress={() => setActiveTab('Home')}
          >
            <Text style={[styles.tabText, activeTab === 'Home' && styles.activeTabText]}>
              Home
            </Text>
          </Pressable>

          <Pressable 
            style={[styles.tab, activeTab === 'Videos' && styles.activeTab]}
            onPress={() => setActiveTab('Videos')}
          >
            <Text style={[styles.tabText, activeTab === 'Videos' && styles.activeTabText]}>
              Videos
            </Text>
          </Pressable>

          <Pressable 
            style={[styles.tab, activeTab === 'Schedule' && styles.activeTab]}
            onPress={() => setActiveTab('Schedule')}
          >
            <Text style={[styles.tabText, activeTab === 'Schedule' && styles.activeTabText]}>
              Schedule
            </Text>
          </Pressable>

          <Pressable 
            style={[styles.tab, activeTab === 'About' && styles.activeTab]}
            onPress={() => setActiveTab('About')}
          >
            <Text style={[styles.tabText, activeTab === 'About' && styles.activeTabText]}>
              About
            </Text>
          </Pressable>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'Home' && <HomeTab />}
          {activeTab === 'Videos' && <VideosTab />}
          {activeTab === 'Schedule' && <ScheduleTab />}
          {activeTab === 'About' && <AboutTab />}
        </View>
      </ScrollView>
      </SafeAreaView>
    </>
  );
}
