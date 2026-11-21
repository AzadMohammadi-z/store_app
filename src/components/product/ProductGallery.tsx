import React, { useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { ChevronRight, Heart, Share2 } from 'lucide-react-native';
import GradientBox from '../common/GradientBox';
import PagerDots from '../common/PagerDots';
import SquareButton from '../common/SquareButton';
import { SCREEN_PADDING } from '../../constants/layout';
import type { ProductDetail } from '../../data/products';
import { fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import { toFaDigits } from '../../utils/format';

const THUMB = 64;

type Props = {
  gallery: ProductDetail['gallery'];
  discountPercent?: number;
  favorite: boolean;
  onBack: () => void;
  onShare: () => void;
  onToggleFavorite: () => void;
};

export default function ProductGallery({
  gallery,
  discountPercent,
  favorite,
  onBack,
  onShare,
  onToggleFavorite,
}: Props) {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const heroW = width - SCREEN_PADDING * 2;
  const heroH = Math.round(heroW * 1.06);

  const scrollX = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: e => {
      scrollX.value = e.contentOffset.x;
    },
  });

  const listRef = useRef<any>(null);
  const [active, setActive] = useState(0);

  const goTo = (index: number) => {
    listRef.current?.scrollToOffset({ offset: index * heroW, animated: true });
    setActive(index);
  };

  return (
    <View style={{ paddingHorizontal: SCREEN_PADDING, gap: 12 }}>
      <View style={{ height: heroH, borderRadius: 32, overflow: 'hidden' }}>
        <Animated.FlatList
          ref={listRef}
          data={gallery}
          keyExtractor={g => g.id}
          horizontal
          inverted // راست‌به‌چپ: تصویر اول سمت راست
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={onScroll}
          onMomentumScrollEnd={e =>
            setActive(Math.round(e.nativeEvent.contentOffset.x / heroW))
          }
          getItemLayout={(_, i) => ({
            length: heroW,
            offset: heroW * i,
            index: i,
          })}
          renderItem={({ item }) => (
            <View style={{ width: heroW, height: heroH }}>
              <GradientBox from={item.from} to={item.to} style={{ flex: 1 }}>
                <View
                  style={[
                    StyleSheet.absoluteFill,
                    { alignItems: 'center', justifyContent: 'center' },
                  ]}
                >
                  {/* جای‌نگه‌دار عکس محصول (شیشه‌ای) */}
                  <View
                    style={{
                      width: heroW * 0.56,
                      height: heroW * 0.56,
                      borderRadius: 48,
                      borderWidth: 1.5,
                      borderColor: 'rgba(255,255,255,0.3)',
                      backgroundColor: 'rgba(255,255,255,0.14)',
                    }}
                  />
                </View>
              </GradientBox>
            </View>
          )}
        />

        {/* دکمه‌ها: بازگشت (راست)، قلب و اشتراک (چپ) */}
        <View
          pointerEvents="box-none"
          style={{
            position: 'absolute',
            top: 14,
            left: 14,
            right: 14,
            flexDirection: 'row-reverse',
            justifyContent: 'space-between',
          }}
        >
          <SquareButton Icon={ChevronRight} onPress={onBack} label="بازگشت" />
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <SquareButton
              Icon={Heart}
              onPress={onToggleFavorite}
              label={
                favorite ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'
              }
              active={favorite}
            />
            <SquareButton
              Icon={Share2}
              onPress={onShare}
              label="اشتراک‌گذاری"
            />
          </View>
        </View>

        {/* نشان تخفیف */}
        {discountPercent ? (
          <GradientBox
            from="#EF4444"
            to="#B91C1C"
            style={{
              position: 'absolute',
              left: 16,
              bottom: 16,
              height: 34,
              paddingHorizontal: 16,
              borderRadius: 17,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{ color: '#FFFFFF', fontFamily: fonts.bold, fontSize: 13 }}
            >
              {toFaDigits(String(discountPercent))}٪ تخفیف
            </Text>
          </GradientBox>
        ) : null}

        {/* نقطه‌های صفحه‌بندی */}
        {gallery.length > 1 ? (
          <PagerDots
            count={gallery.length}
            scrollX={scrollX}
            step={heroW}
            color="#FFFFFF"
            style={{ position: 'absolute', left: 0, right: 0, bottom: 22 }}
          />
        ) : null}
      </View>

      {/* تصاویر کوچک */}
      <FlatList
        data={gallery}
        keyExtractor={g => g.id}
        horizontal
        inverted
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() => goTo(index)}
            accessibilityRole="button"
            accessibilityLabel={`تصویر ${toFaDigits(String(index + 1))}`}
            accessibilityState={{ selected: index === active }}
          >
            <View
              style={{
                width: THUMB,
                height: THUMB,
                borderRadius: 18,
                borderWidth: 2,
                padding: 2,
                borderColor:
                  index === active ? theme.auth.badgeText : 'transparent',
              }}
            >
              <GradientBox
                from={item.from}
                to={item.to}
                style={{ flex: 1, borderRadius: 14 }}
              />
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}
