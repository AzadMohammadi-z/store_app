import React from 'react';
import { View } from 'react-native';
import { fonts } from '../../theme/fonts';
import { ThemedText } from '../../theme/themed';

type Props = {
  label: string;
  value: string;
  /** برچسب هم پررنگ و تیره باشد (برای ردیف‌های جمع) */
  strong?: boolean;
  /** اندازه‌ی بزرگ‌تر (برای ردیف‌های جمع) */
  big?: boolean;
};

export default function InfoRow({
  label,
  value,
  strong = false,
  big = false,
}: Props) {
  return (
    <View
      style={{
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
      }}
    >
      <ThemedText
        color={strong ? t => t.text.primary : t => t.text.secondary}
        style={{
          fontFamily: strong ? fonts.bold : fonts.regular,
          fontSize: big ? 16 : 13,
        }}
      >
        {label}
      </ThemedText>
      <ThemedText
        color={t => t.text.primary}
        style={{ fontFamily: fonts.bold, fontSize: big ? 18 : 13 }}
      >
        {value}
      </ThemedText>
    </View>
  );
}
