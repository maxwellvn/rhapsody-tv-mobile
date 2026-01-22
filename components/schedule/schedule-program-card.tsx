import { Button } from '@/components/button';
import { styles } from '@/styles/schedule-program-card.styles';
import { Image, Pressable, Text, View } from 'react-native';
import { ScheduleBadge } from './schedule-badge';

type ScheduleProgramCardProps = {
  time: string;
  duration: string;
  category: string;
  title: string;
  description: string;
  hostCount: number;
  watchingCount: string;
  isLive?: boolean;
  onPress?: () => void;
  onWatchNowPress?: () => void;
};

export function ScheduleProgramCard({
  time,
  duration,
  category,
  title,
  description,
  hostCount,
  watchingCount,
  isLive = false,
  onPress,
  onWatchNowPress,
}: ScheduleProgramCardProps) {
  return (
    <Pressable 
      style={[styles.container, isLive && styles.containerLive]} 
      onPress={onPress}
    >
      {/* Top Row: Time and Live Badge */}
      <View style={styles.topRow}>
        <View style={styles.timeSection}>
          <Text style={styles.time}>{time}</Text>
          <View style={styles.durationRow}>
            <Image
              source={require('@/assets/Icons/clock.png')}
              style={styles.clockIcon}
              resizeMode="contain"
            />
            <Text style={styles.duration}>{duration}</Text>
          </View>
        </View>
        
        {isLive && <ScheduleBadge label="Live" isLive={isLive} />}
      </View>

      {/* Category */}
      <View style={styles.categoryRow}>
        <Image
          source={require('@/assets/Icons/globe.png')}
          style={styles.categoryIcon}
          resizeMode="contain"
        />
        <Text style={styles.category}>{category}</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Description */}
      <Text style={styles.description}>{description}</Text>

      {/* Bottom Row: Host, Watching, Watch Now Button */}
      <View style={styles.bottomRow}>
        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Image
              source={require('@/assets/Icons/persons.png')}
              style={styles.infoIcon}
              resizeMode="contain"
            />
            <Text style={styles.infoText}>Host: {hostCount}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.watchingText}>{watchingCount} watching</Text>
          </View>
        </View>

        <Button 
          style={styles.watchButton}
          textStyle={styles.watchButtonText}
          onPress={onWatchNowPress}
        >
          Watch Now
        </Button>
      </View>
    </Pressable>
  );
}
