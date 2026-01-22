import { Button } from '@/components/button';
import { styles } from '@/styles/onboarding.styles';
import { wp } from '@/utils/responsive';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const carouselData = [
  { id: '1', image: require('@/assets/images/carusel-2.png') },
  { id: '2', image: require('@/assets/images/carusel-3.png') },
  { id: '3', image: require('@/assets/images/carusel-1.png') },
];

const AUTO_SCROLL_INTERVAL = 3000; // 3 seconds

export default function OnboardingScreen() {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const currentIndexRef = useRef(0);

  // Calculate card width and spacing for perfect centering
  const cardWidth = screenWidth - wp(80);
  const cardSpacing = wp(20);
  const snapInterval = cardWidth + cardSpacing;
  const sidePadding = (screenWidth - cardWidth) / 2;

  // Auto scroll effect
  useEffect(() => {
    const timer = setInterval(() => {
      currentIndexRef.current = (currentIndexRef.current + 1) % carouselData.length;
      
      // Scroll to next image
      scrollViewRef.current?.scrollTo({
        x: currentIndexRef.current * snapInterval,
        animated: true,
      });
    }, AUTO_SCROLL_INTERVAL);

    return () => clearInterval(timer);
  }, [snapInterval]);

  const handleSkip = () => {
    router.push('/(auth)/register');
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / snapInterval);
        currentIndexRef.current = index;
      },
    }
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      
      {/* Skip Button */}
      <Button
        onPress={handleSkip}
        style={styles.skipButton}
        textStyle={styles.skipButtonText}
      >
        Skip
      </Button>

      {/* Headline */}
      <View style={styles.headlineContainer}>
        <Text style={styles.headlineText}>
          Watch, Connect{'\n'}& Grow with{'\n'}
          <Text style={styles.headlineAccent}>Rhapsody TV</Text>
        </Text>
      </View>

      {/* Carousel */}
      <View style={styles.carouselWrapper}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled={false}
          showsHorizontalScrollIndicator={false}
          snapToInterval={snapInterval}
          snapToAlignment="start"
          decelerationRate="fast"
          contentContainerStyle={[
            styles.carouselContent,
            {
              paddingLeft: sidePadding - cardSpacing / 2,
              paddingRight: sidePadding - cardSpacing / 2,
            },
          ]}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {carouselData.map((item, index) => {
            const inputRange = [
              (index - 1) * snapInterval,
              index * snapInterval,
              (index + 1) * snapInterval,
            ];

            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [0.85, 1, 0.85],
              extrapolate: 'clamp',
            });

            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.5, 1, 0.5],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={item.id}
                style={[
                  styles.carouselCard,
                  {
                    width: cardWidth,
                    marginHorizontal: cardSpacing / 2,
                    transform: [{ scale }],
                    opacity,
                  },
                ]}
              >
                <Image
                  source={item.image}
                  style={styles.carouselImage}
                  resizeMode="cover"
                />
              </Animated.View>
            );
          })}
        </ScrollView>
      </View>

      {/* Get Started Button */}
      <View style={styles.buttonContainer}>
        <Button
          onPress={handleSkip}
          style={styles.getStartedButton}
          textStyle={styles.getStartedButtonText}
        >
          Get Started
        </Button>
      </View>
    </SafeAreaView>
  );
}
