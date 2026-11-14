import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  PanResponder,
  Pressable,
  Text,
  View,
} from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from '@sbaiahmed1/react-native-blur';
import { Home, LayoutGrid, ShoppingBag, User } from 'lucide-react-native';

import { palettes } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { useTheme } from '../theme/ThemeProvider';
import { ThemedIcon, ThemedView, useThemedStyle } from '../theme/themed';
import { GradientIcon, GradientText } from './GradientMask';
import { useTabBarStyles } from './tabBar.styles';
import {
  TAB_BAR,
  SLIDE_SPRING,
  ICON_SPRING,
  PULSE_SPRING,
  LAND_SPRING,
  DRAG_SPRING,
  GRAB_SPRING,
} from './tabBar.config';

const ICONS: Record<string, React.ComponentType<any>> = {
  Home,
  Categories: LayoutGrid,
  Cart: ShoppingBag,
  Account: User,
};

// رنگ‌های حباب در هر دو تم (برای ترکیب نرم)
const L = palettes.light.tabBar;
const D = palettes.dark.tabBar;

/* ---------------------------- آیتم هر تب ---------------------------- */

type ItemProps = {
  label: string;
  focused: boolean;
  grabbing: boolean;
  badge?: string | number;
  Icon: React.ComponentType<any>;
  onPress: () => void;
  onLongPress: () => void;
};

function TabItem({
  label,
  focused,
  grabbing,
  badge,
  Icon,
  onPress,
  onLongPress,
}: ItemProps) {
  const styles = useTabBarStyles();

  const progress = useSharedValue(focused ? 1 : 0);
  const lift = useSharedValue(0);
  const scale = useSharedValue(focused ? TAB_BAR.iconActiveScale : 1);
  const mounted = useRef(false);

  useEffect(() => {
    progress.value = withTiming(focused ? 1 : 0, {
      duration: 240,
      easing: Easing.out(Easing.cubic),
    });

    if (mounted.current && focused) {
      lift.value = withSequence(
        withTiming(-TAB_BAR.iconJump, {
          duration: 140,
          easing: Easing.out(Easing.quad),
        }),
        withSpring(0, LAND_SPRING),
      );
    }
    mounted.current = true;
  }, [focused]);

  useEffect(() => {
    const target = !focused
      ? 1
      : grabbing
      ? TAB_BAR.iconGrabScale
      : TAB_BAR.iconActiveScale;
    scale.value = withSpring(target, ICON_SPRING);
  }, [focused, grabbing]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: lift.value }, { scale: scale.value }],
  }));

  const activeStyle = useAnimatedStyle(() => ({ opacity: progress.value }));
  const inactiveStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
  }));
  const inactiveColor = useThemedStyle({ color: t => t.text.inactive });

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={focused ? { selected: true } : {}}
      style={styles.item}
    >
      <Animated.View style={iconStyle}>
        <Animated.View style={inactiveStyle}>
          <ThemedIcon
            Icon={Icon}
            size={TAB_BAR.iconSize}
            strokeWidth={1.8}
            color={t => t.text.inactive}
          />
        </Animated.View>
        <Animated.View pointerEvents="none" style={[styles.layer, activeStyle]}>
          <GradientIcon Icon={Icon} size={TAB_BAR.iconSize} strokeWidth={2.2} />
        </Animated.View>
        {badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : null}
      </Animated.View>

      <View style={styles.labelWrap}>
        <Animated.Text
          numberOfLines={1}
          style={[
            styles.label,
            { fontFamily: fonts.medium },
            inactiveColor,
            inactiveStyle,
          ]}
        >
          {label}
        </Animated.Text>
        <Animated.View
          pointerEvents="none"
          style={[styles.labelOverlay, activeStyle]}
        >
          <GradientText style={[styles.label, { fontFamily: fonts.bold }]}>
            {label}
          </GradientText>
        </Animated.View>
      </View>
    </Pressable>
  );
}

/* ------------------------------ نوار اصلی ------------------------------ */

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { blurType, progress: themeProgress } = useTheme();
  const styles = useTabBarStyles();

  const [width, setWidth] = useState(0);
  const [dragVisual, setDragVisual] = useState<number | null>(null);
  const [grabbing, setGrabbing] = useState(false);

  const count = state.routes.length;
  const inset = TAB_BAR.padding + TAB_BAR.borderWidth;
  const tabWidth = width > 0 ? (width - inset * 2) / count : 0;

  // راست‌به‌چپ: اولین تب سمت راست است
  const visualIndex = count - 1 - state.index;

  const x = useSharedValue(0);
  const pulse = useSharedValue(0);
  const grab = useSharedValue(0);
  const amp = useSharedValue(1);
  const ready = useRef(false);
  const prevVisual = useRef(visualIndex);

  const barRef = useRef<React.ComponentRef<typeof View>>(null);
  const barLeft = useRef(0);
  const dragging = useRef(false);
  const hover = useRef(visualIndex);
  const live = useRef({ tabWidth, count, visualIndex, state, navigation });
  live.current = { tabWidth, count, visualIndex, state, navigation };

  useEffect(() => {
    if (tabWidth === 0) return;
    const target = visualIndex * tabWidth;

    if (!ready.current) {
      x.value = target;
      ready.current = true;
      prevVisual.current = visualIndex;
      return;
    }

    // وسط لمس، حباب فقط دست انگشت است
    if (dragging.current) return;

    const steps = Math.abs(visualIndex - prevVisual.current);
    prevVisual.current = visualIndex;

    if (steps === 0) {
      x.value = withSpring(target, SLIDE_SPRING);
      return;
    }

    amp.value = Math.min(steps, TAB_BAR.stretchMaxSteps);
    x.value = withSpring(target, SLIDE_SPRING);
    pulse.value = withSequence(
      withTiming(1, { duration: 150, easing: Easing.out(Easing.quad) }),
      withSpring(0, PULSE_SPRING),
    );
  }, [visualIndex, tabWidth]);

  const pan = useMemo(() => {
    const follow = (pageX: number) => {
      const { tabWidth: tw, count: c } = live.current;
      if (!tw) return;

      const maxX = (c - 1) * tw;
      const raw = pageX - barLeft.current - inset - tw / 2;
      const target = Math.min(Math.max(raw, 0), maxX);

      x.value = withSpring(target, DRAG_SPRING);

      const idx = Math.round(target / tw);
      if (idx !== hover.current) {
        hover.current = idx;
        setDragVisual(idx);
      }
    };

    const finish = () => {
      if (!dragging.current) return;
      dragging.current = false;

      const {
        tabWidth: tw,
        count: c,
        state: st,
        navigation: nav,
        visualIndex: current,
      } = live.current;
      const finalVisual = hover.current < 0 ? current : hover.current;
      const routeIndex = c - 1 - finalVisual;

      setDragVisual(null);
      setGrabbing(false);
      grab.value = withSpring(0, GRAB_SPRING);

      if (routeIndex === st.index) {
        x.value = withSpring(current * tw, SLIDE_SPRING);
        return;
      }

      const route = st.routes[routeIndex];
      const event = nav.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (event.defaultPrevented) {
        x.value = withSpring(current * tw, SLIDE_SPRING);
        return;
      }

      x.value = withSpring(finalVisual * tw, SLIDE_SPRING);
      prevVisual.current = finalVisual;
      nav.navigate(route.name as never);
    };

    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderTerminationRequest: () => false,

      onPanResponderGrant: evt => {
        barRef.current?.measureInWindow(px => {
          barLeft.current = px;
        });
        dragging.current = true;
        hover.current = -1;
        setGrabbing(true);
        grab.value = withSpring(1, GRAB_SPRING);
        follow(evt.nativeEvent.pageX);
      },

      onPanResponderMove: (_, g) => follow(g.moveX),

      onPanResponderRelease: finish,
      onPanResponderTerminate: finish,
    });
  }, []);

  const indicatorStyle = useAnimatedStyle(() => {
    const g = grab.value;
    const t = themeProgress.value;

    const extraW =
      pulse.value * (TAB_BAR.stretchBase + TAB_BAR.stretchPerStep * amp.value) +
      g * TAB_BAR.grabStretch;
    const lessH = pulse.value * TAB_BAR.squash;
    const growH = g * TAB_BAR.grabGrow;
    const h = TAB_BAR.itemHeight - lessH + growH;

    // اول بین دو تم، بعد بین حالت عادی و گرفتن
    const bgRest = interpolateColor(t, [0, 1], [L.indicator, D.indicator]);
    const bgGrab = interpolateColor(
      t,
      [0, 1],
      [L.indicatorGrab, D.indicatorGrab],
    );
    const borderRest = interpolateColor(
      t,
      [0, 1],
      [L.indicatorBorder, D.indicatorBorder],
    );
    const borderGrab = interpolateColor(
      t,
      [0, 1],
      [L.indicatorBorderGrab, D.indicatorBorderGrab],
    );

    return {
      width: tabWidth - TAB_BAR.bubbleInset * 2 + extraW,
      height: h,
      borderRadius: h / 2,
      opacity: tabWidth > 0 ? 1 : 0,
      backgroundColor: interpolateColor(g, [0, 1], [bgRest, bgGrab]),
      borderColor: interpolateColor(g, [0, 1], [borderRest, borderGrab]),
      transform: [
        { translateX: x.value + TAB_BAR.bubbleInset - extraW / 2 },
        { translateY: lessH / 2 - growH / 2 },
      ],
    };
  });

  const onLayout = (e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
    barRef.current?.measureInWindow(px => {
      barLeft.current = px;
    });
  };

  const items = state.routes
    .map((route, index) => ({ route, index }))
    .reverse();
  const litVisual = dragVisual ?? visualIndex;

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.wrapper,
        { bottom: Math.max(insets.bottom, TAB_BAR.minBottomInset) },
      ]}
    >
      <View
        ref={barRef}
        collapsable={false}
        onLayout={onLayout}
        style={styles.bar}
        {...pan.panHandlers}
      >
        <View pointerEvents="none" style={styles.barClip}>
          <BlurView
            blurType={blurType}
            blurAmount={TAB_BAR.blurAmount}
            style={styles.blur}
          />
          <ThemedView bg={t => t.tabBar.tint} style={styles.tint} />
          {/* <ThemedView bg={t => t.tabBar.rim} style={styles.rim} /> */}
        </View>

        <ThemedView
          pointerEvents="none"
          border={t => t.tabBar.border}
          style={styles.barBorder}
        />

        <Animated.View
          pointerEvents="none"
          style={[styles.indicator, indicatorStyle]}
        />

        {items.map(({ route, index }) => {
          const { options } = descriptors[route.key];
          const label = (options.title ?? route.name) as string;
          const isCurrent = state.index === index;
          const lit = litVisual === count - 1 - index;
          const Icon = ICONS[route.name] ?? Home;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isCurrent && !event.defaultPrevented) {
              navigation.navigate(route.name as never);
            }
          };

          const onLongPress = () => {
            navigation.emit({ type: 'tabLongPress', target: route.key });
          };

          return (
            <TabItem
              key={route.key}
              label={label}
              focused={lit}
              grabbing={grabbing}
              badge={options.tabBarBadge}
              Icon={Icon}
              onPress={onPress}
              onLongPress={onLongPress}
            />
          );
        })}
      </View>
    </View>
  );
}
