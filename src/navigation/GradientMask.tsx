import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import MaskedViewBase from '@react-native-masked-view/masked-view';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { useTheme } from '../theme/ThemeProvider';

const MaskedView = MaskedViewBase as unknown as React.ComponentType<
  React.PropsWithChildren<{
    style?: StyleProp<ViewStyle>;
    maskElement: React.ReactElement;
    androidRenderingMode?: 'software' | 'hardware';
  }>
>;

/** پس‌زمینه‌ی گرادیانی که از پشت ماسک دیده می‌شود */
function GradientFill() {
  const { theme } = useTheme();
  return (
    <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
      <Defs>
        <LinearGradient id="tabGradient" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={theme.gradient.from} />
          <Stop offset="1" stopColor={theme.gradient.to} />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#tabGradient)" />
    </Svg>
  );
}

type GradientIconProps = {
  Icon: React.ComponentType<any>;
  size: number;
  strokeWidth: number;
};

export function GradientIcon({ Icon, size, strokeWidth }: GradientIconProps) {
  return (
    <MaskedView
      style={{ width: size, height: size }}
      maskElement={
        <View
          style={{ width: size, height: size, backgroundColor: 'transparent' }}
        >
          <Icon size={size} color="#000" strokeWidth={strokeWidth} />
        </View>
      }
    >
      <GradientFill />
    </MaskedView>
  );
}

type GradientTextProps = {
  children: string;
  style?: StyleProp<TextStyle>;
};

export function GradientText({ children, style }: GradientTextProps) {
  return (
    <MaskedView
      maskElement={
        <Text style={style} numberOfLines={1}>
          {children}
        </Text>
      }
    >
      <GradientFill />
      <Text style={[style, { opacity: 0 }]} numberOfLines={1}>
        {children}
      </Text>
    </MaskedView>
  );
}
