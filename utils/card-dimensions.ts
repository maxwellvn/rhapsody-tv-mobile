import { MAX_PHONE_WIDTH } from './responsive';

export const VIDEO_MEDIA_ASPECT_RATIO = 16 / 9;

type CardDimensions = {
  compactVideoCardWidth: number;
  compactVideoCardGap: number;
  channelCardWidth: number;
  horizontalVideoThumbWidth: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

export const getCardDimensions = (windowWidth: number): CardDimensions => {
  windowWidth = Math.min(windowWidth, MAX_PHONE_WIDTH);
  const compactVideoCardWidth = clamp(Math.round(windowWidth * 0.34), 120, 180);
  const compactVideoCardGap = clamp(Math.round(windowWidth * 0.025), 8, 12);
  const channelCardWidth = clamp(Math.round(windowWidth * 0.28), 96, 140);
  const horizontalVideoThumbWidth = clamp(
    Math.round(windowWidth * 0.4),
    148,
    220,
  );

  return {
    compactVideoCardWidth,
    compactVideoCardGap,
    channelCardWidth,
    horizontalVideoThumbWidth,
  };
};
