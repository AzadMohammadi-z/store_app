import React from 'react';
import { Pressable, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import CountBadge from '../common/CountBadge';
import Divider from '../common/Divider';
import GlassCard from '../common/GlassCard';
import IconTile, { type Tone } from './IconTile';
import { fonts } from '../../theme/fonts';
import { ThemedIcon, ThemedText } from '../../theme/themed';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export type MenuItem = {
  id: string;
  label: string;
  Icon: React.ComponentType<any>;
  tone: Tone;
  /** نشان تعداد (اختیاری) */
  badge?: number;
  onPress?: () => void;
};

/** فقط ردیف‌ها با خط جداکننده (بدون کارت)، برای ترکیب در کارت‌های دیگر */
function MenuRow({ item }: { item: MenuItem }) {
  const press = useSharedValue(0);
  const pressStyle = useAnimatedStyle(() => ({
    opacity: 1 - press.value * 0.4,
  }));

  return (
    <Pressable
      onPress={item.onPress}
      onPressIn={() => {
        press.value = withTiming(1, { duration: 80 });
      }}
      onPressOut={() => {
        press.value = withTiming(0, { duration: 160 });
      }}
      accessibilityRole="button"
    >
      <Animated.View
        style={[
          {
            height: 64,
            paddingHorizontal: 16,
            flexDirection: 'row-reverse',
            alignItems: 'center',
            gap: 14,
          },
          pressStyle,
        ]}
      >
        <IconTile Icon={item.Icon} tone={item.tone} size={40} iconSize={20} />

        <ThemedText
          color={t => t.text.primary}
          style={{
            flex: 1,
            fontFamily: fonts.bold,
            fontSize: 15,
            textAlign: 'right',
          }}
        >
          {item.label}
        </ThemedText>

        {/* چپ‌ترین: فلش، و نشان تعداد سمت راست آن */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <ThemedIcon
            Icon={ChevronLeft}
            size={18}
            strokeWidth={2.2}
            color={t => t.text.secondary}
          />
          {item.badge ? <CountBadge count={item.badge} /> : null}
        </View>
      </Animated.View>
    </Pressable>
  );
}

/** فقط ردیف‌ها با خط جداکننده (بدون کارت)، برای ترکیب در کارت‌های دیگر */
export function MenuRows({ items }: { items: MenuItem[] }) {
  return (
    <>
      {items.map((item, i) => (
        <View key={item.id}>
          {i > 0 ? (
            <View style={{ marginHorizontal: 16 }}>
              <Divider />
            </View>
          ) : null}
          <MenuRow item={item} />
        </View>
      ))}
    </>
  );
}

export default function MenuList({ items }: { items: MenuItem[] }) {
  return (
    <GlassCard style={{ overflow: 'hidden', paddingVertical: 4 }}>
      <MenuRows items={items} />
    </GlassCard>
  );
}
