import { AppSpinner } from "@/components/app-spinner";
import { usePlaybackKeepAwake } from "@/hooks/usePlaybackKeepAwake";
import { dimensions, hp, spacing, MAX_PHONE_WIDTH } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { AVPlaybackStatus, ResizeMode, Video } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect, useRef, useState } from "react";
import {
  BackHandler,
  Image,
  ImageSourcePropType,
  Modal,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type UploadedVideoPlayerProps = {
  videoUri?: string;
  thumbnailSource: ImageSourcePropType;
  onMinimize?: () => void;
  initialPositionSeconds?: number;
  onProgress?: (currentTime: number, duration: number) => void;
  onComplete?: () => void;
  paused?: boolean;
};

export function UploadedVideoPlayer({
  videoUri,
  thumbnailSource,
  onMinimize,
  initialPositionSeconds = 0,
  onProgress,
  onComplete,
  paused = false,
}: UploadedVideoPlayerProps) {
  const { width: rawWindowWidth, height: windowHeight } = useWindowDimensions();
  const windowWidth = Math.min(rawWindowWidth, MAX_PHONE_WIDTH);
  const playerHeight = Math.max(220, Math.min(windowWidth * (9 / 16), windowHeight * 0.45));
  const insets = useSafeAreaInsets();

  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [seekBarWidth, setSeekBarWidth] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [sliderTime, setSliderTime] = useState(0);
  const [stableCurrentTime, setStableCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasEnded, setHasEnded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [needsInitialSeek, setNeedsInitialSeek] = useState(initialPositionSeconds > 0);

  const scrubRafRef = useRef<number | null>(null);
  const pendingScrubTimeRef = useRef<number | null>(null);
  const completedRef = useRef(false);
  const didApplyInitialPositionRef = useRef(false);
  const loadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRef = useRef<Video>(null);

  usePlaybackKeepAwake(Boolean(videoUri) && isPlaying && !paused);

  useEffect(() => {
    setHasEnded(false);
    setStableCurrentTime(0);
    setSliderTime(0);
    setDuration(0);
    setIsPlaying(false);
    completedRef.current = false;
    didApplyInitialPositionRef.current = false;
    setNeedsInitialSeek(initialPositionSeconds > 0);
  }, [videoUri]);

  useEffect(() => {
    if (!paused) return;
    videoRef.current?.pauseAsync().catch(() => {
      // no-op
    });
  }, [paused]);

  useEffect(() => {
    return () => {
      if (scrubRafRef.current !== null) {
        cancelAnimationFrame(scrubRafRef.current);
      }
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
        loadTimeoutRef.current = null;
      }
    };
  }, []);

  const startLoadingGuard = () => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }
    loadTimeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      loadTimeoutRef.current = null;
    }, 12000);
  };

  const stopLoadingGuard = () => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
      loadTimeoutRef.current = null;
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (onProgress) {
      onProgress(stableCurrentTime, duration);
    }

    if (onComplete && duration > 0 && stableCurrentTime >= duration - 1) {
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete();
      }
    }
  }, [stableCurrentTime, duration, onProgress, onComplete]);

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      stopLoadingGuard();
      setIsPlaying(false);
      return;
    }

    const nextDuration = (status.durationMillis ?? 0) / 1000;
    const nextCurrent = status.positionMillis / 1000;

    setDuration(nextDuration);
    setIsPlaying(status.isPlaying);

    if (!isScrubbing) {
      setStableCurrentTime(Math.max(0, nextCurrent));
    }

    if (status.didJustFinish && !status.isLooping) {
      setHasEnded(true);
      setIsPlaying(false);
    }
  };

  const handleLoad = async () => {
    stopLoadingGuard();
    if (!videoRef.current) return;
    if (didApplyInitialPositionRef.current) return;

    if (initialPositionSeconds > 0) {
      try {
        await videoRef.current.setPositionAsync(Math.floor(initialPositionSeconds * 1000));
        setStableCurrentTime(initialPositionSeconds);
        setSliderTime(initialPositionSeconds);
      } catch {
        // Retry once after a brief delay — production HLS streams may need time
        try {
          await new Promise((r) => setTimeout(r, 300));
          await videoRef.current?.setPositionAsync(Math.floor(initialPositionSeconds * 1000));
          setStableCurrentTime(initialPositionSeconds);
          setSliderTime(initialPositionSeconds);
        } catch {
          // no-op
        }
      }
      // Now that position is set, allow playback to start
      setNeedsInitialSeek(false);
      if (!paused) {
        try {
          await videoRef.current.playAsync();
        } catch {
          // no-op
        }
      }
    }

    didApplyInitialPositionRef.current = true;
  };

  const handleToggleFullscreen = async () => {
    try {
      if (isFullscreen) {
        await ScreenOrientation.unlockAsync();
        setIsFullscreen(false);
      } else {
        setIsFullscreen(true);
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      }
    } catch {
      // no-op
    }
  };

  useEffect(() => {
    if (Platform.OS !== "android") return;

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (!isFullscreen) return false;

        ScreenOrientation.unlockAsync().catch(() => {
          // no-op
        });
        setIsFullscreen(false);
        return true;
      },
    );

    return () => subscription.remove();
  }, [isFullscreen]);

  const handleToggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const handleTogglePlay = async () => {
    if (!videoRef.current) return;

    try {
      if (hasEnded) {
        await videoRef.current.setPositionAsync(0);
        setStableCurrentTime(0);
        setSliderTime(0);
        setIsScrubbing(false);
        setHasEnded(false);
        completedRef.current = false;
      }

      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
    } catch {
      // no-op
    }
  };

  const handleSeekBy = async (seconds: number) => {
    if (!videoRef.current || duration <= 0) return;

    const nextTime = Math.max(0, Math.min(duration, stableCurrentTime + seconds));
    try {
      await videoRef.current.setPositionAsync(Math.floor(nextTime * 1000));
      setStableCurrentTime(nextTime);
      setSliderTime(nextTime);
      setHasEnded(false);
      completedRef.current = false;
    } catch {
      // no-op
    }
  };

  const displayedTime = isScrubbing ? sliderTime : stableCurrentTime;
  const displayedRatio = duration > 0 ? Math.max(0, Math.min(1, displayedTime / duration)) : 0;
  const seekThumbLeft = seekBarWidth > 0 ? Math.max(0, displayedRatio * seekBarWidth - 7) : 0;

  const formatTime = (timeInSeconds: number) => {
    const totalSeconds = Math.max(0, Math.floor(timeInSeconds));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!isScrubbing) {
      setSliderTime(stableCurrentTime);
    }
  }, [stableCurrentTime, isScrubbing]);

  const getTimeFromLocation = (locationX: number) => {
    if (duration <= 0 || seekBarWidth <= 0) return 0;
    const ratio = Math.max(0, Math.min(1, locationX / seekBarWidth));
    return ratio * duration;
  };

  const scheduleScrubTime = (nextTime: number) => {
    pendingScrubTimeRef.current = nextTime;
    if (scrubRafRef.current !== null) return;

    scrubRafRef.current = requestAnimationFrame(() => {
      if (pendingScrubTimeRef.current !== null) {
        setSliderTime(pendingScrubTimeRef.current);
      }
      pendingScrubTimeRef.current = null;
      scrubRafRef.current = null;
    });
  };

  const handleScrubStart = (locationX: number) => {
    if (duration <= 0 || seekBarWidth <= 0) return;
    setIsScrubbing(true);
    scheduleScrubTime(getTimeFromLocation(locationX));
  };

  const handleScrubMove = (locationX: number) => {
    if (!isScrubbing || duration <= 0 || seekBarWidth <= 0) return;
    scheduleScrubTime(getTimeFromLocation(locationX));
  };

  const handleScrubEnd = async (locationX?: number) => {
    if (duration <= 0) {
      setIsScrubbing(false);
      return;
    }

    const targetTime = typeof locationX === "number" ? getTimeFromLocation(locationX) : sliderTime;

    try {
      await videoRef.current?.setPositionAsync(Math.floor(targetTime * 1000));
      setStableCurrentTime(targetTime);
      setSliderTime(targetTime);
      setHasEnded(false);
      completedRef.current = false;
    } catch {
      // no-op
    }

    setIsScrubbing(false);
  };

  const playerContent = videoUri ? (
    <>
      <Video
        ref={videoRef}
        source={{ uri: videoUri }}
        style={styles.video}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay={!paused && !needsInitialSeek}
        isLooping={false}
        isMuted={isMuted}
        useNativeControls={false}
        onLoadStart={() => {
          setIsLoading(true);
          startLoadingGuard();
        }}
        onLoad={handleLoad}
        onReadyForDisplay={stopLoadingGuard}
        onError={stopLoadingGuard}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
      />

      {isLoading && (
        <View style={styles.loadingContainer}>
          <AppSpinner size="large" color="#FFFFFF" />
        </View>
      )}

      <View
        style={[
          styles.overlay,
          {
            paddingTop: spacing.sm + (isFullscreen ? insets.top : 0),
            paddingLeft: spacing.sm + (isFullscreen ? insets.left : 0),
            paddingRight: spacing.sm + (isFullscreen ? insets.right : 0),
            paddingBottom: spacing.sm + (isFullscreen ? insets.bottom : 0),
          },
        ]}
        pointerEvents="box-none"
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.65)", "transparent"]}
          style={styles.topGradient}
          pointerEvents="none"
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.65)"]}
          style={styles.bottomGradient}
          pointerEvents="none"
        />

        <View style={styles.topControls}>
          <View />
          <View style={styles.rightControls}>
            <Pressable onPress={handleToggleMute} style={styles.controlButton}>
              <Ionicons name={isMuted ? "volume-mute" : "volume-high"} size={18} color="white" />
            </Pressable>
            {onMinimize && (
              <Pressable onPress={onMinimize} style={styles.controlButton}>
                <Ionicons name="close-outline" size={20} color="white" />
              </Pressable>
            )}
            <Pressable onPress={handleToggleFullscreen} style={styles.controlButton}>
              <Ionicons
                name={isFullscreen ? "contract-outline" : "expand-outline"}
                size={18}
                color="white"
              />
            </Pressable>
          </View>
        </View>

        <View style={styles.centerControls}>
          <View style={styles.transportControls}>
            <Pressable onPress={() => handleSeekBy(-10)} style={styles.controlButton}>
              <Ionicons name="play-back" size={18} color="white" />
            </Pressable>
            <Pressable onPress={handleTogglePlay} style={styles.playButton}>
              <Ionicons name={hasEnded ? "refresh" : isPlaying ? "pause" : "play"} size={24} color="white" />
            </Pressable>
            <Pressable onPress={() => handleSeekBy(10)} style={styles.controlButton}>
              <Ionicons name="play-forward" size={18} color="white" />
            </Pressable>
          </View>
        </View>

        <View style={styles.bottomControls}>
          <View style={styles.seekRow}>
            <Text style={styles.timeText}>{formatTime(displayedTime)}</Text>
            <View
              style={styles.seekTouchArea}
              onLayout={(e) => setSeekBarWidth(e.nativeEvent.layout.width)}
              onStartShouldSetResponder={() => true}
              onMoveShouldSetResponder={() => true}
              onResponderGrant={(e) => handleScrubStart(e.nativeEvent.locationX)}
              onResponderMove={(e) => handleScrubMove(e.nativeEvent.locationX)}
              onResponderRelease={(e) => handleScrubEnd(e.nativeEvent.locationX)}
              onResponderTerminate={() => handleScrubEnd()}
            >
              <View style={styles.seekTrack}>
                <View style={[styles.seekFill, { width: `${displayedRatio * 100}%` }]} />
              </View>
              <View style={[styles.seekThumb, { left: seekThumbLeft }]} />
            </View>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
        </View>
      </View>
    </>
  ) : (
    <Image source={thumbnailSource} style={styles.thumbnail} resizeMode="contain" />
  );

  return (
    <>
      {!isFullscreen && (
        <View
          style={[
            styles.container,
            { height: playerHeight },
            Platform.OS === "android" && styles.containerAndroid,
          ]}
        >
          {playerContent}
        </View>
      )}
      <Modal
        visible={isFullscreen}
        animationType="fade"
        supportedOrientations={["landscape-left", "landscape-right", "portrait"]}
        statusBarTranslucent
        onRequestClose={handleToggleFullscreen}
      >
        <StatusBar hidden />
        <View style={styles.fullscreenContainer}>
          {playerContent}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    height: dimensions.isTablet ? hp(330) : hp(225),
    backgroundColor: "#000000",
    marginTop: 0,
  },
  containerAndroid: {
    borderRadius: 0,
    overflow: "visible",
    borderWidth: 0,
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: "#000000",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    marginTop: dimensions.isTablet ? spacing.lg : spacing.md,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 10,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "column",
    padding: spacing.sm,
  },
  centerControls: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  bottomGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 90,
  },
  topControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  rightControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  bottomControls: {
    width: "100%",
  },
  transportControls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  seekRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  seekTouchArea: {
    flex: 1,
    height: 28,
    justifyContent: "center",
  },
  seekTrack: {
    height: 4,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.3)",
    overflow: "hidden",
  },
  seekFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
  },
  seekThumb: {
    position: "absolute",
    top: 7,
    width: 14,
    height: 14,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
  },
  timeText: {
    color: "white",
    fontSize: 11,
    fontWeight: "600",
    minWidth: 36,
    textAlign: "center",
  },
  controlButton: {
    backgroundColor: "rgba(18,18,18,0.66)",
    borderRadius: 999,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  playButton: {
    backgroundColor: "rgba(18,18,18,0.66)",
    borderRadius: 999,
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
});
