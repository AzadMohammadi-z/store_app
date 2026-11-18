import React from 'react';
import { Pressable, View } from 'react-native';
import { useCart } from '../../cart/CartProvider';
import InfoRow from '../cart/InfoRow';
import Divider from '../common/Divider';
import GlassCard from '../common/GlassCard';
import GradientBox from '../common/GradientBox';
import { fonts } from '../../theme/fonts';
import { ThemedText } from '../../theme/themed';
import { formatPrice, toFaDigits } from '../../utils/format';

export default function CheckoutSummary({
  onEditCart,
}: {
  onEditCart: () => void;
}) {
  const cart = useCart();

  return (
    <GlassCard style={{ padding: 18, gap: 14 }}>
      <View
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <ThemedText
          color={t => t.text.primary}
          style={{ fontFamily: fonts.bold, fontSize: 18 }}
        >
          خلاصه سفارش
        </ThemedText>
        <Pressable onPress={onEditCart} hitSlop={10} accessibilityRole="button">
          <ThemedText
            color={t => t.auth.link}
            style={{ fontFamily: fonts.medium, fontSize: 13 }}
          >
            ویرایش سبد
          </ThemedText>
        </Pressable>
      </View>

      {cart.groups.map(group => {
        const count = group.lines.reduce((sum, l) => sum + l.quantity, 0);
        return (
          <View
            key={group.store.id}
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <GradientBox
              from={group.store.from ?? '#818CF8'}
              to={group.store.to ?? '#A78BFA'}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                borderWidth: 2,
                borderColor: 'rgba(255,255,255,0.35)',
              }}
            />

            <View style={{ flex: 1, alignItems: 'flex-end', gap: 2 }}>
              <ThemedText
                color={t => t.text.primary}
                numberOfLines={1}
                style={{
                  fontFamily: fonts.bold,
                  fontSize: 15,
                  textAlign: 'right',
                }}
              >
                {group.store.name}
              </ThemedText>
              <ThemedText
                color={t => t.text.secondary}
                style={{
                  fontFamily: fonts.regular,
                  fontSize: 12,
                  textAlign: 'right',
                }}
              >
                {toFaDigits(String(count))} کالا · ارسال{' '}
                {formatPrice(group.store.shippingCost)}
              </ThemedText>
            </View>

            <ThemedText
              color={t => t.text.primary}
              style={{ fontFamily: fonts.bold, fontSize: 15 }}
            >
              {formatPrice(group.total)}
            </ThemedText>
          </View>
        );
      })}

      <Divider />

      <View style={{ gap: 12 }}>
        <InfoRow
          label={`جمع کالاها (${toFaDigits(String(cart.itemCount))} کالا)`}
          value={`${formatPrice(cart.itemsTotal)} تومان`}
        />
        <InfoRow
          label={`هزینه ارسال (${toFaDigits(String(cart.packageCount))} بسته)`}
          value={`${formatPrice(cart.shippingTotal)} تومان`}
        />
        <InfoRow label="تخفیف" value={`${formatPrice(cart.discount)} تومان`} />
      </View>

      <Divider />

      <InfoRow
        strong
        big
        label="مبلغ قابل پرداخت"
        value={`${formatPrice(cart.payable)} تومان`}
      />
    </GlassCard>
  );
}
