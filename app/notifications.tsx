import { NotificationItem } from '@/components/notifications/notification-item';
import { NotificationsHeader } from '@/components/notifications/notifications-header';
import { styles } from '@/styles/notifications.styles';
import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationsScreen() {
  const [activeTab, setActiveTab] = useState<'All' | 'Comments' | 'Reminders'>('All');

  const handleBack = () => {
    router.back();
  };

  const handleSearch = () => {
    console.log('Search pressed');
  };

  const handleMenu = () => {
    console.log('Menu pressed');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        
        {/* Header */}
        <NotificationsHeader
          title="Notifications"
          onBackPress={handleBack}
          onSearchPress={handleSearch}
          onMenuPress={handleMenu}
        />

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <Pressable
            style={[styles.tab, activeTab === 'All' && styles.activeTab]}
            onPress={() => setActiveTab('All')}
          >
            <Text style={[styles.tabText, activeTab === 'All' && styles.activeTabText]}>
              All
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tab, activeTab === 'Comments' && styles.activeTab]}
            onPress={() => setActiveTab('Comments')}
          >
            <Text style={[styles.tabText, activeTab === 'Comments' && styles.activeTabText]}>
              Comments
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tab, activeTab === 'Reminders' && styles.activeTab]}
            onPress={() => setActiveTab('Reminders')}
          >
            <Text style={[styles.tabText, activeTab === 'Reminders' && styles.activeTabText]}>
              Reminders
            </Text>
          </Pressable>
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Notification Items */}
          {activeTab === 'All' && (
            <View>
              <NotificationItem
                avatar={require('@/assets/images/Avatar.png')}
                title="You got a ❤️ from @flawlessgr..."
                subtitle='"Thanks a lot I really needed t...'
                timeAgo="3 days ago"
                thumbnail={require('@/assets/images/Image-11.png')}
                onPress={() => console.log('Notification pressed')}
                onMenuPress={() => console.log('Menu pressed')}
              />
              <NotificationItem
                avatar={require('@/assets/images/Avatar.png')}
                title="You got a ❤️ from @flawlessgr..."
                subtitle='"Thanks a lot I really needed t...'
                timeAgo="3 days ago"
                thumbnail={require('@/assets/images/Image-11.png')}
                onPress={() => console.log('Notification pressed')}
                onMenuPress={() => console.log('Menu pressed')}
              />
              <NotificationItem
                avatar={require('@/assets/images/Avatar.png')}
                title="Rhapsody Dailies"
                subtitle="Uploaded: CONSCIOUSNESS..."
                timeAgo="3 days ago"
                thumbnail={require('@/assets/images/Image-11.png')}
                onPress={() => console.log('Notification pressed')}
                onMenuPress={() => console.log('Menu pressed')}
              />
              <NotificationItem
                avatar={require('@/assets/images/Avatar.png')}
                title="Scheduled Program"
                subtitle="Your Loveworld has started. T..."
                timeAgo="3 days ago"
                thumbnail={require('@/assets/images/Image-11.png')}
                onPress={() => console.log('Notification pressed')}
                onMenuPress={() => console.log('Menu pressed')}
              />
              <NotificationItem
                avatar={require('@/assets/images/Avatar.png')}
                title="Rhapsody Dailies"
                subtitle="Uploaded: CONSCIOUSNESS..."
                timeAgo="3 days ago"
                thumbnail={require('@/assets/images/Image-11.png')}
                onPress={() => console.log('Notification pressed')}
                onMenuPress={() => console.log('Menu pressed')}
              />
            </View>
          )}
          {activeTab === 'Comments' && (
            <View>
              <NotificationItem
                avatar={require('@/assets/images/Avatar.png')}
                title="You got a ❤️ from @flawlessgr..."
                subtitle='"Thanks a lot I really needed t...'
                timeAgo="3 days ago"
                thumbnail={require('@/assets/images/Image-11.png')}
                onPress={() => console.log('Notification pressed')}
                onMenuPress={() => console.log('Menu pressed')}
              />
            </View>
          )}
          {activeTab === 'Reminders' && (
            <View>
              <NotificationItem
                avatar={require('@/assets/images/Avatar.png')}
                title="Scheduled Program"
                subtitle="Your Loveworld has started. T..."
                timeAgo="3 days ago"
                thumbnail={require('@/assets/images/Image-11.png')}
                onPress={() => console.log('Notification pressed')}
                onMenuPress={() => console.log('Menu pressed')}
              />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
