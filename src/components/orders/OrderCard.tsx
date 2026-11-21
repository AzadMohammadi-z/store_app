import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Divider from '../common/Divider';
import GlassCard from '../common/GlassCard';
import GradientButton from '../common/GradientButton';
import ProgressBar from '../common/ProgressBar';
import TintedButton from '../common/TintedButton';
import { STATUS_META } from '../account/orderStatus';
import StatusPill from './StatusPill';
import type { Order, OrderPackage } from '../../orders/types';
import { fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import { ThemedText } from '../../theme/themed';
import { formatPrice, toFaDigits } from '../../utils/format';
import StoreAvatar from '../common/StoreAvatar';

const pad = (n: number) => String(n).padStart(2, '0');

/** مهلت پرداخت؛ هر ۳۰ ثانیه به‌روز می‌شود */
function Deadline({ expiresAt }: { expiresAt: number }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  const left = Math.max(0, expiresAt - now);
  const hours = Math.floor(left / 3600000);
  const minutes = Math.floor((left % 3600000) / 60000);

  return (
    <ThemedText
      color={t => t.text.secondary}
      style={{ fontFamily: fonts.regular, fontSize: 13 }}
    >
      مهلت پرداخت: {toFaDigits(`${pad(hours)}:${pad(minutes)}`)} ساعت
    </ThemedText>
  );
}

function PackageRow({
  pkg,
  withProgress,
}: {
  pkg: OrderPackage;
  withProgress: boolean;
}) {
  const meta = STATUS_META[pkg.status];
  const delivered = pkg.status === 'delivered';

  return (
    <View style={{ gap: 12 }}>
      <View
        style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 12 }}
      >
        <StoreAvatar size={52} from={pkg.from} to={pkg.to} />

        <View style={{ flex: 1, alignItems: 'flex-end', gap: 2 }}>
          <ThemedText
            color={t => t.text.primary}
            numberOfLines={1}
            style={{ fontFamily: fonts.bold, fontSize: 15, textAlign: 'right' }}
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

        {withProgress ? (
          <StatusPill label={meta.label} tone={meta.tone} />
        ) : null}
      </View>

      {withProgress ? (
        <ProgressBar
          progress={meta.progress}
          from={delivered ? '#34D399' : '#38BDF8'}
          to={delivered ? '#10B981' : '#A78BFA'}
        />
      ) : null}
    </View>
  );
}

type Props = {
  order: Order;
  index: number;
  onPay: (order: Order) => void;
  onDetails: (order: Order) => void;
  onReview: (order: Order) => void;
};

export default function OrderCard({
  order,
  index,
  onPay,
  onDetails,
  onReview,
}: Props) {
  const { theme } = useTheme();
  const withProgress =
    order.state === 'processing' || order.state === 'delivered';

  const pill =
    order.state === 'pending'
      ? { label: 'در انتظار پرداخت', tone: 'amber' as const }
      : order.state === 'cancelled'
      ? { label: 'لغو شد', tone: 'red' as const }
      : {
          label: `${toFaDigits(String(order.packages.length))} بسته`,
          tone: 'purple' as const,
        };

  return (
    <Animated.View
      entering={FadeInDown.delay(Math.min(index, 5) * 70).duration(400)}
    >
      <GlassCard style={{ padding: 18, gap: 14 }}>
        {/* سرتیتر: شماره و تاریخ (راست)، وضعیت کلی (چپ) */}
        <View
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ alignItems: 'flex-end', gap: 4 }}>
            <ThemedText
              color={t => t.text.primary}
              style={{ fontFamily: fonts.bold, fontSize: 17 }}
            >
              سفارش {toFaDigits(order.number)}
            </ThemedText>
            <ThemedText
              color={t => t.text.secondary}
              style={{ fontFamily: fonts.regular, fontSize: 13 }}
            >
              {order.date}
            </ThemedText>
          </View>

          <StatusPill label={pill.label} tone={pill.tone} />
        </View>

        <Divider />

        {order.packages.map(pkg => (
          <PackageRow key={pkg.id} pkg={pkg} withProgress={withProgress} />
        ))}

        {/* مبلغ */}
        <View
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {order.state === 'pending' && order.paymentExpiresAt ? (
            <Deadline expiresAt={order.paymentExpiresAt} />
          ) : (
            <ThemedText
              color={t => t.text.secondary}
              style={{ fontFamily: fonts.regular, fontSize: 13 }}
            >
              جمع سفارش
            </ThemedText>
          )}

          <ThemedText
            color={t => t.text.primary}
            style={{ fontFamily: fonts.bold, fontSize: 17 }}
          >
            {formatPrice(order.total)} تومان
          </ThemedText>
        </View>

        {/* دکمه */}
        {order.state === 'pending' ? (
          <GradientButton
            label="پرداخت سفارش"
            onPress={() => onPay(order)}
            from={theme.auth.buttonFrom}
            to={theme.auth.buttonTo}
            glow={theme.auth.glow}
            height={54}
            radius={27}
          />
        ) : order.state === 'processing' ? (
          <TintedButton
            label="جزئیات و پیگیری"
            onPress={() => onDetails(order)}
          />
        ) : order.state === 'delivered' ? (
          <TintedButton
            label="ثبت نظر و جزئیات"
            onPress={() => onReview(order)}
          />
        ) : null}
      </GlassCard>
    </Animated.View>
  );
}
