import { Text, View, StyleSheet } from 'react-native';
import { ChannelCard } from './channel-card';
import { FONTS } from '@/styles/global';

export function ChannelsTab() {
  const handleChannelPress = (channelName: string) => {
    console.log('Channel pressed:', channelName);
  };

  return (
    <>
      <Text style={styles.sectionTitle}>Channels</Text>
      <View style={styles.grid}>
        <View style={styles.channelCardWrapper}>
          <ChannelCard
            logoSource={require('@/assets/logo/Logo.png')}
            channelName="Rhapsody TV"
            isLive={true}
            onPress={() => handleChannelPress('Rhapsody TV')}
          />
        </View>
        <View style={styles.channelCardWrapper}>
          <ChannelCard
            logoSource={require('@/assets/logo/logo-2.png')}
            channelName="RORK TV"
            isLive={true}
            onPress={() => handleChannelPress('RORK TV')}
          />
        </View>
        <View style={styles.channelCardWrapper}>
          <ChannelCard
            logoSource={require('@/assets/logo/logo-3.png')}
            channelName="LingualTV"
            isLive={true}
            onPress={() => handleChannelPress('LingualTV')}
          />
        </View>
        <View style={styles.channelCardWrapper}>
          <ChannelCard
            logoSource={require('@/assets/logo/logo-1.png')}
            channelName="Rebroadcast Channel"
            isLive={true}
            onPress={() => handleChannelPress('Rebroadcast Channel')}
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
  channelCardWrapper: {
    width: '47%',
  },
});
