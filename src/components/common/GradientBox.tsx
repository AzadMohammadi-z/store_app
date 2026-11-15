import React, { useId } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

type Props = {
  from: string;
  to: string;
  /** گرادیان افقی (چپ به راست) به‌جای مورب */
  horizontal?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

export default function GradientBox({
  from,
  to,
  horizontal = false,
  style,
  children,
}: Props) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');

  return (
    <View style={[style, { overflow: 'hidden' }]}>
      <Svg
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        style={StyleSheet.absoluteFill}
      >
        <Defs>
          <LinearGradient
            id={id}
            x1="0"
            y1="0"
            x2="1"
            y2={horizontal ? '0' : '1'}
          >
            <Stop offset="0" stopColor={from} />
            <Stop offset="1" stopColor={to} />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill={`url(#${id})`} />
      </Svg>
      {children}
    </View>
  );
}
