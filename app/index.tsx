import { hp, wp } from '@/utils/responsive';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';

// Keep the native splash screen visible while we load
SplashScreen.preventAutoHideAsync();

export default function CustomSplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Hide native splash screen immediately when this component mounts
    SplashScreen.hideAsync();

    // Show custom splash for 3 seconds
    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#ffffff" translucent={false} />
      
      <Image
        source={require('@/assets/logo/Logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: wp(261),
    height: hp(56),
    maxWidth: 261,
    maxHeight: 56,
  },
});