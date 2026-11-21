import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Animated, {
  Extrapolation,
  type SharedValue,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

type DotProps = {
  index: number;
  scrollX: SharedValue<number>;
  step: number;
  color: string;
};

function Dot({ index, scrollX, step, color }: DotProps) {
  const style = useAnimatedStyle(() => {
    const p = interpolate(
      scrollX.value,
      [(index - 1) * step, index * step, (index + 1) * step],
      [0, 1, 0],
      Extrapolation.CLAMP,
    );
    return { width: 7 + p * 17, opacity: 0.3 + p * 0.7 };
  });

  return (
    <Animated.View
      style={[{ height: 7, borderRadius: 4, backgroundColor: color }, style]}
    />
  );
}

type Props = {
  count: number;
  scrollX: SharedValue<number>;
  /** فاصله‌ی دو صفحه در اسکرول (عرض هر صفحه به‌اضافه‌ی فاصله) */
  step: number;
  color: string;
  style?: StyleProp<ViewStyle>;
};

/** نقطه‌هایی که با اسکرول کش می‌آیند؛ اولین نقطه سمت راست است */
export default function PagerDots({
  count,
  scrollX,
  step,
  color,
  style,
}: Props) {
  return (
    <View
      pointerEvents="none"
      style={[
        {
          flexDirection: 'row-reverse',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 6,
        },
        style,
      ]}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Dot key={i} index={i} scrollX={scrollX} step={step} color={color} />
      ))}
    </View>
  );
}
