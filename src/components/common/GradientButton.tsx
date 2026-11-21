import React, { useEffect, useId } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';
import GradientBox from './GradientBox';
import { fonts } from '../../theme/fonts';

type Props = {
  label: string;
  Icon?: React.ComponentType<any>;
  onPress: () => void;
  from: string;
  to: string;
  /** رنگ هاله‌ی نور زیر دکمه؛ اگر ندهی هاله ندارد */
  glow?: string;
  disabled?: boolean;
  loading?: boolean;
  height?: number;
  radius?: number;
};

export default function GradientButton({
  label,
  Icon,
  onPress,
  from,
  to,
  glow,
  disabled = false,
  loading = false,
  height = 58,
  radius = 22,
}: Props) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const press = useSharedValue(0);
  const dim = useSharedValue(disabled ? 1 : 0);

  useEffect(() => {
    dim.value = withTiming(disabled ? 1 : 0, { duration: 220 });
  }, [disabled, dim]);

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: 1 - dim.value * 0.5,
    transform: [{ scale: 1 - press.value * 0.03 }],
  }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: 1 - dim.value }));

  return (
    <View>
      {glow ? (
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              left: -18,
              right: -18,
              top: 10,
              bottom: -24,
            },
            glowStyle,
          ]}
        >
          <Svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <Defs>
              <RadialGradient id={id} cx="50%" cy="50%" r="50%">
                <Stop offset="0" stopColor={glow} stopOpacity={0.45} />
                <Stop offset="1" stopColor={glow} stopOpacity={0} />
              </RadialGradient>
            </Defs>
            <Ellipse cx="50" cy="50" rx="50" ry="50" fill={`url(#${id})`} />
          </Svg>
        </Animated.View>
      ) : null}

      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        onPressIn={() => {
          press.value = withSpring(1, { damping: 18, stiffness: 300 });
        }}
        onPressOut={() => {
          press.value = withSpring(0, { damping: 14, stiffness: 240 });
        }}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled, busy: loading }}
      >
        <Animated.View style={buttonStyle}>
          <GradientBox
            from={from}
            to={to}
            horizontal
            style={[styles.button, { height, borderRadius: radius }]}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <View
                style={{
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <Text style={styles.label}>{label}</Text>
                {Icon ? (
                  <Icon size={20} color="#FFFFFF" strokeWidth={2.2} />
                ) : null}
              </View>
            )}
          </GradientBox>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#FFFFFF',
    fontFamily: fonts.bold,
    fontSize: 17,
  },
});
