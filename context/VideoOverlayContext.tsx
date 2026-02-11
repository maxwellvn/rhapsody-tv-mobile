import { createContext, ReactNode, useContext, useState } from 'react';

type VideoData = {
  videoUri: string;
  title?: string;
  channelName?: string;
  channelAvatar?: string;
  currentTime?: number;
  isLive?: boolean;
  originalRoute?: string;
  // Additional metadata for restoring the full player
  videoId?: string;
  channelId?: string;
};

type VideoOverlayContextType = {
  activeVideo: VideoData | null;
  minimize: (videoData: VideoData) => void;
  close: () => void;
  expand: () => void; // Used to restore full screen or navigate back
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
};

const VideoOverlayContext = createContext<VideoOverlayContextType | undefined>(undefined);

export function VideoOverlayProvider({ children }: { children: ReactNode }) {
  const [activeVideo, setActiveVideo] = useState<VideoData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const minimize = (videoData: VideoData) => {
    setActiveVideo(videoData);
    setIsPlaying(true);
  };

  const close = () => {
    setActiveVideo(null);
    setIsPlaying(false);
  };

  const expand = () => {
    // Logic to be handled by the consumer to navigate back
    // Usually invalidates this active video or passes it back to the route
    setActiveVideo(null);
  };

  return (
    <VideoOverlayContext.Provider
      value={{
        activeVideo,
        minimize,
        close,
        expand,
        isPlaying,
        setIsPlaying,
      }}
    >
      {children}
    </VideoOverlayContext.Provider>
  );
}

export function useVideoOverlay() {
  const context = useContext(VideoOverlayContext);
  if (context === undefined) {
    throw new Error('useVideoOverlay must be used within a VideoOverlayProvider');
  }
  return context;
}
