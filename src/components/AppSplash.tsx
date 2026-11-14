import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
} from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';
import RNBootSplash from 'react-native-bootsplash';

type Props = {
  visible: boolean; // وقتی false بشه، اسپلش محو میشه
  onHidden?: () => void; // بعد از محو شدن کامل صدا زده میشه
};

const LOGO_SIZE = 120; // باید با --logo-width یکی باشه
const BAR_WIDTH = 120;

const glows = [
  { id: 'purple', cx: 0.85, cy: 0.09, r: 0.8, color: '#5B2FD0', opacity: 0.55 },
  { id: 'red', cx: 0.1, cy: 0.6, r: 0.7, color: '#7A1F3A', opacity: 0.45 },
  { id: 'teal', cx: 0.8, cy: 0.9, r: 0.7, color: '#1A8FA8', opacity: 0.35 },
  { id: 'logo', cx: 0.5, cy: 0.5, r: 0.38, color: '#7C3AED', opacity: 0.35 },
];

export default function AppSplash({ visible, onHidden }: Props) {
  const { width: W, height: H } = useWindowDimensions();
  const opacity = useRef(new Animated.Value(1)).current;
  const barX = useRef(new Animated.Value(-60)).current;
  const enter = useRef(new Animated.Value(0)).current;

  // انیمیشن نوار لودینگ
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(barX, {
        toValue: BAR_WIDTH,
        duration: 1200,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [barX]);

  // محو شدن
  useEffect(() => {
    if (!visible) {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => onHidden?.());
    }
  }, [visible, opacity, onHidden]);

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [enter]);

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, styles.container, { opacity }]}
      // وقتی اولین فریم کشیده شد، اسپلش نیتیو رو بدون fade ببند
      onLayout={() => RNBootSplash.hide({ fade: false })}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: enter }]}>
        <Svg width={W} height={H} style={StyleSheet.absoluteFill}>
          <Defs>
            {glows.map(g => (
              <RadialGradient
                key={g.id}
                id={g.id}
                cx={W * g.cx}
                cy={H * g.cy}
                r={W * g.r}
                gradientUnits="userSpaceOnUse"
              >
                <Stop offset="0" stopColor={g.color} stopOpacity={g.opacity} />
                <Stop offset="1" stopColor={g.color} stopOpacity={0} />
              </RadialGradient>
            ))}
          </Defs>
          {glows.map(g => (
            <Rect
              key={g.id}
              x={0}
              y={0}
              width={W}
              height={H}
              fill={`url(#${g.id})`}
            />
          ))}
        </Svg>
      </Animated.View>

      {/* لوگو دقیقاً وسط صفحه، هم‌جا با اسپلش نیتیو */}
      <Image
        source={require('../assets/logo.png')}
        style={[
          styles.logo,
          { top: H / 2 - LOGO_SIZE / 2, left: W / 2 - LOGO_SIZE / 2 },
        ]}
        resizeMode="contain"
      />

      <Animated.View
        style={[
          styles.texts,
          { top: H / 2 + LOGO_SIZE / 2 + 24, opacity: enter },
        ]}
      >
        <Text className="font-vazir-bold text-ink" style={styles.title}>
          نوازون
        </Text>
        <Text className="font-vazir text-ink" style={styles.tagline}>
          همه‌ی فروشگاه‌ها، یک‌جا
        </Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.track,
          { bottom: H * 0.1, left: (W - BAR_WIDTH) / 2, opacity: enter },
        ]}
      >
        <Animated.View style={{ transform: [{ translateX: barX }] }}>
          <Svg width={60} height={6}>
            <Defs>
              <LinearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor="#6D3BEA" />
                <Stop offset="1" stopColor="#22B5E8" />
              </LinearGradient>
            </Defs>
            <Rect width={60} height={6} rx={3} fill="url(#bar)" />
          </Svg>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#0B0A0F' },
  logo: { position: 'absolute', width: LOGO_SIZE, height: LOGO_SIZE },
  texts: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  title: { color: '#fff', fontSize: 32 },
  tagline: { color: 'rgba(255,255,255,0.5)', fontSize: 16, marginTop: 8 },
  track: {
    position: 'absolute',
    width: BAR_WIDTH,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
});
