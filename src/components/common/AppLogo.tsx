import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';

const logo = require('../../assets/logo.png');

type Props = {
  size?: number;
  /** گردی گوشه‌ها؛ اگر خود فایل لوگو گرد نیست مثلاً size * 0.28 بده */
  radius?: number;
  style?: StyleProp<ImageStyle>;
};

export default function AppLogo({ size = 36, radius = 0, style }: Props) {
  return (
    <Image
      source={logo}
      resizeMode="contain"
      style={[{ width: size, height: size, borderRadius: radius }, style]}
      accessibilityLabel="لوگوی نوازون"
    />
  );
}
