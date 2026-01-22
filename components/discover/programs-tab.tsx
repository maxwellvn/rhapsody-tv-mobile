import { FONTS } from '@/styles/global';
import { StyleSheet, Text, View } from 'react-native';
import { VideoCard } from './video-card';

export function ProgramsTab() {
  const handleVideoPress = (title: string) => {
    console.log('Video pressed:', title);
  };

  return (
    <>
      <Text style={styles.sectionTitle}>Programs</Text>
      <View style={styles.grid}>
        <View style={styles.videoCardWrapper}>
          <VideoCard
            imageSource={require('@/assets/images/Image-4.png')}
            title="Rhapsody Dailies"
            badgeLabel="Series"
            badgeColor="#2563EB"
            showBadge={true}
            onPress={() => handleVideoPress('Rhapsody Dailies')}
          />
        </View>
        <View style={styles.videoCardWrapper}>
          <VideoCard
            imageSource={require('@/assets/images/Image-1.png')}
            title="Rhapsody On The Daily Frontier"
            badgeLabel="New"
            badgeColor="#2563EB"
            showBadge={true}
            onPress={() => handleVideoPress('Rhapsody On The Daily Frontier')}
          />
        </View>
        <View style={styles.videoCardWrapper}>
          <VideoCard
            imageSource={require('@/assets/images/Image-5.png')}
            title="The Day God Spoke My Language"
            badgeLabel="New"
            badgeColor="#2563EB"
            showBadge={true}
            onPress={() => handleVideoPress('The Day God Spoke My Language')}
          />
        </View>
        <View style={styles.videoCardWrapper}>
          <VideoCard
            imageSource={require('@/assets/images/Image-10.png')}
            title="DISCARD DREAMS LIKE CHAFF 23RD OF JULY ..."
            badgeLabel="New"
            badgeColor="#2563EB"
            showBadge={true}
            onPress={() => handleVideoPress('DISCARD DREAMS LIKE CHAFF')}
          />
        </View>
        <View style={styles.videoCardWrapper}>
          <VideoCard
            imageSource={require('@/assets/images/Image-9.png')}
            title="JOURNEY TO ALL LANGUAGES"
            badgeLabel="New"
            badgeColor="#2563EB"
            showBadge={true}
            onPress={() => handleVideoPress('JOURNEY TO ALL LANGUAGES')}
          />
        </View>
        <View style={styles.videoCardWrapper}>
          <VideoCard
            imageSource={require('@/assets/images/Image-8.png')}
            title="This Morning with Rhapsody of Realities"
            badgeLabel="New"
            badgeColor="#2563EB"
            showBadge={true}
            onPress={() => handleVideoPress('This Morning with Rhapsody')}
          />
        </View>
        <View style={styles.videoCardWrapper}>
          <VideoCard
            imageSource={require('@/assets/images/Image-7.png')}
            title="RHAPATHON WITH PASTOR CHRIS HIGHLIGHTS"
            badgeLabel="New"
            badgeColor="#2563EB"
            showBadge={true}
            onPress={() => handleVideoPress('This Morning with Rhapsody')}
          />
        </View>
        <View style={styles.videoCardWrapper}>
          <VideoCard
            imageSource={require('@/assets/images/carusel-4.png')}
            title="DISCARD DREAMS LIKE CHAFF 23RD OF JULY 2025"
            badgeLabel="New"
            badgeColor="#2563EB"
            showBadge={true}
            onPress={() => handleVideoPress('This Morning with Rhapsody')}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: '#000000',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  videoCardWrapper: {
    width: '47.5%',
    marginBottom: 8,
  },
});
