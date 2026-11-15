import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import GradientBox from '../common/GradientBox';
import { fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import { ThemedText, ThemedView, useThemedStyle } from '../../theme/themed';
import { groupIranMobile, normalizeIranMobile } from '../../utils/format';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const HEIGHT = 64;
const RADIUS = 22;
const BORDER = 2;

type Props = {
  /** ده رقم انگلیسی بدون صفر اول */
  value: string;
  onChange: (digits: string) => void;
  onSubmit?: () => void;
  countryCode?: string;
};

export default function PhoneField({
  value,
  onChange,
  onSubmit,
  countryCode = '+98',
}: Props) {
  const { theme } = useTheme();
  const focus = useSharedValue(0);

  const gradientStyle = useAnimatedStyle(() => ({ opacity: focus.value }));
  const plainStyle = useAnimatedStyle(() => ({ opacity: 1 - focus.value }));
  const inputText = useThemedStyle({ color: t => t.auth.inputText });

  return (
    <View style={{ flexDirection: 'row-reverse', gap: 12 }}>
      {/* کادر شماره (سمت راست) */}
      <View style={{ flex: 1, height: HEIGHT }}>
        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, gradientStyle]}
        >
          <GradientBox
            from="#A78BFA"
            to="#38BDF8"
            horizontal
            style={{ flex: 1, borderRadius: RADIUS }}
          />
        </Animated.View>

        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, plainStyle]}
        >
          <ThemedView
            border={t => t.auth.inputBorder}
            style={{ flex: 1, borderRadius: RADIUS, borderWidth: 1 }}
          />
        </Animated.View>

        <ThemedView
          bg={t => t.auth.inputBackground}
          style={{
            position: 'absolute',
            top: BORDER,
            left: BORDER,
            right: BORDER,
            bottom: BORDER,
            borderRadius: RADIUS - BORDER,
            justifyContent: 'center',
          }}
        >
          <AnimatedTextInput
            value={groupIranMobile(value)}
            onChangeText={text => onChange(normalizeIranMobile(text))}
            onFocus={() => {
              focus.value = withTiming(1, { duration: 220 });
            }}
            onBlur={() => {
              focus.value = withTiming(0, { duration: 220 });
            }}
            onSubmitEditing={onSubmit}
            placeholder="912 345 6789"
            placeholderTextColor={theme.search.placeholder}
            keyboardType="number-pad"
            returnKeyType="done"
            textContentType="telephoneNumber"
            autoComplete="tel"
            selectionColor={theme.gradient.to}
            cursorColor={theme.gradient.to}
            accessibilityLabel="شماره موبایل"
            style={[
              {
                height: HEIGHT,
                paddingVertical: 0,
                paddingHorizontal: 20,
                textAlign: 'left',
                writingDirection: 'ltr',
                fontFamily: fonts.numeric,
                fontSize: 22,
                letterSpacing: 1,
                includeFontPadding: false,
                textAlignVertical: 'center',
              },
              inputText,
            ]}
          />
        </ThemedView>
      </View>

      {/* پیش‌شماره (سمت چپ): همان +98 لاتین مثل طراحی */}
      <ThemedView
        bg={t => t.auth.codeBackground}
        border={t => t.auth.codeBorder}
        style={{
          width: 82,
          height: HEIGHT,
          borderRadius: RADIUS,
          borderWidth: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ThemedText
          color={t => t.text.primary}
          style={{ fontFamily: fonts.bold, fontSize: 18 }}
        >
          {countryCode}
        </ThemedText>
      </ThemedView>
    </View>
  );
}
