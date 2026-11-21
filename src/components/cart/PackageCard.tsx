import React from 'react';
import { View } from 'react-native';
import Animated, {
  FadeInDown,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';
import Divider from '../common/Divider';
import CartItemRow from './CartItemRow';
import InfoRow from './InfoRow';
import type { CartGroup } from '../../cart/CartProvider';
import { fonts } from '../../theme/fonts';
import { ThemedText, ThemedView } from '../../theme/themed';
import { formatPrice } from '../../utils/format';
import StatusPill from '../orders/StatusPill';
import StoreAvatar from '../common/StoreAvatar';

const ORDINALS = [
  'اول',
  'دوم',
  'سوم',
  'چهارم',
  'پنجم',
  'ششم',
  'هفتم',
  'هشتم',
  'نهم',
  'دهم',
];

type Props = {
  group: CartGroup;
  index: number;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onRemove: (id: string) => void;
};

export default function PackageCard({
  group,
  index,
  onIncrement,
  onDecrement,
  onRemove,
}: Props) {
  const { store, lines } = group;
  const ordinal = ORDINALS[index] ?? String(index + 1);

  return (
    <Animated.View
      layout={LinearTransition}
      entering={FadeInDown.delay(Math.min(index, 4) * 80).duration(400)}
      exiting={FadeOut.duration(200)}
    >
      <ThemedView
        bg={t => t.card.background}
        border={t => t.card.border}
        style={{ borderWidth: 1, borderRadius: 28, padding: 16, gap: 14 }}
      >
        {/* سرتیتر: فروشگاه (راست) و نشان بسته (چپ) */}
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
              gap: 12,
            }}
          >
            <StoreAvatar size={48} from={store.from} to={store.to} />
            <View style={{ alignItems: 'flex-end', gap: 2 }}>
              <ThemedText
                color={t => t.text.primary}
                numberOfLines={1}
                style={{
                  fontFamily: fonts.bold,
                  fontSize: 16,
                  textAlign: 'right',
                }}
              >
                {store.name}
              </ThemedText>
              {store.city ? (
                <ThemedText
                  color={t => t.text.secondary}
                  style={{
                    fontFamily: fonts.regular,
                    fontSize: 12,
                    textAlign: 'right',
                  }}
                >
                  ارسال از {store.city}
                </ThemedText>
              ) : null}
            </View>
          </View>
          <StatusPill label={`بسته ${ordinal}`} tone="purple" />
        </View>

        <Divider />

        {/* کالاها */}
        {lines.map((line, i) => (
          <View key={line.id} style={{ gap: 14 }}>
            {i > 0 ? <Divider /> : null}
            <CartItemRow
              line={line}
              onIncrement={() => onIncrement(line.id)}
              onDecrement={() => onDecrement(line.id)}
              onRemove={() => onRemove(line.id)}
            />
          </View>
        ))}

        <Divider />

        {/* ارسال */}
        <View style={{ gap: 10 }}>
          <InfoRow
            label="هزینه ارسال این بسته"
            value={`${formatPrice(store.shippingCost)} تومان`}
          />
          <InfoRow label="زمان تقریبی ارسال" value={store.eta} />
        </View>

        <Divider dashed />

        <InfoRow
          strong
          big
          label="جمع این فروشگاه"
          value={`${formatPrice(group.total)} تومان`}
        />
      </ThemedView>
    </Animated.View>
  );
}
