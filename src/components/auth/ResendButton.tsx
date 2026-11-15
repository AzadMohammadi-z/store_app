import React from 'react';
import { Pressable, Text } from 'react-native';
import { fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import { ThemedText, ThemedView } from '../../theme/themed';
import { formatTimer } from '../../utils/format';

type Props = {
  /** ثانیه‌های باقی‌مانده تا امکان ارسال دوباره */
  seconds: number;
  onPress: () => void;
};

export default function ResendButton({ seconds, onPress }: Props) {
  const { theme } = useTheme();
  const ready = seconds <= 0;

  return (
    <Pressable
      onPress={onPress}
      disabled={!ready}
      accessibilityRole="button"
      accessibilityState={{ disabled: !ready }}
      style={{ alignSelf: 'center' }}
    >
      <ThemedView
        bg={t => t.auth.skipBackground}
        border={t => t.auth.skipBorder}
        style={{
          height: 44,
          paddingHorizontal: 22,
          borderRadius: 22,
          borderWidth: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {ready ? (
          <ThemedText
            color={t => t.auth.link}
            style={{ fontFamily: fonts.bold, fontSize: 13 }}
          >
            ارسال مجدد کد
          </ThemedText>
        ) : (
          <ThemedText
            color={t => t.text.secondary}
            style={{ fontFamily: fonts.regular, fontSize: 13 }}
          >
            ارسال مجدد کد تا{' '}
            <Text style={{ color: theme.text.primary, fontFamily: fonts.bold }}>
              {formatTimer(seconds)}
            </Text>
          </ThemedText>
        )}
      </ThemedView>
    </Pressable>
  );
}
