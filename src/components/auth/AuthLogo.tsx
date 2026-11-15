import React, { useId } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { useTheme } from '../../theme/ThemeProvider';
import AppLogo from '../common/AppLogo';

export default function AuthLogo({ size = 104 }: { size?: number }) {
  const { theme } = useTheme();
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const glowSize = size * 2.4;
  const offset = (glowSize - size) / 2;

  return (
    <View style={{ width: size, height: size }}>
      <Svg
        width={glowSize}
        height={glowSize}
        viewBox="0 0 100 100"
        pointerEvents="none"
        style={{ position: 'absolute', left: -offset, top: -offset }}
      >
        <Defs>
          <RadialGradient id={id} cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={theme.auth.glow} stopOpacity={0.5} />
            <Stop offset="1" stopColor={theme.auth.glow} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx="50" cy="50" r="50" fill={`url(#${id})`} />
      </Svg>

      <AppLogo size={size} radius={size * 0.28} />
    </View>
  );
}
