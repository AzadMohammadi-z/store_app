import React, { useEffect, useRef, useState } from 'react';
import { Keyboard, Pressable, StyleSheet, TextInput, View } from 'react-native';
import Animated, {
  ZoomIn,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import GradientBox from '../common/GradientBox';
import { fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import { ThemedText, ThemedView } from '../../theme/themed';
import { normalizeCode, toFaDigits } from '../../utils/format';

export const CODE_LENGTH = 6;

const HEIGHT = 64;
const RADIUS = 18;
const BORDER = 2;
const GAP = 10;

/* ------------------------------- هر کادر ------------------------------- */

type BoxProps = {
  digit?: string;
  active: boolean;
  onPress: () => void;
};

function OtpBox({ digit, active, onPress }: BoxProps) {
  const { theme } = useTheme();
  const activeV = useSharedValue(active ? 1 : 0);
  const filledV = useSharedValue(digit ? 1 : 0);
  const blink = useSharedValue(0);

  useEffect(() => {
    activeV.value = withTiming(active ? 1 : 0, { duration: 180 });
  }, [active, activeV]);

  useEffect(() => {
    filledV.value = withTiming(digit ? 1 : 0, { duration: 160 });
  }, [digit, filledV]);

  // مکان‌نمای چشمک‌زن فقط در کادر فعالِ خالی
  const showCursor = active && !digit;
  useEffect(() => {
    if (showCursor) {
      blink.value = 1;
      blink.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 500 }),
          withTiming(1, { duration: 500 }),
        ),
        -1,
      );
    } else {
      cancelAnimation(blink);
      blink.value = 0;
    }
  }, [showCursor, blink]);

  const filledStyle = useAnimatedStyle(() => ({ opacity: filledV.value }));
  const activeStyle = useAnimatedStyle(() => ({ opacity: activeV.value }));
  const cursorStyle = useAnimatedStyle(() => ({ opacity: blink.value }));

  return (
    <Pressable
      onPress={onPress}
      style={{ flex: 1, height: HEIGHT }}
      accessibilityRole="button"
      accessibilityLabel="کادر کد تأیید"
    >
      {/* شیشه‌ی پایه */}
      <ThemedView
        pointerEvents="none"
        bg={t => t.auth.codeBackground}
        border={t => t.auth.codeBorder}
        style={{
          ...StyleSheet.absoluteFill,
          borderRadius: RADIUS,
          borderWidth: 1,
        }}
      />

      {/* روشن‌تر وقتی رقم دارد */}
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, filledStyle]}
      >
        <ThemedView
          bg={t => t.auth.otpFilled}
          style={{ flex: 1, borderRadius: RADIUS }}
        />
      </Animated.View>

      {/* حالت فعال: تیره با حاشیه‌ی گرادیانی */}
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, activeStyle]}
      >
        <GradientBox
          from="#A78BFA"
          to="#38BDF8"
          horizontal
          style={{ flex: 1, borderRadius: RADIUS }}
        />
        <ThemedView
          bg={t => t.auth.inputBackground}
          style={{
            position: 'absolute',
            top: BORDER,
            left: BORDER,
            right: BORDER,
            bottom: BORDER,
            borderRadius: RADIUS - BORDER,
          }}
        />
      </Animated.View>

      {/* رقم */}
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { alignItems: 'center', justifyContent: 'center' },
        ]}
      >
        {digit ? (
          <Animated.View key={digit} entering={ZoomIn.duration(140)}>
            <ThemedText
              color={t => t.text.primary}
              style={{
                fontFamily: fonts.numeric,
                fontSize: 26,
                includeFontPadding: false,
              }}
            >
              {toFaDigits(digit)}
            </ThemedText>
          </Animated.View>
        ) : null}
      </View>

      {/* مکان‌نما */}
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { alignItems: 'center', justifyContent: 'center' },
        ]}
      >
        <Animated.View
          style={[
            {
              width: 2,
              height: 26,
              borderRadius: 1,
              backgroundColor: theme.gradient.to,
            },
            cursorStyle,
          ]}
        />
      </View>
    </Pressable>
  );
}

/* ----------------------------- کل ردیف کادرها ----------------------------- */

type Props = {
  value: string;
  onChange: (code: string) => void;
  onSubmit?: () => void;
};

export default function OtpField({ value, onChange, onSubmit }: Props) {
  const inputRef = useRef<React.ComponentRef<typeof TextInput>>(null);
  const [focused, setFocused] = useState(false);

  const activeIndex = Math.min(value.length, CODE_LENGTH - 1);

  useEffect(() => {
    const sub = Keyboard.addListener('keyboardDidHide', () => {
      inputRef.current?.blur();
    });
    return () => sub.remove();
  }, []);

  const handleBoxPress = (i: number) => {
    // لمس کادرِ پرشده: همان کادر و کادرهای بعدی پاک می‌شوند تا از همان‌جا دوباره بنویسی
    if (i < value.length) onChange(value.slice(0, i));
    const input = inputRef.current;
    if (input?.isFocused() && !Keyboard.isVisible()) {
      // فوکوس مانده ولی کیبورد بسته است: یک بار از فوکوس درمی‌آوریم تا دوباره باز شود
      input.blur();
      setTimeout(() => input.focus(), 50);
    } else {
      input?.focus();
    }
  };

  return (
    <View>
      {/* ارقام از چپ به راست پر می‌شوند (direction ltr) */}
      <View style={{ flexDirection: 'row', direction: 'ltr', gap: GAP }}>
        {Array.from({ length: CODE_LENGTH }).map((_, i) => (
          <OtpBox
            key={i}
            digit={value[i]}
            active={focused && i === activeIndex}
            onPress={() => handleBoxPress(i)}
          />
        ))}
      </View>

      {/* ورودی واقعی: نامرئی، فقط کیبورد و پر کردن خودکار پیامک را می‌گیرد */}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={text => onChange(normalizeCode(text, CODE_LENGTH))}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onSubmitEditing={onSubmit}
        keyboardType="number-pad"
        returnKeyType="done"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        maxLength={CODE_LENGTH}
        caretHidden
        style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }}
      />
    </View>
  );
}
