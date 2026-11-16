import React from 'react';
import { ThemedIcon, ThemedView } from '../../theme/themed';

export type Tone = 'red' | 'indigo' | 'teal' | 'purple' | 'blue' | 'amber';

type Props = {
  Icon: React.ComponentType<any>;
  tone: Tone;
  size?: number;
  iconSize?: number;
};

export default function IconTile({
  Icon,
  tone,
  size = 40,
  iconSize = 20,
}: Props) {
  return (
    <ThemedView
      key={tone}
      bg={t => t.tones[tone].bg}
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.32,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ThemedIcon
        Icon={Icon}
        size={iconSize}
        strokeWidth={2}
        color={t => t.tones[tone].icon}
      />
    </ThemedView>
  );
}
