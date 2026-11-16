import React, { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Divider from '../common/Divider';
import GlassCard from '../common/GlassCard';
import GradientBox from '../common/GradientBox';
import { STATUS_META, type OrderStatus } from './orderStatus';
import { fonts } from '../../theme/fonts';
import { ThemedText, ThemedView } from '../../theme/themed';
import { toFaDigits } from '../../utils/format';

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

/** نوار پیشرفت: از راست پر می‌شود */
function ProgressBar({ progress }: { progress: number }) {
  const [trackW, setTrackW] = useState(0);
  const p = useSharedValue(0);

  useEffect(() => {
    p.value = withTiming(progress, {
      duration: 700,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress, p]);

  // گرادیان با عرض کامل و ثابت کشیده می‌شود؛ فقط کوچک می‌شود و به راست می‌چسبد
  const fill = useAnimatedStyle(() => ({
    transform: [
      { translateX: (trackW / 2) * (1 - p.value) },
      { scaleX: Math.max(p.value, 0.0001) },
    ],
  }));

  return (
    <ThemedView
      bg={t => t.account.track}
      onLayout={e => setTrackW(e.nativeEvent.layout.width)}
      style={{ height: 6, borderRadius: 3, overflow: 'hidden' }}
    >
      {trackW > 0 ? (
        <Animated.View style={[{ width: trackW, height: 6 }, fill]}>
          <GradientBox
            from="#7C3AED"
            to="#22C1EE"
            horizontal
            style={{ flex: 1, borderRadius: 3 }}
          />
        </Animated.View>
      ) : null}
    </ThemedView>
  );
}

function StatusPill({ status }: { status: OrderStatus }) {
  const meta = STATUS_META[status];
  return (
    <ThemedView
      key={status}
      bg={t => t.tones[meta.tone].bg}
      style={{ paddingHorizontal: 14, paddingVertical: 7, borderRadius: 14 }}
    >
      <ThemedText
        color={t => t.tones[meta.tone].icon}
        style={{ fontFamily: fonts.bold, fontSize: 12 }}
      >
        {meta.label}
      </ThemedText>
    </ThemedView>
  );
}

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

        <ThemedView
          bg={t => t.auth.badgeBackground}
          border={t => t.auth.badgeBorder}
          style={{
            paddingHorizontal: 14,
            paddingVertical: 6,
            borderRadius: 14,
            borderWidth: 1,
          }}
        >
          <ThemedText
            color={t => t.auth.badgeText}
            style={{ fontFamily: fonts.bold, fontSize: 12 }}
          >
            {toFaDigits(String(order.packages.length))} بسته
          </ThemedText>
        </ThemedView>
      </View>

      <Divider />

      {/* بسته‌ها */}
      {order.packages.map(pkg => (
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
              <GradientBox
                from={pkg.from ?? '#818CF8'}
                to={pkg.to ?? '#A78BFA'}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  borderWidth: 2,
                  borderColor: 'rgba(255,255,255,0.35)',
                }}
              />
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

            <StatusPill status={pkg.status} />
          </View>

          <ProgressBar progress={STATUS_META[pkg.status].progress} />
        </View>
      ))}

      {/* دکمه‌ی پیگیری */}
      <Pressable
        onPress={onTrack}
        accessibilityRole="button"
        accessibilityLabel="پیگیری سفارش"
      >
        <ThemedView
          bg={t => t.account.trackButtonBackground}
          border={t => t.account.trackButtonBorder}
          style={{
            height: 52,
            borderRadius: 18,
            borderWidth: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ThemedText
            color={t => t.text.primary}
            style={{ fontFamily: fonts.bold, fontSize: 15 }}
          >
            پیگیری سفارش
          </ThemedText>
        </ThemedView>
      </Pressable>
    </GlassCard>
  );
}
