import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';
import { Trash2 } from 'lucide-react-native';
import GradientBox from '../common/GradientBox';
import QuantityStepper from './QuantityStepper';
import type { CartLine } from '../../cart/CartProvider';
import { fonts } from '../../theme/fonts';
import { ThemedIcon, ThemedText } from '../../theme/themed';
import { formatPrice } from '../../utils/format';

const THUMB = 92;

type Props = {
  line: CartLine;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
};

export default function CartItemRow({
  line,
  onIncrement,
  onDecrement,
  onRemove,
}: Props) {
  return (
    <Animated.View
      layout={LinearTransition}
      entering={FadeIn.duration(250)}
      exiting={FadeOut.duration(180)}
      style={{ flexDirection: 'row-reverse', gap: 12 }}
    >
      {/* عکس (سمت راست) */}
      <GradientBox
        from={line.from ?? '#60A5FA'}
        to={line.to ?? '#A78BFA'}
        style={{ width: THUMB, height: THUMB, borderRadius: 22 }}
      >
        {line.image ? (
          <Image
            source={line.image}
            resizeMode="cover"
            style={StyleSheet.absoluteFill}
          />
        ) : null}
      </GradientBox>

      {/* نام، مشخصات و قیمت */}
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        <View style={{ alignItems: 'flex-end', gap: 4 }}>
          <ThemedText
            color={t => t.text.primary}
            numberOfLines={2}
            style={{
              fontFamily: fonts.bold,
              fontSize: 15,
              textAlign: 'right',
              writingDirection: 'rtl',
            }}
          >
            {line.name}
          </ThemedText>
          {line.specs ? (
            <ThemedText
              color={t => t.text.secondary}
              numberOfLines={1}
              style={{
                fontFamily: fonts.regular,
                fontSize: 12,
                textAlign: 'right',
                writingDirection: 'rtl',
              }}
            >
              {line.specs}
            </ThemedText>
          ) : null}
        </View>

        <ThemedText
          color={t => t.text.primary}
          style={{ fontFamily: fonts.bold, fontSize: 15 }}
        >
          {formatPrice(line.price)} تومان
        </ThemedText>
      </View>

      {/* سطل زباله (بالا) و شمارنده (پایین) در سمت چپ */}
      <View
        style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}
      >
        <Pressable
          onPress={onRemove}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={`حذف ${line.name} از سبد خرید`}
        >
          <ThemedIcon
            Icon={Trash2}
            size={20}
            strokeWidth={2}
            color={t => t.text.secondary}
          />
        </Pressable>

        <QuantityStepper
          quantity={line.quantity}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
        />
      </View>
    </Animated.View>
  );
}
