import React from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Plus } from 'lucide-react-native';
import GradientBox from '../common/GradientBox';
import { formatPrice } from '../../utils/format';
import { fonts } from '../../theme/fonts';
import { ThemedText, ThemedView } from '../../theme/themed';

export type Product = {
  id: string;
  name: string;
  store: string;
  /** قیمت به تومان */
  price: number;
  image?: ImageSourcePropType;
  /** رنگ‌های گرادیان جای عکس، تا وقتی عکس واقعی نیست */
  from?: string;
  to?: string;
};

const PAD = 10;
const THUMB_RADIUS = 18;

type Props = {
  product: Product;
  width: number;
  index: number;
  onPress?: (p: Product) => void;
  onAdd?: (p: Product) => void;
};

export default function ProductCard({
  product,
  width,
  index,
  onPress,
  onAdd,
}: Props) {
  const press = useSharedValue(0);
  const addPress = useSharedValue(0);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - press.value * 0.03 }],
  }));
  const addStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - addPress.value * 0.18 }],
  }));

  const thumb = width - PAD * 2;

  return (
    // entering و انیمیشن لمس روی دو View جدا هستند تا با هم تداخل نکنند
    <Animated.View
      entering={FadeInDown.delay(Math.min(index, 6) * 60).duration(350)}
      style={{ width }}
    >
      <Pressable
        onPress={() => onPress?.(product)}
        onPressIn={() => {
          press.value = withSpring(1, { damping: 18, stiffness: 300 });
        }}
        onPressOut={() => {
          press.value = withSpring(0, { damping: 14, stiffness: 240 });
        }}
        accessibilityRole="button"
        accessibilityLabel={`${product.name}، ${product.store}`}
      >
        <Animated.View style={cardStyle}>
          <ThemedView
            bg={t => t.card.background}
            border={t => t.card.border}
            style={styles.card}
          >
            <GradientBox
              from={product.from ?? '#60A5FA'}
              to={product.to ?? '#A78BFA'}
              style={{
                width: thumb,
                height: thumb,
                borderRadius: THUMB_RADIUS,
              }}
            >
              {product.image ? (
                <Image
                  source={product.image}
                  resizeMode="cover"
                  style={StyleSheet.absoluteFill}
                />
              ) : null}
            </GradientBox>

            <View style={styles.texts}>
              <ThemedText
                color={t => t.text.primary}
                numberOfLines={1}
                style={styles.name}
              >
                {product.name}
              </ThemedText>
              <ThemedText
                color={t => t.text.secondary}
                numberOfLines={1}
                style={styles.store}
              >
                {product.store}
              </ThemedText>
            </View>

            <View style={styles.bottom}>
              <ThemedText color={t => t.text.primary} style={styles.price}>
                {formatPrice(product.price)}{' '}
                <Text style={styles.currency}>تومان</Text>
              </ThemedText>

              <Pressable
                onPress={() => onAdd?.(product)}
                onPressIn={() => {
                  addPress.value = withSpring(1, {
                    damping: 16,
                    stiffness: 320,
                  });
                }}
                onPressOut={() => {
                  addPress.value = withSpring(0, {
                    damping: 10,
                    stiffness: 260,
                  });
                }}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={`افزودن ${product.name} به سبد خرید`}
              >
                <Animated.View style={addStyle}>
                  <GradientBox from="#3B82F6" to="#8B5CF6" style={styles.add}>
                    <Plus size={20} color="#FFFFFF" strokeWidth={2.6} />
                  </GradientBox>
                </Animated.View>
              </Pressable>
            </View>
          </ThemedView>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 26,
    borderWidth: 1,
    padding: PAD,
    gap: 10,
  },
  texts: {
    alignItems: 'flex-end',
    gap: 2,
    paddingHorizontal: 2,
  },
  name: {
    fontFamily: fonts.bold,
    fontSize: 13,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  store: {
    fontFamily: fonts.regular,
    fontSize: 11,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  bottom: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  price: {
    fontFamily: fonts.bold,
    fontSize: 13,
  },
  currency: {
    fontFamily: fonts.regular,
    fontSize: 11,
  },
  add: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
