import React from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Minus, Plus } from 'lucide-react-native';
import { fonts } from '../../theme/fonts';
import {
  type ColorPick,
  ThemedIcon,
  ThemedText,
  ThemedView,
} from '../../theme/themed';
import { toFaDigits } from '../../utils/format';

type StepProps = {
  Icon: React.ComponentType<any>;
  pick: ColorPick;
  label: string;
  disabled?: boolean;
  onPress: () => void;
};

function StepButton({
  Icon,
  pick,
  label,
  disabled = false,
  onPress,
}: StepProps) {
  const press = useSharedValue(0);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - press.value * 0.2 }],
  }));

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={6}
      onPressIn={() => {
        press.value = withSpring(1, { damping: 16, stiffness: 320 });
      }}
      onPressOut={() => {
        press.value = withSpring(0, { damping: 10, stiffness: 260 });
      }}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
    >
      <Animated.View
        style={[
          {
            width: 36,
            height: 44,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: disabled ? 0.35 : 1,
          },
          style,
        ]}
      >
        <ThemedIcon Icon={Icon} size={18} strokeWidth={2.6} color={pick} />
      </Animated.View>
    </Pressable>
  );
}

type Props = {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
};

export default function QuantityStepper({
  quantity,
  onIncrement,
  onDecrement,
}: Props) {
  return (
    <ThemedView
      bg={t => t.auth.codeBackground}
      border={t => t.auth.codeBorder}
      style={{
        height: 44,
        borderRadius: 16,
        borderWidth: 1,
        flexDirection: 'row',
        direction: 'ltr', // کم (چپ)، عدد، زیاد (راست)
        alignItems: 'center',
        paddingHorizontal: 4,
      }}
    >
      <StepButton
        Icon={Minus}
        pick={t => t.text.secondary}
        label="کم کردن"
        disabled={quantity <= 1}
        onPress={onDecrement}
      />

      <View style={{ minWidth: 26, alignItems: 'center' }}>
        <Animated.View key={quantity} entering={ZoomIn.duration(120)}>
          <ThemedText
            color={t => t.text.primary}
            style={{ fontFamily: fonts.bold, fontSize: 15 }}
          >
            {toFaDigits(String(quantity))}
          </ThemedText>
        </Animated.View>
      </View>

      <StepButton
        Icon={Plus}
        pick={t => t.auth.link}
        label="افزودن"
        onPress={onIncrement}
      />
    </ThemedView>
  );
}
