import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import FieldShell from './FieldShell';
import { fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';

type Props = {
  value: string | null;
  placeholder: string;
  /** اگر ندهی، فیلد فقط‌خواندنی است (بدون لمس و بدون کم‌رنگ شدن) */
  onPress?: () => void;
  disabled?: boolean;
  error?: boolean;
  /** آیکون سمت چپ؛ پیش‌فرض فلش پایین */
  Icon?: React.ComponentType<any>;
  /** فونت ارقام فارسی و چپ‌به‌راست (برای شماره و تاریخ) */
  numeric?: boolean;
};

export default function SelectField({
  value,
  placeholder,
  onPress,
  disabled = false,
  error = false,
  Icon = ChevronDown,
  numeric = false,
}: Props) {
  const { theme } = useTheme();

  const field = (
    <FieldShell height={56} error={error} disabled={disabled}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row-reverse',
          alignItems: 'center',
          paddingHorizontal: 16,
          gap: 8,
        }}
      >
        <Text
          numberOfLines={numeric ? 1 : 2}
          style={{
            flex: 1,
            textAlign: 'right',
            writingDirection: numeric ? 'ltr' : 'rtl',
            fontFamily: numeric ? fonts.numeric : fonts.regular,
            fontSize: numeric ? 17 : 14,
            lineHeight: numeric ? undefined : 22,
            includeFontPadding: false,
            color: value ? theme.text.primary : theme.search.placeholder,
          }}
        >
          {value ?? placeholder}
        </Text>
        <Icon size={18} color={theme.text.secondary} strokeWidth={2.2} />
      </View>
    </FieldShell>
  );

  if (!onPress) return field;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={value ?? placeholder}
      accessibilityState={{ disabled }}
    >
      {field}
    </Pressable>
  );
}
