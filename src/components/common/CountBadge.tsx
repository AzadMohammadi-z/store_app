import React from 'react';
import { Text } from 'react-native';
import { fonts } from '../../theme/fonts';
import { ThemedView } from '../../theme/themed';
import { toFaDigits } from '../../utils/format';

export default function CountBadge({ count }: { count: number }) {
  if (count <= 0) return null;

  return (
    <ThemedView
      bg={t => t.account.badge}
      style={{
        minWidth: 22,
        height: 22,
        paddingHorizontal: 6,
        borderRadius: 11,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: '#FFFFFF', fontFamily: fonts.bold, fontSize: 12 }}>
        {count > 99 ? '+۹۹' : toFaDigits(String(count))}
      </Text>
    </ThemedView>
  );
}
