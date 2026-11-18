import React, { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import GradientBox from '../common/GradientBox';
import { ThemedView } from '../../theme/themed';

type Props = {
  value: boolean;
  onChange: (value: boolean) => void;
  label: string;
};

export default function ToggleSwitch({ value, onChange, label }: Props) {
  const p = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    p.value = withSpring(value ? 1 : 0, { damping: 18, stiffness: 240 });
  }, [value, p]);

  const knob = useAnimatedStyle(() => ({
    transform: [{ translateX: p.value * 22 }],
  }));
  const onStyle = useAnimatedStyle(() => ({ opacity: p.value }));

  return (
    <Pressable
      onPress={() => onChange(!value)}
      hitSlop={8}
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value }}
    >
      <ThemedView
        bg={t => t.account.segmentTrack}
        border={t => t.account.segmentBorder}
        style={{
          width: 54,
          height: 32,
          borderRadius: 16,
          borderWidth: 1,
          justifyContent: 'center',
          direction: 'ltr',
          overflow: 'hidden',
        }}
      >
        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, onStyle]}
        >
          <GradientBox
            from="#6D2FDB"
            to="#1081BA"
            horizontal
            style={{ flex: 1 }}
          />
        </Animated.View>
        <Animated.View
          style={[
            {
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: '#FFFFFF',
              marginLeft: 3,
            },
            knob,
          ]}
        />
      </ThemedView>
    </Pressable>
  );
}
