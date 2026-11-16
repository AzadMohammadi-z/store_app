import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { ThemedView } from '../../theme/themed';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  radius?: number;
};

export default function GlassCard({ children, style, radius = 28 }: Props) {
  return (
    <ThemedView
      bg={t => t.card.background}
      border={t => t.card.border}
      style={[{ borderWidth: 1, borderRadius: radius }, style]}
    >
      {children}
    </ThemedView>
  );
}
