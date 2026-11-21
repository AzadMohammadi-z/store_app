import React from 'react';
import { View } from 'react-native';
import Divider from '../common/Divider';
import GlassCard from '../common/GlassCard';
import ProgressBar from '../common/ProgressBar';
import TintedButton from '../common/TintedButton';
import StatusPill from '../orders/StatusPill';
import { STATUS_META, type OrderStatus } from './orderStatus';
import { fonts } from '../../theme/fonts';
import { ThemedText } from '../../theme/themed';
import { toFaDigits } from '../../utils/format';
import StoreAvatar from '../common/StoreAvatar';

export type ActiveOrder = {
  number: string;
  packages: {
    id: string;
    storeName: string;
    itemCount: number;
    status: OrderStatus;
    from?: string;
    to?: string;
  }[];
};

type Props = {
  order: ActiveOrder;
  onTrack: () => void;
};

export default function ActiveOrderCard({ order, onTrack }: Props) {
  return (
    <GlassCard style={{ padding: 18, gap: 14 }}>
      {/* سرتیتر */}
      <View
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ alignItems: 'flex-end', gap: 2 }}>
          <ThemedText
            color={t => t.text.secondary}
            style={{ fontFamily: fonts.regular, fontSize: 12 }}
          >
            سفارش فعال
          </ThemedText>
          <ThemedText
            color={t => t.text.primary}
            style={{ fontFamily: fonts.bold, fontSize: 16 }}
          >
            شماره سفارش {toFaDigits(order.number)}
          </ThemedText>
        </View>

        <StatusPill
          label={`${toFaDigits(String(order.packages.length))} بسته`}
          tone="purple"
        />
      </View>

      <Divider />

      {/* بسته‌ها */}
      {order.packages.map(pkg => {
        const meta = STATUS_META[pkg.status];
        return (
          <View key={pkg.id} style={{ gap: 12 }}>
            <View
              style={{
                flexDirection: 'row-reverse',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <View
                style={{
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  gap: 12,
                  flex: 1,
                }}
              >
                <StoreAvatar size={48} from={pkg.from} to={pkg.to} />
                <View style={{ alignItems: 'flex-end', gap: 2, flex: 1 }}>
                  <ThemedText
                    color={t => t.text.primary}
                    numberOfLines={1}
                    style={{
                      fontFamily: fonts.bold,
                      fontSize: 15,
                      textAlign: 'right',
                    }}
                  >
                    {pkg.storeName}
                  </ThemedText>
                  <ThemedText
                    color={t => t.text.secondary}
                    style={{ fontFamily: fonts.regular, fontSize: 13 }}
                  >
                    {toFaDigits(String(pkg.itemCount))} کالا
                  </ThemedText>
                </View>
              </View>

              <StatusPill label={meta.label} tone={meta.tone} />
            </View>

            <ProgressBar progress={meta.progress} from="#7C3AED" to="#22C1EE" />
          </View>
        );
      })}

      <TintedButton
        label="پیگیری سفارش"
        onPress={onTrack}
        height={52}
        radius={18}
      />
    </GlassCard>
  );
}
