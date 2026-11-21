import React from 'react';
import {
  KeyboardTypeOptions,
  ReturnKeyTypeOptions,
  TextInput,
  TextInputProps,
} from 'react-native';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';
import FieldShell from './FieldShell';
import { fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import { useThemedStyle } from '../../theme/themed';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: boolean;
  multiline?: boolean;
  height?: number;
  /** برای شماره و کد: فونت ارقام فارسی و چپ‌به‌راست */
  numeric?: boolean;
  keyboardType?: KeyboardTypeOptions;
  returnKeyType?: ReturnKeyTypeOptions;
  autoComplete?: TextInputProps['autoComplete'];
  textContentType?: TextInputProps['textContentType'];
  accessibilityLabel?: string;
  /** برای ایمیل و متن لاتین: چپ‌به‌راست، سمت راست‌چین، فونت ارقام فارسی معمولی */
  ltr?: boolean;
  autoCapitalize?: TextInputProps['autoCapitalize'];
};

export default function TextField({
  value,
  onChangeText,
  placeholder,
  error = false,
  multiline = false,
  height = 56,
  numeric = false,
  ltr = false,
  autoCapitalize,
  keyboardType,
  returnKeyType,
  autoComplete,
  textContentType,
  accessibilityLabel,
}: Props) {
  const { theme } = useTheme();
  const focus = useSharedValue(0);
  const inputText = useThemedStyle({ color: t => t.auth.inputText });

  return (
    <FieldShell focus={focus} error={error} height={height}>
      <AnimatedTextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={() => {
          focus.value = withTiming(1, { duration: 200 });
        }}
        onBlur={() => {
          focus.value = withTiming(0, { duration: 200 });
        }}
        placeholder={placeholder}
        placeholderTextColor={theme.search.placeholder}
        multiline={multiline}
        keyboardType={keyboardType}
        returnKeyType={returnKeyType}
        autoComplete={autoComplete}
        textContentType={textContentType}
        selectionColor={theme.gradient.to}
        cursorColor={theme.gradient.to}
        accessibilityLabel={accessibilityLabel ?? placeholder}
        autoCapitalize={autoCapitalize}
        style={[
          {
            flex: 1,
            paddingHorizontal: 18,
            paddingVertical: multiline ? 16 : 0,
            textAlign: 'right',
            writingDirection: numeric || ltr ? 'ltr' : 'rtl',
            textAlignVertical: multiline ? 'top' : 'center',
            fontFamily: numeric
              ? fonts.numeric
              : ltr
              ? fonts.numericRegular
              : fonts.regular,
            fontSize: numeric ? 17 : ltr ? 16 : 15,
            includeFontPadding: false,
          },
          inputText,
        ]}
      />
    </FieldShell>
  );
}
