import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import GradientBox from '../common/GradientBox';
import { ThemedView } from '../../theme/themed';

const RADIUS = 20;
const BORDER = 2;

type Props = {
  /** ۰ = بدون فوکوس، ۱ = فوکوس */
  focus?: SharedValue<number>;
  error?: boolean;
  disabled?: boolean;
  height: number;
  children: React.ReactNode;
};

export default function FieldShell({
  focus,
  error = false,
  disabled = false,
  height,
  children,
}: Props) {
  const idle = useSharedValue(0);
  const f = focus ?? idle;
  const err = useSharedValue(error ? 1 : 0);

  useEffect(() => {
    err.value = withTiming(error ? 1 : 0, { duration: 180 });
  }, [error, err]);

  const plainStyle = useAnimatedStyle(() => ({ opacity: 1 - f.value }));
  const gradientStyle = useAnimatedStyle(() => ({
    opacity: f.value * (1 - err.value),
  }));
  const fillStyle = useAnimatedStyle(() => ({ opacity: f.value }));
  const errorStyle = useAnimatedStyle(() => ({ opacity: err.value }));

  return (
    <View style={{ height, opacity: disabled ? 0.5 : 1 }}>
      {/* شیشه‌ی پایه */}
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, plainStyle]}
      >
        <ThemedView
          bg={t => t.form.field}
          border={t => t.form.fieldBorder}
          style={{ flex: 1, borderRadius: RADIUS, borderWidth: 1 }}
        />
      </Animated.View>

      {/* فوکوس: حاشیه‌ی گرادیانی و زمینه‌ی تیره */}
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, gradientStyle]}
      >
        <GradientBox
          from="#A78BFA"
          to="#38BDF8"
          horizontal
          style={{ flex: 1, borderRadius: RADIUS }}
        />
      </Animated.View>
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: 'absolute',
            top: BORDER,
            left: BORDER,
            right: BORDER,
            bottom: BORDER,
          },
          fillStyle,
        ]}
      >
        <ThemedView
          bg={t => t.auth.inputBackground}
          style={{ flex: 1, borderRadius: RADIUS - BORDER }}
        />
      </Animated.View>

      {/* خطا */}
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, errorStyle]}
      >
        <ThemedView
          border={t => t.form.error}
          style={{ flex: 1, borderRadius: RADIUS, borderWidth: 1.5 }}
        />
      </Animated.View>

      {children}
    </View>
  );
}
