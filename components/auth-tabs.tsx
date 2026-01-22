import { View, Pressable, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

type AuthTabsProps = {
  activeTab: 'register' | 'signin';
};

export function AuthTabs({ activeTab }: AuthTabsProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => router.push('/(auth)/register')}
        style={[
          styles.tab,
          styles.leftTab,
          activeTab === 'register' && styles.activeTab,
        ]}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === 'register' && styles.activeTabText,
          ]}
        >
          Register
        </Text>
      </Pressable>

      <Pressable
        onPress={() => router.push('/(auth)/signin')}
        style={[
          styles.tab,
          styles.rightTab,
          activeTab === 'signin' && styles.activeTab,
        ]}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === 'signin' && styles.activeTabText,
          ]}
        >
          Sign In
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    padding: 4,
    marginHorizontal: 40,
    borderWidth: 1,
    borderColor: '#D0D0D0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftTab: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  rightTab: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  activeTab: {
    backgroundColor: '#0000FF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
});
