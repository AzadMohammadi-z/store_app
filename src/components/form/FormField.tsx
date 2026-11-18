import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { fonts } from '../../theme/fonts';
import { ThemedText } from '../../theme/themed';

type Props = {
  label: string;
  error?: string;
  helper?: string;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

export default function FormField({
  label,
  error,
  helper,
  style,
  children,
}: Props) {
  return (
    <View style={[{ gap: 8 }, style]}>
      <ThemedText
        color={t => t.text.primary}
        style={{ fontFamily: fonts.bold, fontSize: 14, textAlign: 'right' }}
      >
        {label}
      </ThemedText>

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
