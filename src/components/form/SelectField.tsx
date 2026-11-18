import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import FieldShell from './FieldShell';
import { fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';

type Props = {
  value: string | null;
  placeholder: string;
  onPress: () => void;
  disabled?: boolean;
  error?: boolean;
};

export default function SelectField({
  value,
  placeholder,
  onPress,
  disabled = false,
  error = false,
}: Props) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={value ?? placeholder}
      accessibilityState={{ disabled }}
    >
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
            numberOfLines={2}
            style={{
              flex: 1,
              textAlign: 'right',
              writingDirection: 'rtl',
              fontFamily: fonts.regular,
              fontSize: 14,
              lineHeight: 22,
              color: value ? theme.text.primary : theme.search.placeholder,
            }}
          >
            {value ?? placeholder}
          </Text>
          <ChevronDown
            size={18}
            color={theme.text.secondary}
            strokeWidth={2.2}
          />
        </View>
      </FieldShell>
    </Pressable>
  );
}
