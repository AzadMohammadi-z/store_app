import React from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ChevronLeft, Tag } from 'lucide-react-native';
import Divider from '../common/Divider';
import GradientButton from '../common/GradientButton';
import InfoRow from './InfoRow';
import { fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import { ThemedIcon, ThemedText, ThemedView } from '../../theme/themed';
import { formatPrice, toFaDigits } from '../../utils/format';

/* ----------------------------- ردیف کد تخفیف ----------------------------- */

export function DiscountRow({ onPress }: { onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="کد تخفیف دارید؟"
    >
      <ThemedView
        bg={t => t.card.background}
        border={t => t.card.border}
        style={{
          height: 64,
          borderRadius: 22,
          borderWidth: 1,
          paddingHorizontal: 18,
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <ThemedIcon
            Icon={Tag}
            size={22}
            strokeWidth={2}
            color={t => t.auth.link}
          />
          <ThemedText
            color={t => t.text.primary}
            style={{ fontFamily: fonts.bold, fontSize: 15 }}
          >
            کد تخفیف دارید؟
          </ThemedText>
        </View>
        <ThemedIcon
          Icon={ChevronLeft}
          size={20}
          strokeWidth={2.2}
          color={t => t.text.secondary}
        />
      </ThemedView>
    </Pressable>
  );
}

/* --------------------------- کارت خلاصه‌ی پرداخت --------------------------- */

type Props = {
  itemCount: number;
  packageCount: number;
  itemsTotal: number;
  shippingTotal: number;
  discount: number;
  payable: number;
  onCheckout: () => void;
};

export default function CartSummary({
  itemCount,
  packageCount,
  itemsTotal,
  shippingTotal,
  discount,
  payable,
  onCheckout,
}: Props) {
  const { theme } = useTheme();

  return (
    <Animated.View entering={FadeInDown.delay(200).duration(400)}>
      <ThemedView
        bg={t => t.card.background}
        border={t => t.card.border}
        style={{ borderWidth: 1, borderRadius: 28, padding: 20, gap: 14 }}
      >
        <InfoRow
          label={`جمع کالاها (${toFaDigits(String(itemCount))} کالا)`}
          value={`${formatPrice(itemsTotal)} تومان`}
        />
        <InfoRow
          label={`هزینه ارسال (${toFaDigits(String(packageCount))} بسته)`}
          value={`${formatPrice(shippingTotal)} تومان`}
        />
        <InfoRow label="تخفیف" value={`${formatPrice(discount)} تومان`} />

        <Divider />

        <InfoRow
          strong
          big
          label="مبلغ قابل پرداخت"
          value={`${formatPrice(payable)} تومان`}
        />

        <GradientButton
          label="ادامه و پرداخت"
          onPress={onCheckout}
          from={theme.auth.buttonFrom}
          to={theme.auth.buttonTo}
          glow={theme.auth.glow}
        />
      </ThemedView>
    </Animated.View>
  );
}
