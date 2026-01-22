import { FONTS } from '@/styles/global';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

type TabName = 'Home' | 'Discover' | 'Schedule' | 'Profile';

type BottomNavProps = {
  activeTab?: TabName;
  onTabPress?: (tab: TabName) => void;
};

export function BottomNav({ activeTab = 'Home', onTabPress }: BottomNavProps) {
  const handleTabPress = (tab: TabName) => {
    if (onTabPress) {
      onTabPress(tab);
    }
  };

  return (
    <View style={styles.container}>
      {/* Home Tab */}
      <Pressable 
        style={styles.tab} 
        onPress={() => handleTabPress('Home')}
      >
        <View style={[
          styles.iconContainer,
          activeTab === 'Home' ? styles.activeIconContainer : styles.inactiveIconContainer
        ]}>
          <Image
            source={require('@/assets/Icons/Home.png')}
            style={[
              styles.icon,
              { tintColor: activeTab === 'Home' ? '#FFFFFF' : '#6B7280' }
            ]}
            resizeMode="contain"
          />
        </View>
        <Text style={[
          styles.label,
          activeTab === 'Home' && styles.activeLabel
        ]}>
          Home
        </Text>
      </Pressable>

      {/* Discover Tab */}
      <Pressable 
        style={styles.tab} 
        onPress={() => handleTabPress('Discover')}
      >
        <View style={[
          styles.iconContainer,
          activeTab === 'Discover' ? styles.activeIconContainer : styles.inactiveIconContainer
        ]}>
          <Image
            source={require('@/assets/Icons/Discover.png')}
            style={[
              styles.icon,
              { tintColor: activeTab === 'Discover' ? '#FFFFFF' : '#6B7280' }
            ]}
            resizeMode="contain"
          />
        </View>
        <Text style={[
          styles.label,
          activeTab === 'Discover' && styles.activeLabel
        ]}>
          Discover
        </Text>
      </Pressable>

      {/* Schedule Tab */}
      <Pressable 
        style={styles.tab} 
        onPress={() => handleTabPress('Schedule')}
      >
        <View style={[
          styles.iconContainer,
          activeTab === 'Schedule' ? styles.activeIconContainer : styles.inactiveIconContainer
        ]}>
          <Image
            source={require('@/assets/Icons/Schedule.png')}
            style={[
              styles.icon,
              { tintColor: activeTab === 'Schedule' ? '#FFFFFF' : '#6B7280' }
            ]}
            resizeMode="contain"
          />
        </View>
        <Text style={[
          styles.label,
          activeTab === 'Schedule' && styles.activeLabel
        ]}>
          Schedule
        </Text>
      </Pressable>

      {/* Profile Tab */}
      <Pressable 
        style={styles.tab} 
        onPress={() => handleTabPress('Profile')}
      >
        <View style={[
          styles.iconContainer,
          activeTab === 'Profile' ? styles.activeIconContainer : styles.inactiveIconContainer
        ]}>
          <Image
            source={require('@/assets/Icons/Profile.png')}
            style={[
              styles.icon,
              { tintColor: activeTab === 'Profile' ? '#FFFFFF' : '#6B7280' }
            ]}
            resizeMode="contain"
          />
        </View>
        <Text style={[
          styles.label,
          activeTab === 'Profile' && styles.activeLabel
        ]}>
          Profile
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingVertical: 8,
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginBottom: 2,
  },
  activeIconContainer: {
    backgroundColor: '#0000FF',
  },
  inactiveIconContainer: {
    backgroundColor: '#F3F4F6',
  },
  icon: {
    width: 20,
    height: 20,
  },
  label: {
    fontSize: 10,
    fontFamily: FONTS.medium,
    color: '#6B7280',
  },
  activeLabel: {
    color: '#0000FF',
  },
});
