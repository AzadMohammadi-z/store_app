import React, { useRef } from 'react';
import { Pressable, TextInput } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Search, X } from 'lucide-react-native';
import { palettes } from '../../theme/colors';
import { fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import { ThemedIcon, useThemedStyle } from '../../theme/themed';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const L = palettes.light.search;
const D = palettes.dark.search;

const HEIGHT = 52;
const RADIUS = 18;

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: (text: string) => void;
  placeholder?: string;
};

export default function SearchBox({
  value,
  onChangeText,
  onSubmit,
  placeholder = 'جستجوی محصول یا فروشگاه',
}: Props) {
  const { theme, progress } = useTheme();
  const inputRef = useRef<React.ComponentRef<typeof AnimatedTextInput>>(null);
  const focus = useSharedValue(0);

  // رنگ کادر: اول بین دو تم، بعد بین حالت عادی و فوکوس
  const boxStyle = useAnimatedStyle(() => {
    const t = progress.value;
    const f = focus.value;

    const bg = interpolateColor(t, [0, 1], [L.background, D.background]);
    const bgFocus = interpolateColor(
      t,
      [0, 1],
      [L.focusBackground, D.focusBackground],
    );
    const border = interpolateColor(t, [0, 1], [L.border, D.border]);
    const borderFocus = interpolateColor(
      t,
      [0, 1],
      [L.focusBorder, D.focusBorder],
    );

    return {
      backgroundColor: interpolateColor(f, [0, 1], [bg, bgFocus]),
      borderColor: interpolateColor(f, [0, 1], [border, borderFocus]),
      transform: [{ scale: 1 + f * 0.012 }],
    };
  });

  const textColor = useThemedStyle({ color: t => t.text.primary });

  return (
    <Pressable
      onPress={() => inputRef.current?.focus()}
      accessibilityRole="search"
      accessibilityLabel={placeholder}
    >
      <Animated.View
        style={[
          {
            height: HEIGHT,
            borderRadius: RADIUS,
            borderWidth: 1,
            flexDirection: 'row-reverse',
            alignItems: 'center',
            paddingHorizontal: 16,
            gap: 10,
          },
          boxStyle,
        ]}
      >
        <ThemedIcon
          Icon={Search}
          size={20}
          strokeWidth={2}
          color={t => t.text.secondary}
        />

        <AnimatedTextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={() => onSubmit?.(value)}
          onFocus={() => {
            focus.value = withTiming(1, { duration: 200 });
          }}
          onBlur={() => {
            focus.value = withTiming(0, { duration: 200 });
          }}
          placeholder={placeholder}
          placeholderTextColor={theme.search.placeholder}
          returnKeyType="search"
          selectionColor={theme.gradient.to}
          style={[
            {
              flex: 1,
              height: HEIGHT,
              paddingVertical: 0,
              textAlign: 'right',
              writingDirection: 'rtl',
              fontFamily: fonts.regular,
              fontSize: 14,
            },
            textColor,
          ]}
        />

        {value.length > 0 ? (
          <Animated.View
            entering={FadeIn.duration(150)}
            exiting={FadeOut.duration(120)}
          >
            <Pressable
              hitSlop={12}
              onPress={() => onChangeText('')}
              accessibilityRole="button"
              accessibilityLabel="پاک کردن"
            >
              <ThemedIcon
                Icon={X}
                size={18}
                strokeWidth={2.2}
                color={t => t.text.secondary}
              />
            </Pressable>
          </Animated.View>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}
