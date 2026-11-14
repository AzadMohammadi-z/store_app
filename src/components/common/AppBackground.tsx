import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import Svg, {
  Defs,
  Ellipse,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';
import { palettes } from '../../theme/colors';
import { useTheme } from '../../theme/ThemeProvider';

type Palette = typeof palettes.light;

const Layer = React.memo(function Layer({
  palette,
  prefix,
}: {
  palette: Palette;
  prefix: string;
}) {
  const { base, blobs } = palette.background;

  return (
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    >
      <Defs>
        {blobs.map(b => (
          <RadialGradient
            key={b.id}
            id={`${prefix}-${b.id}`}
            cx="50%"
            cy="50%"
            r="50%"
          >
            <Stop offset="0" stopColor={b.color} stopOpacity={b.opacity} />
            <Stop offset="1" stopColor={b.color} stopOpacity={0} />
          </RadialGradient>
        ))}
      </Defs>

      <Rect width="100" height="100" fill={base} />

      {blobs.map(b => (
        <Ellipse
          key={b.id}
          cx={b.x}
          cy={b.y}
          rx={b.rx}
          ry={b.ry}
          fill={`url(#${prefix}-${b.id})`}
        />
      ))}
    </Svg>
  );
});

function AppBackground() {
  const { progress } = useTheme();
  const darkStyle = useAnimatedStyle(() => ({ opacity: progress.value }));

  return (
    <>
      <Layer palette={palettes.light} prefix="light" />
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, darkStyle]}
      >
        <Layer palette={palettes.dark} prefix="dark" />
      </Animated.View>
    </>
  );
}

export default React.memo(AppBackground);
