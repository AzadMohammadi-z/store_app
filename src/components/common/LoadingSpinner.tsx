import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const SPOKES = 12;

type Props = {
  size?: number;
  color?: string;
};

/** اسپینر شبیه آیفون: ۱۲ پره که پله‌پله می‌چرخند */
export default function LoadingSpinner({
  size = 24,
  color = '#FFFFFF',
}: Props) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = 0;
    progress.value = withRepeat(
      withTiming(1, { duration: 1000, easing: Easing.linear }),
      -1,
      false,
    );
    return () => cancelAnimation(progress);
  }, [progress]);

  // چرخش پله‌ای: هر بار ۳۰ درجه
  const rotation = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${
          (Math.floor(progress.value * SPOKES) % SPOKES) * (360 / SPOKES)
        }deg`,
      },
    ],
  }));

  const spokeW = Math.max(2, size * 0.09);
  const spokeH = size * 0.28;

  return (
    <Animated.View
      style={[{ width: size, height: size }, rotation]}
      accessibilityRole="progressbar"
    >
      {Array.from({ length: SPOKES }).map((_, i) => {
        // پره‌ی صفر روشن‌ترین است و بقیه به‌ترتیب (خلاف جهت چرخش) محو می‌شوند
        const k = (SPOKES - i) % SPOKES;
        return (
          <View
            key={i}
            style={[
              StyleSheet.absoluteFill,
              { transform: [{ rotate: `${i * 30}deg` }] },
            ]}
          >
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: size / 2 - spokeW / 2,
                width: spokeW,
                height: spokeH,
                borderRadius: spokeW / 2,
                backgroundColor: color,
                opacity: 1 - (k / SPOKES) * 0.85,
              }}
            />
          </View>
        );
      })}
    </Animated.View>
  );
}
