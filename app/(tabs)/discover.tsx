import { BottomNav } from '@/components/bottom-nav';
import { ChannelsTab } from '@/components/discover/channels-tab';
import { ProgramsTab } from '@/components/discover/programs-tab';
import { SearchBar } from '@/components/search-bar';
import { styles } from '@/styles/discover.styles';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';

export default function DiscoverScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Channels' | 'Programs'>('Channels');

  const handleSearch = (text: string) => {
    console.log('Search:', text);
  };

  const handleTabPress = (tab: string) => {
    if (tab === 'Home') {
      router.push('/(tabs)');
    } else if (tab === 'Schedule') {
      router.push('/(tabs)/schedule');
    } else if (tab === 'Profile') {
      router.push('/(tabs)/profile');
    } else if (tab === 'Discover') {
      // Already on discover
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Image
            source={require('@/assets/Icons/Discover.png')}
            style={styles.icon}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>Discover</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchBar 
          placeholder="Search channels..."
          onSearch={handleSearch}
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <Pressable 
          style={[styles.tab, styles.firstTab, activeTab === 'Channels' && styles.activeTab]}
          onPress={() => setActiveTab('Channels')}
        >
          <Text style={[styles.tabText, activeTab === 'Channels' && styles.activeTabText]}>
            Channels
          </Text>
        </Pressable>
        <Pressable 
          style={[styles.tab, styles.lastTab, activeTab === 'Programs' && styles.activeTab]}
          onPress={() => setActiveTab('Programs')}
        >
          <Text style={[styles.tabText, activeTab === 'Programs' && styles.activeTabText]}>
            Programs
          </Text>
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'Channels' ? <ChannelsTab /> : <ProgramsTab />}
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav activeTab="Discover" onTabPress={handleTabPress} />
    </View>
  );
}
