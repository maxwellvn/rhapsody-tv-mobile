import { dimensions, hp, spacing } from '@/utils/responsive';
import { useEvent } from 'expo';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, ImageSourcePropType, StyleSheet, View } from 'react-native';

type UploadedVideoPlayerProps = {
  videoUri?: string;
  thumbnailSource: ImageSourcePropType;
};

export function UploadedVideoPlayer({ videoUri, thumbnailSource }: UploadedVideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const videoViewRef = useRef<VideoView>(null);
  
  const player = useVideoPlayer(videoUri || null, (player) => {
    if (videoUri) {
      player.loop = false;
      player.play();
    }
  });

  // Listen to status changes
  const { status } = useEvent(player, 'statusChange', { status: player.status });

  useEffect(() => {
    if (status === 'readyToPlay') {
      setIsLoading(false);
    } else if (status === 'loading') {
      setIsLoading(true);
    } else if (status === 'error') {
      setIsLoading(false);
    }
  }, [status]);

  const handleFullscreenEnter = async () => {
    // Lock to landscape when entering fullscreen
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
  };

  const handleFullscreenExit = async () => {
    // Unlock orientation when exiting fullscreen
    await ScreenOrientation.unlockAsync();
  };

  return (
    <View style={styles.container}>
      {videoUri ? (
        <>
          <VideoView
            ref={videoViewRef}
            player={player}
            style={styles.video}
            contentFit="contain"
            nativeControls={true}
            fullscreenOptions={{
              enable: true,
              orientation: 'landscape',
            }}
            onFullscreenEnter={handleFullscreenEnter}
            onFullscreenExit={handleFullscreenExit}
          />

          {/* Loading Indicator */}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFFFFF" />
            </View>
          )}
        </>
      ) : (
        <Image
          source={thumbnailSource}
          style={styles.thumbnail}
          resizeMode="contain"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    height: dimensions.isTablet ? hp(330) : hp(225),
    backgroundColor: '#000000',
    marginTop: 0,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    marginTop: dimensions.isTablet ? spacing.lg : spacing.md,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 10,
  },
});
