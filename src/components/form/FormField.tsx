import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { fonts } from '../../theme/fonts';
import { ThemedText } from '../../theme/themed';

type Props = {
  label: string;
  /** کنار برچسب «(اختیاری)» نشان می‌دهد */
  optional?: boolean;
  /** چیزی که سمت چپِ ردیف برچسب قرار می‌گیرد (مثلاً نشان «تأیید شده») */
  labelExtra?: React.ReactNode;
  error?: string;
  helper?: string;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

export default function FormField({
  label,
  optional = false,
  labelExtra,
  error,
  helper,
  style,
  children,
}: Props) {
  return (
    <View style={[{ gap: 8 }, style]}>
      <View
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 22,
        }}
      >
        <View
          style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 6 }}
        >
          <ThemedText
            color={t => t.text.primary}
            style={{ fontFamily: fonts.bold, fontSize: 14, textAlign: 'right' }}
          >
            {label}
          </ThemedText>
          {optional ? (
            <ThemedText
              color={t => t.text.secondary}
              style={{ fontFamily: fonts.regular, fontSize: 13 }}
            >
              (اختیاری)
            </ThemedText>
          ) : null}
        </View>
        {labelExtra}
      </View>

      {children}

      {error ? (
        <ThemedText
          color={t => t.form.error}
          style={{
            fontFamily: fonts.regular,
            fontSize: 12,
            textAlign: 'right',
          }}
        >
          {error}
        </ThemedText>
      ) : helper ? (
        <ThemedText
          color={t => t.text.secondary}
          style={{
            fontFamily: fonts.regular,
            fontSize: 12,
            textAlign: 'right',
          }}
        >
          {helper}
        </ThemedText>
      ) : null}
    </View>
  );
}
