import { HorizontalVideoCard } from '@/components/program-profile/horizontal-video-card';
import { VideoRecommendationCard } from '@/components/video-recommendation-card';
import { FONTS } from '@/styles/global';
import { fs, hp } from '@/utils/responsive';
import { StyleSheet, Text, View } from 'react-native';

export function HomeTab() {
  const handleVideoPress = (title: string) => {
    console.log('Video pressed:', title);
    // Navigation logic will go here
  };

  const handleMenuPress = (title: string) => {
    console.log('Menu pressed for:', title);
    // Menu logic will go here
  };

  return (
    <View style={styles.container}>
      {/* Featured Video */}
      <VideoRecommendationCard
        thumbnailSource={require('@/assets/images/Image-11.png')}
        title="SOUL DEVELOPMENT 5TH OF NOVEMBER 2025"
        channelAvatar={require('@/assets/images/Avatar.png')}
        channelName="RHAPSODY DAILIES"
        viewCount="500k views"
        timeAgo="3hrs ago"
        onPress={() => handleVideoPress('SOUL DEVELOPMENT 5TH OF NOVEMBER 2025')}
        onMenuPress={() => handleMenuPress('SOUL DEVELOPMENT 5TH OF NOVEMBER 2025')}
      />

      {/* Latest Videos Section */}
      <Text style={styles.sectionTitle}>Latest Videos</Text>

      <HorizontalVideoCard
        thumbnailSource={require('@/assets/images/Image-11.png')}
        duration="30:45"
        title="LIVE VICTORIOUSLY FROM INSIDE OUT 4TH OF NOVE..."
        channelName="Rhapsody Dailies"
        viewCount="64k views"
        timeAgo="1 day ago"
        onPress={() => handleVideoPress('LIVE VICTORIOUSLY FROM INSIDE OUT 4TH OF NOVE...')}
        onMenuPress={() => handleMenuPress('LIVE VICTORIOUSLY FROM INSIDE OUT 4TH OF NOVE...')}
      />

      <HorizontalVideoCard
        thumbnailSource={require('@/assets/images/Image-11.png')}
        duration="30:45"
        title="THE BEAUTY OF SERVING WITH THE SPIRIT 3RD OF..."
        channelName="Rhapsody Dailies"
        viewCount="64k views"
        timeAgo="1 day ago"
        onPress={() => handleVideoPress('THE BEAUTY OF SERVING WITH THE SPIRIT 3RD OF...')}
        onMenuPress={() => handleMenuPress('THE BEAUTY OF SERVING WITH THE SPIRIT 3RD OF...')}
      />

      <HorizontalVideoCard
        thumbnailSource={require('@/assets/images/Image-11.png')}
        duration="30:45"
        title="CONSCIOUSNESS OF THE SPIRITUAL 2ND OF NOVE..."
        channelName="Rhapsody Dailies"
        viewCount="64k views"
        timeAgo="1 day ago"
        onPress={() => handleVideoPress('CONSCIOUSNESS OF THE SPIRITUAL 2ND OF NOVE...')}
        onMenuPress={() => handleMenuPress('CONSCIOUSNESS OF THE SPIRITUAL 2ND OF NOVE...')}
      />

      <HorizontalVideoCard
        thumbnailSource={require('@/assets/images/Image-11.png')}
        duration="30:45"
        title="THE GRACE ADVANTAGE 1ST OF NOVEMBER 2025"
        channelName="Rhapsody Dailies"
        viewCount="64k views"
        timeAgo="1 day ago"
        onPress={() => handleVideoPress('THE GRACE ADVANTAGE 1ST OF NOVEMBER 2025')}
        onMenuPress={() => handleMenuPress('THE GRACE ADVANTAGE 1ST OF NOVEMBER 2025')}
      />

      <HorizontalVideoCard
        thumbnailSource={require('@/assets/images/Image-11.png')}
        duration="30:45"
        title="LIFTING YOUR HANDS TO THE LORD 31ST OF OCTO..."
        channelName="Rhapsody Dailies"
        viewCount="64k views"
        timeAgo="1 day ago"
        onPress={() => handleVideoPress('LIFTING YOUR HANDS TO THE LORD 31ST OF OCTO...')}
        onMenuPress={() => handleMenuPress('LIFTING YOUR HANDS TO THE LORD 31ST OF OCTO...')}
      />

      <HorizontalVideoCard
        thumbnailSource={require('@/assets/images/Image-11.png')}
        duration="30:45"
        title="HEIRS OF THE PROMISE 30TH OF OCTOBER 2025"
        channelName="Rhapsody Dailies"
        viewCount="64k views"
        timeAgo="1 day ago"
        onPress={() => handleVideoPress('HEIRS OF THE PROMISE 30TH OF OCTOBER 2025')}
        onMenuPress={() => handleMenuPress('HEIRS OF THE PROMISE 30TH OF OCTOBER 2025')}
      />

      <HorizontalVideoCard
        thumbnailSource={require('@/assets/images/Image-11.png')}
        duration="30:45"
        title="YOUR LIFE—A FOUNTAIN OF LIVING WATER 29TH O..."
        channelName="Rhapsody Dailies"
        viewCount="64k views"
        timeAgo="1 day ago"
        onPress={() => handleVideoPress('YOUR LIFE—A FOUNTAIN OF LIVING WATER 29TH O...')}
        onMenuPress={() => handleMenuPress('YOUR LIFE—A FOUNTAIN OF LIVING WATER 29TH O...')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: fs(20),
    fontFamily: FONTS.bold,
    color: '#000000',
    marginTop: hp(10),
    marginBottom: hp(16),
  },
});
