import React from 'react';
import { Pressable } from 'react-native';
import { ThemedIcon, ThemedView } from '../../theme/themed';

type Props = {
  Icon: React.ComponentType<any>;
  onPress: () => void;
  label: string;
};

export default function SquareButton({ Icon, onPress, label }: Props) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <ThemedView
        bg={t => t.auth.skipBackground}
        border={t => t.auth.skipBorder}
        style={{
          width: 44,
          height: 44,
          borderRadius: 14,
          borderWidth: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ThemedIcon
          Icon={Icon}
          size={20}
          strokeWidth={2}
          color={t => t.text.primary}
        />
      </ThemedView>
    </Pressable>
  );
}
