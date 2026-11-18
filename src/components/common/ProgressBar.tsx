import React, { useEffect, useState } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import GradientBox from './GradientBox';
import { ThemedView } from '../../theme/themed';

type Props = {
  /** ۰ تا ۱؛ از راست پر می‌شود */
  progress: number;
  from?: string;
  to?: string;
};

export default function ProgressBar({
  progress,
  from = '#38BDF8',
  to = '#A78BFA',
}: Props) {
  const [trackW, setTrackW] = useState(0);
  const p = useSharedValue(0);

  useEffect(() => {
    p.value = withTiming(progress, {
      duration: 700,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress, p]);

  // گرادیان با عرض کامل و ثابت کشیده می‌شود؛ فقط کوچک می‌شود و به راست می‌چسبد
  const fill = useAnimatedStyle(() => ({
    transform: [
      { translateX: (trackW / 2) * (1 - p.value) },
      { scaleX: Math.max(p.value, 0.0001) },
    ],
  }));

  return (
    <ThemedView
      bg={t => t.account.track}
      onLayout={e => setTrackW(e.nativeEvent.layout.width)}
      style={{ height: 6, borderRadius: 3, overflow: 'hidden' }}
    >
      {trackW > 0 ? (
        <Animated.View style={[{ width: trackW, height: 6 }, fill]}>
          <GradientBox
            from={from}
            to={to}
            horizontal
            style={{ flex: 1, borderRadius: 3 }}
          />
        </Animated.View>
      ) : null}
    </ThemedView>
  );
}
