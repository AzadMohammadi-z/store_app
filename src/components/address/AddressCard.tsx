import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeInDown,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { MapPin } from 'lucide-react-native';
import IconTile from '../account/IconTile';
import Divider from '../common/Divider';
import GlassCard from '../common/GlassCard';
import StatusPill from '../orders/StatusPill';
import type { Address } from '../../address/AddressProvider';
import { fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import { ThemedText, ThemedView } from '../../theme/themed';
import { groupIranMobile, toFaDigits } from '../../utils/format';

type Props = {
  address: Address;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
};

export default function AddressCard({
  address,
  index,
  onEdit,
  onDelete,
  onSetDefault,
}: Props) {
  const { theme } = useTheme();
  const def = useSharedValue(address.isDefault ? 1 : 0);

  useEffect(() => {
    def.value = withTiming(address.isDefault ? 1 : 0, { duration: 250 });
  }, [address.isDefault, def]);

  const highlight = useAnimatedStyle(() => ({ opacity: def.value }));

  // فاصله‌ی ناشکن تا شماره در متن راست‌به‌چپ برعکس نشود
  const phone = toFaDigits(`0${groupIranMobile(address.phone)}`).replace(
    / /g,
    '\u00A0',
  );

  return (
    <Animated.View
      layout={LinearTransition}
      entering={FadeInDown.delay(Math.min(index, 5) * 70).duration(400)}
      exiting={FadeOut.duration(200)}
    >
      <GlassCard style={{ padding: 18, gap: 14 }}>
        {/* سرتیتر: کاشی و عنوان (راست)، نشان پیش‌فرض (چپ) */}
        <View
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <IconTile Icon={MapPin} tone={address.tone} size={44} iconSize={22} />
          <ThemedText
            color={t => t.text.primary}
            numberOfLines={1}
            style={{
              flex: 1,
              fontFamily: fonts.bold,
              fontSize: 17,
              textAlign: 'right',
            }}
          >
            {address.title}
          </ThemedText>
          {address.isDefault ? (
            <StatusPill label="پیش‌فرض" tone="purple" />
          ) : null}
        </View>

        {/* مشخصات */}
        <View style={{ gap: 6 }}>
          <ThemedText
            color={t => t.text.secondary}
            style={{
              fontFamily: fonts.regular,
              fontSize: 14,
              lineHeight: 26,
              textAlign: 'right',
            }}
          >
            <Text style={{ color: theme.text.primary, fontFamily: fonts.bold }}>
              {address.name}
            </Text>
            {' · '}
            {phone}
          </ThemedText>
          <ThemedText
            color={t => t.text.secondary}
            style={{
              fontFamily: fonts.regular,
              fontSize: 14,
              lineHeight: 26,
              textAlign: 'right',
              writingDirection: 'rtl',
            }}
          >
            {address.province}، {address.city}، {address.address}
          </ThemedText>
          <ThemedText
            color={t => t.text.secondary}
            style={{
              fontFamily: fonts.regular,
              fontSize: 14,
              lineHeight: 26,
              textAlign: 'right',
            }}
          >
            کد پستی: {toFaDigits(address.postal)}
          </ThemedText>
        </View>

        <Divider />

        {/* عملیات */}
        <View
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              gap: 22,
            }}
          >
            <Pressable onPress={onEdit} hitSlop={10} accessibilityRole="button">
              <ThemedText
                color={t => t.auth.link}
                style={{ fontFamily: fonts.medium, fontSize: 15 }}
              >
                ویرایش
              </ThemedText>
            </Pressable>
            <Pressable
              onPress={onDelete}
              hitSlop={10}
              accessibilityRole="button"
            >
              <ThemedText
                color={t => t.form.error}
                style={{ fontFamily: fonts.medium, fontSize: 15 }}
              >
                حذف
              </ThemedText>
            </Pressable>
          </View>

          {!address.isDefault ? (
            <Pressable
              onPress={onSetDefault}
              hitSlop={10}
              accessibilityRole="button"
            >
              <ThemedText
                color={t => t.text.secondary}
                style={{ fontFamily: fonts.regular, fontSize: 14 }}
              >
                انتخاب به‌عنوان پیش‌فرض
              </ThemedText>
            </Pressable>
          ) : null}
        </View>

        {/* حاشیه‌ی بنفش کارت پیش‌فرض */}
        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, highlight]}
        >
          <ThemedView
            border={t => t.auth.badgeBorder}
            style={{ flex: 1, borderRadius: 28, borderWidth: 1.5 }}
          />
        </Animated.View>
      </GlassCard>
    </Animated.View>
  );
}
