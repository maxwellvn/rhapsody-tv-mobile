import { useVideoOverlay } from "@/context/VideoOverlayContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect } from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const MINI_PLAYER_WIDTH = width * 0.4; // 40% of screen width
const MINI_PLAYER_HEIGHT = (MINI_PLAYER_WIDTH * 9) / 16; // 16:9 aspect ratio

export function GlobalMiniPlayer() {
  const { activeVideo, close, expand, isPlaying } = useVideoOverlay();
  const router = useRouter();

  const player = useVideoPlayer(activeVideo?.videoUri ?? null, (newPlayer) => {
    if (activeVideo) {
      newPlayer.loop = !!activeVideo.isLive;
      if (activeVideo.currentTime) {
        newPlayer.currentTime = activeVideo.currentTime;
      }
      newPlayer.play();
    }
  });

  useEffect(() => {
    if (isPlaying && activeVideo) {
      player.play();
    } else {
      player.pause();
    }
  }, [isPlaying, player, activeVideo]);

  if (!activeVideo) return null;

  const handlePress = () => {
    // Navigate back to the original route or the video screen
    // We append the current time to the params if needed, or rely on context

    // For now, we just navigate to the video screen.
    // Ideally, we should know if it was a live video or VOD.
    if (activeVideo.isLive && activeVideo.videoId) {
      router.push({
        pathname: "/live-video",
        params: { liveStreamId: activeVideo.videoId }, // Assuming videoId maps to liveStreamId for live videos
      });
    } else if (activeVideo.videoId) {
      router.push({
        pathname: "/video",
        params: { id: activeVideo.videoId },
      });
    }

    expand(); // Close the miniplayer in context (consumer logic handles restoration)
  };

  const handleClose = () => {
    player.pause();
    close();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handlePress}
        style={styles.contentContainer}
      >
        {/* Helper view to clip content */}
        <View style={styles.videoContainer}>
          <VideoView
            key={activeVideo?.videoUri ?? "miniplayer"}
            player={player}
            style={styles.video}
            contentFit="cover"
            nativeControls={false}
            allowsFullscreen={false}
            allowsPictureInPicture={false} // Native PiP handled by main player usually
          />
        </View>

        {/* Overlay with Close Button */}
        <View style={styles.controls}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={16} color="white" />
          </TouchableOpacity>
        </View>

        {/* Info Area (Optional) */}
        {/* <View style={styles.infoArea}>
            <Text style={styles.title} numberOfLines={1}>{activeVideo.title}</Text>
        </View> */}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 100 : 80, // Adjust for tab bar
    right: 16,
    width: MINI_PLAYER_WIDTH,
    height: MINI_PLAYER_HEIGHT,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 9999, // Ensure it's on top
    backgroundColor: "black",
  },
  contentContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  videoContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "black",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  controls: {
    position: "absolute",
    top: 4,
    right: 4,
    zIndex: 10,
  },
  closeButton: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  infoArea: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 4,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  title: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
  },
});
