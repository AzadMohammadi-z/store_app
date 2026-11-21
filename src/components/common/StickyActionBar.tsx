import React from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GradientButton from './GradientButton';
import { SCREEN_PADDING } from '../../constants/layout';
import useKeyboardVisible from '../../hooks/useKeyboardVisible';
import { fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import { ThemedText, ThemedView } from '../../theme/themed';

type Props = {
  /** برچسب کوچک بالای مبلغ، مثلاً «قابل پرداخت» */
  label: string;
  /** مبلغ آماده‌ی نمایش، مثلاً «۱٬۲۰۰٬۰۰۰ تومان» */
  value: string;
  actionLabel: string;
  onAction: () => void;
  ActionIcon?: React.ComponentType<any>;
  disabled?: boolean;
  loading?: boolean;
  /** با باز شدن کیبورد پنهان شود */
  hideOnKeyboard?: boolean;
};

export default function StickyActionBar({
  label,
  value,
  actionLabel,
  onAction,
  ActionIcon,
  disabled,
  loading,
  hideOnKeyboard = false,
}: Props) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const keyboardVisible = useKeyboardVisible();
  const visible = !(hideOnKeyboard && keyboardVisible);

  // ظرف همیشه هست تا انیمیشن خروج اجرا شود
  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        left: SCREEN_PADDING,
        right: SCREEN_PADDING,
        bottom: Math.max(insets.bottom, 12),
      }}
    >
      {visible ? (
        <Animated.View
          entering={FadeInDown.duration(250)}
          exiting={FadeOutDown.duration(180)}
        >
          <ThemedView
            bg={t => t.modal.card}
            border={t => t.modal.cardBorder}
            style={{
              borderWidth: 1,
              borderRadius: 28,
              padding: 12,
              flexDirection: 'row-reverse',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <View
              style={{ alignItems: 'flex-end', gap: 2, paddingHorizontal: 6 }}
            >
              <ThemedText
                color={t => t.text.secondary}
                style={{ fontFamily: fonts.regular, fontSize: 12 }}
              >
                {label}
              </ThemedText>
              <ThemedText
                color={t => t.text.primary}
                style={{ fontFamily: fonts.bold, fontSize: 17 }}
              >
                {value}
              </ThemedText>
            </View>

            <View style={{ flex: 1 }}>
              <GradientButton
                label={actionLabel}
                onPress={onAction}
                from={theme.auth.buttonFrom}
                to={theme.auth.buttonTo}
                Icon={ActionIcon}
                disabled={disabled}
                loading={loading}
                height={52}
                radius={20}
              />
            </View>
          </ThemedView>
        </Animated.View>
      ) : null}
    </View>
  );
}
