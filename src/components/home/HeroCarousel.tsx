import React, { useCallback, useEffect, useId, useRef } from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  Extrapolation,
  type SharedValue,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import Svg, {
  Defs,
  Ellipse,
  LinearGradient,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';
import GradientBox from '../common/GradientBox';
import { fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import { ThemedText, ThemedView } from '../../theme/themed';
import PagerDots from '../common/PagerDots';

export type Slide = {
  id: string;
  badge?: string;
  title: string;
  subtitle?: string;
  cta?: string;
  /** رنگ لکه‌ی نورانی پشت کارت */
  accent: string;
  /** تصویر اختیاری، سمت چپ کارت */
  image?: ImageSourcePropType;
  onPress?: () => void;
};

const PEEK = 28; // مقدار دیده شدن اسلایدهای کناری
const GAP = 12;
const CARD_HEIGHT = 172;

/* ------------------------------ کارت هر اسلاید ------------------------------ */

type CardProps = {
  item: Slide;
  index: number;
  scrollX: SharedValue<number>;
  width: number;
  step: number;
};

function SlideCard({ item, index, scrollX, width, step }: CardProps) {
  const { theme } = useTheme();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');

  const animated = useAnimatedStyle(() => {
    const input = [(index - 1) * step, index * step, (index + 1) * step];
    return {
      opacity: interpolate(
        scrollX.value,
        input,
        [0.6, 1, 0.6],
        Extrapolation.CLAMP,
      ),
      transform: [
        {
          scale: interpolate(
            scrollX.value,
            input,
            [0.92, 1, 0.92],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  return (
    <Animated.View style={[{ width, height: CARD_HEIGHT }, animated]}>
      <Pressable
        onPress={item.onPress}
        style={{ flex: 1 }}
        accessibilityRole="button"
        accessibilityLabel={item.title}
      >
        <ThemedView
          bg={t => t.card.background}
          border={t => t.card.border}
          style={styles.card}
        >
          {/* لکه‌ی رنگی و درخشش شیشه‌ای */}
          <Svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          >
            <Defs>
              <RadialGradient id={`${uid}b`} cx="50%" cy="50%" r="50%">
                <Stop offset="0" stopColor={item.accent} stopOpacity={0.5} />
                <Stop offset="1" stopColor={item.accent} stopOpacity={0} />
              </RadialGradient>
              <LinearGradient id={`${uid}s`} x1="0" y1="0" x2="0" y2="1">
                <Stop
                  offset="0"
                  stopColor="#FFFFFF"
                  stopOpacity={theme.slider.sheenOpacity}
                />
                <Stop offset="0.6" stopColor="#FFFFFF" stopOpacity={0} />
              </LinearGradient>
            </Defs>
            <Ellipse cx="18" cy="78" rx="60" ry="65" fill={`url(#${uid}b)`} />
            <Rect width="100" height="100" fill={`url(#${uid}s)`} />
          </Svg>

          {item.image ? (
            <Image
              source={item.image}
              resizeMode="contain"
              style={styles.image}
            />
          ) : null}

          {/* متن‌ها (سمت راست) */}
          <View
            style={[styles.textCol, item.image ? { marginLeft: 120 } : null]}
          >
            <View style={{ alignItems: 'flex-end', gap: 8 }}>
              {item.badge ? (
                <ThemedView
                  bg={t => t.card.background}
                  border={t => t.card.border}
                  style={styles.badge}
                >
                  <ThemedText
                    color={t => t.text.secondary}
                    style={styles.badgeText}
                  >
                    {item.badge}
                  </ThemedText>
                </ThemedView>
              ) : null}

              <ThemedText
                color={t => t.text.primary}
                numberOfLines={2}
                style={styles.title}
              >
                {item.title}
              </ThemedText>

              {item.subtitle ? (
                <ThemedText
                  color={t => t.text.secondary}
                  numberOfLines={1}
                  style={styles.subtitle}
                >
                  {item.subtitle}
                </ThemedText>
              ) : null}
            </View>

            <GradientBox
              from={theme.gradient.from}
              to={theme.gradient.to}
              style={styles.cta}
            >
              <Text style={styles.ctaText}>{item.cta ?? 'مشاهده'}</Text>
            </GradientBox>
          </View>
        </ThemedView>
      </Pressable>
    </Animated.View>
  );
}

/* ------------------------------ اسلایدر اصلی ------------------------------ */

type Props = {
  slides: Slide[];
  autoPlay?: boolean;
  /** فاصله‌ی تعویض خودکار (میلی‌ثانیه) */
  interval?: number;
};

export default function HeroCarousel({
  slides,
  autoPlay = true,
  interval = 4500,
}: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const { theme } = useTheme();

  const itemWidth = screenWidth - PEEK * 2;
  const step = itemWidth + GAP;

  const scrollX = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: e => {
      scrollX.value = e.contentOffset.x;
    },
  });

  const listRef = useRef<any>(null);
  const current = useRef(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  }, []);

  const start = useCallback(() => {
    stop();
    if (!autoPlay || slides.length < 2) return;
    timer.current = setInterval(() => {
      const next = (current.current + 1) % slides.length;
      current.current = next;
      listRef.current?.scrollToOffset({ offset: next * step, animated: true });
    }, interval);
  }, [autoPlay, interval, slides.length, step, stop]);

  useEffect(() => {
    start();
    return stop;
  }, [start, stop]);

  return (
    <View>
      <Animated.FlatList
        ref={listRef}
        data={slides}
        keyExtractor={s => s.id}
        horizontal
        inverted // راست‌به‌چپ: اسلاید اول سمت راست
        showsHorizontalScrollIndicator={false}
        snapToInterval={step}
        decelerationRate="fast"
        disableIntervalMomentum
        scrollEventThrottle={16}
        onScroll={onScroll}
        onScrollBeginDrag={stop}
        onMomentumScrollEnd={e => {
          current.current = Math.round(e.nativeEvent.contentOffset.x / step);
          start();
        }}
        contentContainerStyle={{ paddingHorizontal: PEEK }}
        ItemSeparatorComponent={() => <View style={{ width: GAP }} />}
        getItemLayout={(_, i) => ({ length: step, offset: step * i, index: i })}
        renderItem={({ item, index }) => (
          <SlideCard
            item={item}
            index={index}
            scrollX={scrollX}
            width={itemWidth}
            step={step}
          />
        )}
      />

      {/* نقطه‌ها؛ row-reverse تا اولین نقطه سمت راست باشد */}
      <PagerDots
        count={slides.length}
        scrollX={scrollX}
        step={step}
        color={theme.gradient.to}
        style={{ marginTop: 12 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 28,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 18,
    flexDirection: 'row-reverse',
  },
  image: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    width: 112,
    height: 112,
  },
  textCol: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  badge: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: {
    fontFamily: fonts.medium,
    fontSize: 11,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 20,
    lineHeight: 30,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 12,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  cta: {
    height: 34,
    paddingHorizontal: 20,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    color: '#FFFFFF',
    fontFamily: fonts.bold,
    fontSize: 12,
  },
});
