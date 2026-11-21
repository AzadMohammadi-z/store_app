import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { Package, RotateCcw, Star, Truck } from 'lucide-react-native';
import IconTile from '../account/IconTile';
import Divider from '../common/Divider';
import GlassCard from '../common/GlassCard';
import StoreAvatar from '../common/StoreAvatar';
import TintedButton from '../common/TintedButton';
import RatingStars from './RatingStars';
import type { ProductDetail } from '../../data/products';
import { fonts } from '../../theme/fonts';
import { ThemedText } from '../../theme/themed';
import { formatRating, toFaDigits } from '../../utils/format';

const GOLD = '#FBBF24';

/* ------------------------------ کارت فروشگاه ------------------------------ */

export function StoreCard({
  store,
  onPress,
}: {
  store: ProductDetail['store'];
  onPress: () => void;
}) {
  return (
    <GlassCard
      style={{
        padding: 16,
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 14,
      }}
    >
      <StoreAvatar size={56} from={store.from} to={store.to} />

      <View style={{ flex: 1, alignItems: 'flex-end', gap: 4 }}>
        <ThemedText
          color={t => t.text.primary}
          numberOfLines={1}
          style={{ fontFamily: fonts.bold, fontSize: 16, textAlign: 'right' }}
        >
          {store.name}
        </ThemedText>
        <View
          style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 6 }}
        >
          <Star size={14} color={GOLD} fill={GOLD} strokeWidth={1.5} />
          <ThemedText
            color={t => t.text.secondary}
            style={{ fontFamily: fonts.regular, fontSize: 13 }}
          >
            {formatRating(store.rating)}
            {store.badge ? ` · ${store.badge}` : ''}
          </ThemedText>
        </View>
      </View>

      <TintedButton small label="مشاهده" onPress={onPress} />
    </GlassCard>
  );
}

/* --------------------------- ارسال و بازگشت --------------------------- */

function InfoItem({
  Icon,
  title,
  text,
}: {
  Icon: React.ComponentType<any>;
  title: string;
  text: string;
}) {
  return (
    <View
      style={{
        flexDirection: 'row-reverse',
        alignItems: 'flex-start',
        gap: 14,
      }}
    >
      <IconTile Icon={Icon} tone="indigo" size={44} iconSize={22} />
      <View style={{ flex: 1, alignItems: 'flex-end', gap: 4, paddingTop: 2 }}>
        <ThemedText
          color={t => t.text.primary}
          style={{ fontFamily: fonts.bold, fontSize: 15, textAlign: 'right' }}
        >
          {title}
        </ThemedText>
        <ThemedText
          color={t => t.text.secondary}
          style={{
            fontFamily: fonts.regular,
            fontSize: 13,
            lineHeight: 22,
            textAlign: 'right',
            writingDirection: 'rtl',
          }}
        >
          {text}
        </ThemedText>
      </View>
    </View>
  );
}

export function ShippingCard({ product }: { product: ProductDetail }) {
  return (
    <GlassCard style={{ padding: 18, gap: 18 }}>
      <ThemedText
        color={t => t.text.primary}
        style={{ fontFamily: fonts.bold, fontSize: 17, textAlign: 'right' }}
      >
        ارسال و بازگشت
      </ThemedText>

      <InfoItem
        Icon={Truck}
        title={`ارسال از ${product.shipping.fromCity}`}
        text={`زمان تقریبی ارسال: ${product.shipping.eta}`}
      />
      <InfoItem
        Icon={Package}
        title="بسته‌ی جداگانه"
        text={`این کالا در یک بسته‌ی مستقل از ${product.store.name} ارسال می‌شود.`}
      />
      <InfoItem Icon={RotateCcw} title="مرجوعی" text={product.returnPolicy} />
    </GlassCard>
  );
}

/* ------------------------- توضیحات و مشخصات ------------------------- */

export function DescriptionCard({
  description,
  specs,
}: {
  description: string;
  specs: ProductDetail['specs'];
}) {
  const [expanded, setExpanded] = useState(false);
  const long = description.length > 120;

  return (
    <Animated.View layout={LinearTransition}>
      <GlassCard style={{ padding: 18, gap: 14 }}>
        <ThemedText
          color={t => t.text.primary}
          style={{ fontFamily: fonts.bold, fontSize: 17, textAlign: 'right' }}
        >
          توضیحات
        </ThemedText>

        <ThemedText
          color={t => t.text.secondary}
          numberOfLines={expanded ? undefined : 3}
          style={{
            fontFamily: fonts.regular,
            fontSize: 14,
            lineHeight: 28,
            textAlign: 'right',
            writingDirection: 'rtl',
          }}
        >
          {description}
        </ThemedText>

        {long ? (
          <Pressable
            onPress={() => setExpanded(e => !e)}
            hitSlop={10}
            accessibilityRole="button"
            style={{ alignSelf: 'flex-end' }}
          >
            <ThemedText
              color={t => t.auth.link}
              style={{ fontFamily: fonts.bold, fontSize: 14 }}
            >
              {expanded ? 'بستن' : 'ادامه'}
            </ThemedText>
          </Pressable>
        ) : null}

        {specs.map(spec => (
          <View key={spec.label} style={{ gap: 12 }}>
            <Divider />
            <View
              style={{
                flexDirection: 'row-reverse',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <ThemedText
                color={t => t.text.secondary}
                style={{ fontFamily: fonts.regular, fontSize: 14 }}
              >
                {spec.label}
              </ThemedText>
              <ThemedText
                color={t => t.text.primary}
                style={{ fontFamily: fonts.bold, fontSize: 14 }}
              >
                {spec.value}
              </ThemedText>
            </View>
          </View>
        ))}
      </GlassCard>
    </Animated.View>
  );
}

/* --------------------------- خلاصه‌ی نظرها --------------------------- */

export function ReviewsSummary({
  rating,
  count,
  onPressAll,
}: {
  rating: number;
  count: number;
  onPressAll: () => void;
}) {
  return (
    <GlassCard
      style={{
        padding: 18,
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 14,
      }}
    >
      <ThemedText
        color={t => t.text.primary}
        style={{ fontFamily: fonts.extrabold, fontSize: 44 }}
      >
        {formatRating(rating)}
      </ThemedText>

      <View style={{ alignItems: 'flex-end', gap: 6 }}>
        <RatingStars rating={rating} size={13} />
        <ThemedText
          color={t => t.text.secondary}
          style={{ fontFamily: fonts.regular, fontSize: 13 }}
        >
          از {toFaDigits(String(count))} نظر
        </ThemedText>
      </View>

      <View style={{ flex: 1 }} />

      <TintedButton small label="همه‌ی نظرها" onPress={onPressAll} />
    </GlassCard>
  );
}
