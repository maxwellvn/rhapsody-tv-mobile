import { ChannelCard } from '@/components/schedule/channel-card';
import { FONTS } from '@/styles/global';
import { fs, hp } from '@/utils/responsive';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export function ScheduleChannelsList() {
  const handleChannelPress = (channelName: string) => {
    console.log('Channel pressed:', channelName);
    // Navigation logic will go here
  };

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Channels List</Text>
      </View>

      {/* Channels Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        <ChannelCard
          logoSource={require('@/assets/logo/Logo.png')}
          channelName="Rhapsody TV"
          isLive={true}
          onPress={() => handleChannelPress('Rhapsody TV')}
        />
        <ChannelCard
          logoSource={require('@/assets/logo/logo-2.png')}
          channelName="RORK TV"
          isLive={true}
          onPress={() => handleChannelPress('RORK TV')}
        />
        <ChannelCard
          logoSource={require('@/assets/logo/logo-3.png')}
          channelName="LingualTV"
          isLive={true}
          onPress={() => handleChannelPress('LingualTV')}
        />
        <ChannelCard
          logoSource={require('@/assets/logo/logo-1.png')}
          channelName="Rebroadcast Channel"
          isLive={true}
          onPress={() => handleChannelPress('Rebroadcast Channel')}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: hp(10),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(12),
  },
  title: {
    fontSize: fs(22),
    fontFamily: FONTS.bold,
    color: '#000000',
  },
  scrollView: {
    marginLeft: 0,
  },
  scrollContent: {
    paddingRight: 0,
  },
});
