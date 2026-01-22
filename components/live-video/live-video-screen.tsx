import { VideoPlayer } from '@/components/video-player';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, View, StyleSheet } from 'react-native';

export function LiveVideoScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Video Player */}
        <VideoPlayer
          thumbnailSource={require('@/assets/images/carusel-2.png')}
          isLive={true}
        />

        {/* Video Details will go here */}
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
});
