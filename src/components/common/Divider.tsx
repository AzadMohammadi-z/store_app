import React from 'react';
import { View } from 'react-native';
import { ThemedView } from '../../theme/themed';

export default function Divider({ dashed = false }: { dashed?: boolean }) {
  if (dashed) {
    // ترفند برای خط‌چین یک‌طرفه: فقط لبه‌ی بالایی کادر دیده می‌شود
    return (
      <View style={{ height: 1, overflow: 'hidden' }}>
        <ThemedView
          border={t => t.card.divider}
          style={{
            height: 2,
            borderWidth: 1,
            borderStyle: 'dashed',
            borderRadius: 1,
          }}
        />
      </View>
    );
  }

  return <ThemedView bg={t => t.card.divider} style={{ height: 1 }} />;
}
