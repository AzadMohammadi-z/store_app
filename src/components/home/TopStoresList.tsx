import React from 'react';
import {
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  type SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { SCREEN_PADDING } from '../../constants/layout';
import { fonts } from '../../theme/fonts';
import { ThemedText, ThemedView } from '../../theme/themed';
import StoreAvatar from '../common/StoreAvatar';

export type Store = {
  id: string;
  name: string;
  category: string;
  /** لوگوی فروشگاه؛ اگر نبود، حرف اول نام روی گرادیان نشان داده می‌شود */
  logo?: ImageSourcePropType;
  /** رنگ‌های گرادیان آواتار */
  from?: string;
  to?: string;
};

const CARD_WIDTH = 132;
const AVATAR = 64;
const GAP = 12;
const STEP = CARD_WIDTH + GAP;

// حس محو شدن در لبه‌ها
const MIN_OPACITY = 0.01; // شفافیت کارتی که تقریباً کاملاً بیرون است
const MIN_SCALE = 0.9; // اندازه‌ی کارتی که تقریباً کاملاً بیرون است

type CardProps = {
  store: Store;
  index: number;
  scrollX: SharedValue<number>;
  viewW: number;
  onPress?: (s: Store) => void;
};

function StoreCard({ store, index, scrollX, viewW, onPress }: CardProps) {
  const press = useSharedValue(0);

  const style = useAnimatedStyle(() => {
    // لیست وارونه (راست‌به‌چپ) است: اولین کارت سمت راست می‌نشیند
    const right = viewW - index * STEP + scrollX.value;
    const left = right - CARD_WIDTH;

    // چه کسری از کارت داخل محدوده‌ی لیست دیده می‌شود (۰ تا ۱)
    const visible = Math.min(right, viewW) - Math.max(left, 0);
    const v = Math.min(Math.max(visible / CARD_WIDTH, 0), 1);

    return {
      opacity: MIN_OPACITY + (1 - MIN_OPACITY) * v,
      transform: [
        { scale: (MIN_SCALE + (1 - MIN_SCALE) * v) * (1 - press.value * 0.05) },
      ],
    };
  });

  return (
    <Pressable
      onPress={() => onPress?.(store)}
      onPressIn={() => {
        press.value = withSpring(1, { damping: 18, stiffness: 300 });
      }}
      onPressOut={() => {
        press.value = withSpring(0, { damping: 14, stiffness: 240 });
      }}
      accessibilityRole="button"
      accessibilityLabel={`${store.name}، ${store.category}`}
    >
      <Animated.View style={style}>
        <ThemedView
          bg={t => t.card.background}
          border={t => t.card.border}
          style={styles.card}
        >
          <StoreAvatar
            size={64}
            ring={false}
            from={store.from ?? '#60A5FA'}
            to={store.to ?? '#A78BFA'}
            logo={store.logo}
            letter={store.name.charAt(0)}
          />

          <View style={styles.texts}>
            <ThemedText
              color={t => t.text.primary}
              numberOfLines={1}
              style={styles.name}
            >
              {store.name}
            </ThemedText>
            <ThemedText
              color={t => t.text.secondary}
              numberOfLines={1}
              style={styles.category}
            >
              {store.category}
            </ThemedText>
          </View>
        </ThemedView>
      </Animated.View>
    </Pressable>
  );
}

type Props = {
  stores: Store[];
  onPressStore?: (store: Store) => void;
};

export default function TopStoresList({ stores, onPressStore }: Props) {
  const { width } = useWindowDimensions();
  const viewW = width - SCREEN_PADDING * 2;

  const scrollX = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: e => {
      scrollX.value = e.contentOffset.x;
    },
  });

  return (
    <Animated.FlatList
      data={stores}
      keyExtractor={s => s.id}
      horizontal
      inverted // راست‌به‌چپ: اولین فروشگاه سمت راست
      showsHorizontalScrollIndicator={false}
      scrollEventThrottle={16}
      onScroll={onScroll}
      // فاصله‌ی چپ و راست: لیست در همین محدوده بریده می‌شود
      style={{ marginHorizontal: SCREEN_PADDING }}
      ItemSeparatorComponent={() => <View style={{ width: GAP }} />}
      renderItem={({ item, index }) => (
        <StoreCard
          store={item}
          index={index}
          scrollX={scrollX}
          viewW={viewW}
          onPress={onPressStore}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 24,
    borderWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 12,
  },
  texts: {
    alignSelf: 'stretch',
    alignItems: 'center',
    gap: 2,
  },
  name: {
    fontFamily: fonts.bold,
    fontSize: 13,
    textAlign: 'center',
  },
  category: {
    fontFamily: fonts.regular,
    fontSize: 11,
    textAlign: 'center',
  },
});
