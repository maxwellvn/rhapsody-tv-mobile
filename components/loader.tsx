import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Modal, StyleSheet, View } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const Loader = () => {
  // Use a single master animation that controls the entire cycle
  // This ensures all divs stay perfectly synchronized
  const masterAnim = useRef(new Animated.Value(0)).current;
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    // Create a master animation that goes from 0 to 1 over 2.5 seconds
    // This represents one complete cycle where all 10 divs pulse sequentially
    // Increased duration for slower, more visible animation
    const sequence = Animated.sequence([
      Animated.timing(masterAnim, {
        toValue: 1,
        duration: 2500, // 2.5 seconds for complete cycle (slower)
        useNativeDriver: false, // We need this for interpolation
      }),
      Animated.timing(masterAnim, {
        toValue: 0,
        duration: 0, // Instant reset
        useNativeDriver: false,
      }),
    ]);

    // Loop infinitely
    const loop = Animated.loop(sequence);
    loopRef.current = loop;
    loop.start();

    return () => {
      if (loopRef.current) {
        loopRef.current.stop();
      }
      masterAnim.stopAnimation();
      masterAnim.setValue(0);
    };
  }, [masterAnim]);

  // Spinner configuration: rotation angles for each div (36deg increments)
  const rotations = [36, 72, 108, 144, 180, 216, 252, 288, 324, 360];

  return (
    <Modal
      transparent
      visible={true}
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.wrapper}>
          <View style={styles.spinner}>
            {rotations.map((rotation, index) => {
              // Each div gets a phase offset
              // With 10 divs, each gets 0.1 (10%) of the cycle
              // Total cycle is now 1.5s, so each div gets 150ms (was 100ms)
              const phaseWindow = 0.1; // Each div gets 10% of cycle time
              const phaseStart = index * phaseWindow;
              const phaseMid = phaseStart + phaseWindow / 2; // Midpoint for expand/contract
              const phaseEnd = phaseStart + phaseWindow;
              
              // Calculate animation value for this div based on master animation
              // Each div is active during its 0.1 phase window
              // Within that window: 0.0-0.05 = expand, 0.05-0.1 = contract
              // Outside that window: stay at base (value = 1)
              
              // Build input/output ranges
              const inputRanges: number[] = [];
              const outputRanges: number[] = [];
              
              if (index === 0) {
                // First div: active at start (0.0-0.1)
                inputRanges.push(0, phaseMid, phaseEnd, phaseEnd + 0.01, 1);
                outputRanges.push(0, 0.5, 1, 1, 1);
              } else if (index === 9) {
                // Last div: active at end (0.9-1.0), wraps to 0.0
                inputRanges.push(0, 0.01, phaseStart - 0.01, phaseStart, phaseMid, phaseEnd);
                outputRanges.push(1, 1, 1, 0, 0.5, 1);
              } else {
                // Middle divs: active in their phase window
                inputRanges.push(0, phaseStart - 0.01, phaseStart, phaseMid, phaseEnd, phaseEnd + 0.01, 1);
                outputRanges.push(1, 1, 0, 0.5, 1, 1, 1);
              }
              
              const animValue = masterAnim.interpolate({
                inputRange: inputRanges,
                outputRange: outputRanges,
                extrapolate: 'clamp',
              });
              
              // Interpolate translation with increased spacing
              // Base translation increased for more spacing between divs
              // 0 = base position (18px), 0.5 = expanded (27px), 1 = back to base (18px)
              const translationY = animValue.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [18, 27, 18], // Increased spacing: 18px base, 27px expanded
              });

              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.spinnerDiv,
                    {
                      transform: [
                        { rotate: `${rotation}deg` },
                        { translateY: translationY },
                      ],
                    },
                  ]}
                />
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    width: 9,
    height: 9,
    position: 'relative',
  },
  spinnerDiv: {
    position: 'absolute',
    width: '50%',
    height: '150%',
    backgroundColor: '#0000FF',
    left: '25%',
    top: 0,
  },
});

export default Loader;
