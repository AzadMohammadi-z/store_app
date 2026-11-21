import React, { useEffect, useRef } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { ThemedIcon, ThemedView } from '../../theme/themed';

type Props = {
  Icon: React.ComponentType<any>;
  onPress: () => void;
  label: string;
  /** حالت فعال (مثل قلب علاقه‌مندی): آیکون پر و رنگی می‌شود */
  active?: boolean;
  activeColor?: string;
};

export default function SquareButton({
  Icon,
  onPress,
  label,
  active = false,
  activeColor = '#F43F5E',
}: Props) {
  const pop = useSharedValue(1);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    pop.value = withSequence(
      withTiming(1.25, { duration: 110 }),
      withSpring(1, { damping: 8, stiffness: 260 }),
    );
  }, [active, pop]);

  const popStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pop.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
    >
      <ThemedView
        bg={t => t.auth.skipBackground}
        border={t => t.auth.skipBorder}
        style={{
          width: 44,
          height: 44,
          borderRadius: 14,
          borderWidth: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Animated.View style={popStyle}>
          {active ? (
            <Icon
              size={20}
              color={activeColor}
              fill={activeColor}
              strokeWidth={2}
            />
          ) : (
            <ThemedIcon
              Icon={Icon}
              size={20}
              strokeWidth={2}
              color={t => t.text.primary}
            />
          )}
        </Animated.View>
      </ThemedView>
    </Pressable>
  );
}
