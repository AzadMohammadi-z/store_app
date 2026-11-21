import React from 'react';
import { Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { fonts } from '../../theme/fonts';
import { ThemedText, ThemedView } from '../../theme/themed';

type Props = {
  label: string;
  onPress: () => void;
  height?: number;
  radius?: number;
  /** نسخه‌ی کوچک و جمع‌وجور (عرض به اندازه‌ی متن) برای کنار متن‌ها */
  small?: boolean;
};

export default function TintedButton({
  label,
  onPress,
  height = 54,
  radius = 27,
  small = false,
}: Props) {
  const press = useSharedValue(0);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - press.value * 0.03 }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        press.value = withSpring(1, { damping: 18, stiffness: 300 });
      }}
      onPressOut={() => {
        press.value = withSpring(0, { damping: 14, stiffness: 240 });
      }}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Animated.View style={style}>
        <ThemedView
          bg={t => t.account.trackButtonBackground}
          border={t => t.account.trackButtonBorder}
          style={{
            height: small ? 40 : height,
            borderRadius: small ? 20 : radius,
            borderWidth: 1,
            paddingHorizontal: small ? 22 : 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ThemedText
            color={t => t.text.primary}
            style={{ fontFamily: fonts.bold, fontSize: small ? 14 : 15 }}
          >
            {label}
          </ThemedText>
        </ThemedView>
      </Animated.View>
    </Pressable>
  );
}
