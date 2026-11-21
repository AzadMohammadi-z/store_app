import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text } from 'react-native';
import GradientBox from './GradientBox';
import { fonts } from '../../theme/fonts';

type Props = {
  size?: number;
  from?: string;
  to?: string;
  /** حلقه‌ی سفید نیمه‌شفاف دور دایره */
  ring?: boolean;
  logo?: ImageSourcePropType;
  /** اگر لوگو نبود، این حرف وسط دایره نشان داده می‌شود */
  letter?: string;
};

export default function StoreAvatar({
  size = 48,
  from = '#818CF8',
  to = '#A78BFA',
  ring = true,
  logo,
  letter,
}: Props) {
  return (
    <GradientBox
      from={from}
      to={to}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: ring ? 2 : 0,
        borderColor: 'rgba(255,255,255,0.35)',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {logo ? (
        <Image
          source={logo}
          resizeMode="cover"
          style={StyleSheet.absoluteFill}
        />
      ) : letter ? (
        <Text
          style={{
            color: '#FFFFFF',
            fontFamily: fonts.bold,
            fontSize: size * 0.375,
          }}
        >
          {letter}
        </Text>
      ) : null}
    </GradientBox>
  );
}
