import React from 'react';
import type { Tone } from '../account/IconTile';
import { fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import { ThemedText, ThemedView } from '../../theme/themed';

export default function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: Tone;
}) {
  const { theme } = useTheme();

  return (
    <ThemedView
      key={tone}
      bg={t => t.tones[tone].bg}
      style={{
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: `${theme.tones[tone].icon}55`,
      }}
    >
      <ThemedText
        key={tone}
        color={t => t.tones[tone].icon}
        style={{ fontFamily: fonts.medium, fontSize: 12 }}
      >
        {label}
      </ThemedText>
    </ThemedView>
  );
}
