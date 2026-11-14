import React, { useMemo } from 'react';
import { StyleSheet, TextProps, View, ViewProps } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { palettes } from './colors';
import { type Theme, useTheme } from './ThemeProvider';

/** تابعی که از پالت یک تم، رنگ مورد نظر را برمی‌دارد، مثلاً t => t.card.background */
export type ColorPick = (t: Theme) => string;

type StyleMap = Partial<
  Record<'backgroundColor' | 'borderColor' | 'color', ColorPick>
>;

/** استایل انیمیشنی که رنگ را بین دو تم ترکیب می‌کند */
export function useThemedStyle(map: StyleMap) {
  const { progress } = useTheme();

  // انتخاب‌گرها ثابت‌اند، پس یک بار محاسبه می‌شوند
  const pairs = useMemo(
    () =>
      (Object.entries(map) as [string, ColorPick][]).map(
        ([key, pick]) =>
          [key, pick(palettes.light), pick(palettes.dark)] as const,
      ),
    [],
  );

  return useAnimatedStyle(() => {
    const out: Record<string, string> = {};
    for (const [key, light, dark] of pairs) {
      out[key] = interpolateColor(progress.value, [0, 1], [light, dark]);
    }
    return out;
  });
}

type ThemedViewProps = ViewProps & { bg?: ColorPick; border?: ColorPick };

export function ThemedView({ bg, border, style, ...rest }: ThemedViewProps) {
  const animated = useThemedStyle({
    ...(bg ? { backgroundColor: bg } : {}),
    ...(border ? { borderColor: border } : {}),
  });
  return <Animated.View {...rest} style={[style, animated]} />;
}

type ThemedTextProps = TextProps & { color?: ColorPick };

export function ThemedText({ color, style, ...rest }: ThemedTextProps) {
  const animated = useThemedStyle(color ? { color } : {});
  return <Animated.Text {...rest} style={[style, animated]} />;
}

type ThemedIconProps = {
  Icon: React.ComponentType<any>;
  size: number;
  strokeWidth?: number;
  color: ColorPick;
};

/** آیکون رنگی که بین دو تم محو می‌شود (آیکون‌های SVG را نمی‌شود مستقیم انیمیت کرد) */
export function ThemedIcon({
  Icon,
  size,
  strokeWidth = 2,
  color,
}: ThemedIconProps) {
  const { progress } = useTheme();
  const darkLayer = useAnimatedStyle(() => ({ opacity: progress.value }));

  return (
    <View style={{ width: size, height: size }}>
      <View style={StyleSheet.absoluteFill}>
        <Icon
          size={size}
          color={color(palettes.light)}
          strokeWidth={strokeWidth}
        />
      </View>
      <Animated.View style={[StyleSheet.absoluteFill, darkLayer]}>
        <Icon
          size={size}
          color={color(palettes.dark)}
          strokeWidth={strokeWidth}
        />
      </Animated.View>
    </View>
  );
}
