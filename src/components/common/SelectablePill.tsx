import React, { useEffect } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import GradientBox from './GradientBox';
import { fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import { ThemedView } from '../../theme/themed';
import { toFaDigits } from '../../utils/format';

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
  /** شمارنده‌ی کوچک کنار برچسب؛ اگر صفر باشد نشان داده نمی‌شود */
  count?: number;
  height?: number;
  /** برای تعیین عرض (مثلاً flex) از بیرون */
  style?: StyleProp<ViewStyle>;
};

export default function SelectablePill({
  label,
  selected,
  onPress,
  count = 0,
  height = 44,
  style,
}: Props) {
  const { theme } = useTheme();
  const sel = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    sel.value = withTiming(selected ? 1 : 0, { duration: 200 });
  }, [selected, sel]);

  const gradientStyle = useAnimatedStyle(() => ({ opacity: sel.value }));
  const textColor = selected ? '#FFFFFF' : theme.text.primary;

  return (
    <Pressable
      onPress={onPress}
      style={style}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
    >
      <ThemedView
        bg={t => t.card.background}
        border={t => t.card.border}
        style={{
          height,
          borderRadius: height / 2,
          borderWidth: 1,
          paddingHorizontal: 16,
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          overflow: 'hidden',
        }}
      >
        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, gradientStyle]}
        >
          <GradientBox
            from={theme.auth.buttonFrom}
            to={theme.auth.buttonTo}
            horizontal
            style={{ flex: 1 }}
          />
        </Animated.View>

        <Text
          numberOfLines={1}
          style={{
            color: textColor,
            fontFamily: selected ? fonts.bold : fonts.medium,
            fontSize: 14,
          }}
        >
          {label}
        </Text>

        {count > 0 ? (
          <View
            style={{
              minWidth: 22,
              height: 22,
              paddingHorizontal: 6,
              borderRadius: 11,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: selected
                ? 'rgba(255,255,255,0.25)'
                : theme.auth.codeBackground,
            }}
          >
            <Text
              style={{ color: textColor, fontFamily: fonts.bold, fontSize: 12 }}
            >
              {toFaDigits(String(count))}
            </Text>
          </View>
        ) : null}
      </ThemedView>
    </Pressable>
  );
}
