import React, { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Contrast, Moon, Sun, SunMoon } from 'lucide-react-native';
import IconTile from './IconTile';
import { fonts } from '../../theme/fonts';
import { type ThemePreference, useTheme } from '../../theme/ThemeProvider';
import { ThemedText, ThemedView } from '../../theme/themed';

const PAD = 4;
const BORDER = 1;

// چپ به راست: خودکار، تیره، روشن (در طراحی خودکار سمت چپ است)
const OPTIONS: {
  value: ThemePreference;
  label: string;
  Icon: React.ComponentType<any>;
}[] = [
  { value: 'system', label: 'خودکار', Icon: SunMoon },
  { value: 'dark', label: 'تیره', Icon: Moon },
  { value: 'light', label: 'روشن', Icon: Sun },
];

function Switch() {
  const { preference, setPreference, theme } = useTheme();
  const [width, setWidth] = useState(0);
  const segW = width > 0 ? (width - (PAD + BORDER) * 2) / OPTIONS.length : 0;
  const index = Math.max(
    0,
    OPTIONS.findIndex(o => o.value === preference),
  );

  const x = useSharedValue(0);
  const ready = useRef(false);

  useEffect(() => {
    if (!segW) return;
    const target = index * segW;
    if (!ready.current) {
      x.value = target;
      ready.current = true;
      return;
    }
    x.value = withSpring(target, { damping: 20, stiffness: 220, mass: 0.7 });
  }, [index, segW, x]);

  const pillStyle = useAnimatedStyle(() => ({
    width: segW,
    opacity: segW > 0 ? 1 : 0,
    transform: [{ translateX: x.value }],
  }));

  return (
    <ThemedView
      bg={t => t.account.segmentTrack}
      border={t => t.account.segmentBorder}
      onLayout={e => setWidth(e.nativeEvent.layout.width)}
      style={{
        height: 52,
        borderRadius: 20,
        borderWidth: BORDER,
        padding: PAD,
        flexDirection: 'row',
        direction: 'ltr',
      }}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          { position: 'absolute', top: PAD, left: PAD, bottom: PAD },
          pillStyle,
        ]}
      >
        <ThemedView
          bg={t => t.account.segmentSelected}
          border={t => t.account.segmentSelectedBorder}
          style={{ flex: 1, borderRadius: 16, borderWidth: 1 }}
        />
      </Animated.View>

      {OPTIONS.map(({ value, label, Icon }) => {
        const selected = value === preference;
        const color = selected ? theme.text.primary : theme.text.secondary;
        return (
          <Pressable
            key={value}
            onPress={() => setPreference(value)}
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityState={{ selected }}
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <Icon size={16} color={color} strokeWidth={2.2} />
            <Text
              style={{
                color,
                fontFamily: selected ? fonts.bold : fonts.medium,
                fontSize: 14,
              }}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </ThemedView>
  );
}

/** بخش «ظاهر برنامه»: عنوان و کلید سه‌حالته */
export default function AppearanceSection() {
  return (
    <View style={{ padding: 16, gap: 14 }}>
      <View
        style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 14 }}
      >
        <IconTile Icon={Contrast} tone="blue" size={40} iconSize={20} />
        <ThemedText
          color={t => t.text.primary}
          style={{ fontFamily: fonts.bold, fontSize: 15 }}
        >
          ظاهر برنامه
        </ThemedText>
      </View>
      <Switch />
    </View>
  );
}
