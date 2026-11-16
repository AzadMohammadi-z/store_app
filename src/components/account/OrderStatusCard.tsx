import React from 'react';
import { Pressable, View } from 'react-native';
import { CircleCheck, Package, Truck, Wallet } from 'lucide-react-native';
import CountBadge from '../common/CountBadge';
import GlassCard from '../common/GlassCard';
import IconTile, { type Tone } from './IconTile';
import type { OrderStatus } from './orderStatus';
import { fonts } from '../../theme/fonts';
import { ThemedText } from '../../theme/themed';

const ITEMS: {
  status: OrderStatus;
  label: string;
  Icon: React.ComponentType<any>;
  tone: Tone;
}[] = [
  { status: 'pending', label: 'در انتظار پرداخت', Icon: Wallet, tone: 'blue' },
  {
    status: 'preparing',
    label: 'در حال آماده‌سازی',
    Icon: Package,
    tone: 'purple',
  },
  { status: 'shipped', label: 'ارسال‌شده', Icon: Truck, tone: 'teal' },
  { status: 'delivered', label: 'تحویل‌شده', Icon: CircleCheck, tone: 'red' },
];

type Props = {
  counts: Record<OrderStatus, number>;
  onPressAll: () => void;
  onPressStatus: (status: OrderStatus) => void;
};

export default function OrderStatusCard({
  counts,
  onPressAll,
  onPressStatus,
}: Props) {
  return (
    <GlassCard style={{ padding: 18, gap: 18 }}>
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
          سفارش‌های من
        </ThemedText>
        <Pressable onPress={onPressAll} hitSlop={10} accessibilityRole="button">
          <ThemedText
            color={t => t.auth.link}
            style={{ fontFamily: fonts.medium, fontSize: 13 }}
          >
            همه سفارش‌ها
          </ThemedText>
        </Pressable>
      </View>

      {/* راست به چپ: اولین وضعیت سمت راست */}
      <View style={{ flexDirection: 'row-reverse' }}>
        {ITEMS.map(({ status, label, Icon, tone }) => (
          <Pressable
            key={status}
            onPress={() => onPressStatus(status)}
            accessibilityRole="button"
            accessibilityLabel={label}
            style={{ flex: 1, alignItems: 'center', gap: 8 }}
          >
            <View>
              <IconTile Icon={Icon} tone={tone} size={52} iconSize={24} />
              <View style={{ position: 'absolute', top: -8, left: -8 }}>
                <CountBadge count={counts[status]} />
              </View>
            </View>
            <ThemedText
              color={t => t.text.primary}
              numberOfLines={2}
              style={{
                fontFamily: fonts.medium,
                fontSize: 12,
                lineHeight: 18,
                textAlign: 'center',
                paddingHorizontal: 2,
              }}
            >
              {label}
            </ThemedText>
          </Pressable>
        ))}
      </View>
    </GlassCard>
  );
}
