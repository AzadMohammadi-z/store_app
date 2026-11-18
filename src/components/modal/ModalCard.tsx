import React, { useId } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import type { Tone } from '../account/IconTile';
import GradientButton from '../common/GradientButton';
import { fonts } from '../../theme/fonts';
import { type Theme, useTheme } from '../../theme/ThemeProvider';
import { ThemedText, ThemedView } from '../../theme/themed';

export type ModalAction = {
  label: string;
  onPress?: () => void;
  /** شکل و رنگ دکمه؛ پیش‌فرض glass */
  variant?: 'glass' | 'danger' | 'brand' | 'success' | 'warning';
  /** گرادیان دلخواه [از، به]؛ روی variant اولویت دارد */
  colors?: [string, string];
  loading?: boolean;
  disabled?: boolean;
  /** پیش‌فرض true: بعد از زدن، مودال بسته می‌شود. برای عملیات طولانی false بگذار */
  closeOnPress?: boolean;
};

const BUTTON_HEIGHT = 52;
const BUTTON_RADIUS = 18;
const BUBBLE = 72;

function variantColors(
  variant: NonNullable<ModalAction['variant']>,
  theme: Theme,
): [string, string] {
  switch (variant) {
    case 'danger':
      return ['#E53935', '#B71C1C'];
    case 'success':
      return ['#22C55E', '#15803D'];
    case 'warning':
      return ['#F59E0B', '#D97706'];
    default:
      return [theme.auth.buttonFrom, theme.auth.buttonTo];
  }
}

/* ------------------------------ دایره‌ی آیکون ------------------------------ */

function IconBubble({
  Icon,
  tone,
}: {
  Icon: React.ComponentType<any>;
  tone: Tone;
}) {
  const { theme } = useTheme();
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const color = theme.tones[tone].icon;
  const glow = BUBBLE * 2.4;
  const offset = (glow - BUBBLE) / 2;

  return (
    <View style={{ width: BUBBLE, height: BUBBLE }}>
      <Svg
        width={glow}
        height={glow}
        viewBox="0 0 100 100"
        pointerEvents="none"
        style={{ position: 'absolute', left: -offset, top: -offset }}
      >
        <Defs>
          <RadialGradient id={id} cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={color} stopOpacity={0.3} />
            <Stop offset="1" stopColor={color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx="50" cy="50" r="50" fill={`url(#${id})`} />
      </Svg>

      <ThemedView
        key={tone}
        bg={t => t.tones[tone].bg}
        style={{
          width: BUBBLE,
          height: BUBBLE,
          borderRadius: BUBBLE / 2,
          borderWidth: 1,
          borderColor: `${color}66`,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={30} color={color} strokeWidth={2} />
      </ThemedView>
    </View>
  );
}

/* --------------------------------- دکمه‌ها --------------------------------- */

function GlassButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const press = useSharedValue(0);
  const style = useAnimatedStyle(() => ({
    opacity: disabled ? 0.5 : 1,
    transform: [{ scale: 1 - press.value * 0.03 }],
  }));

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => {
        press.value = withSpring(1, { damping: 18, stiffness: 300 });
      }}
      onPressOut={() => {
        press.value = withSpring(0, { damping: 14, stiffness: 240 });
      }}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
    >
      <Animated.View style={style}>
        <ThemedView
          bg={t => t.auth.codeBackground}
          border={t => t.auth.codeBorder}
          style={{
            height: BUTTON_HEIGHT,
            borderRadius: BUTTON_RADIUS,
            borderWidth: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ThemedText
            color={t => t.text.primary}
            style={{ fontFamily: fonts.bold, fontSize: 16 }}
          >
            {label}
          </ThemedText>
        </ThemedView>
      </Animated.View>
    </Pressable>
  );
}

function ActionButton({
  action,
  onPress,
}: {
  action: ModalAction;
  onPress: () => void;
}) {
  const { theme } = useTheme();
  const variant = action.variant ?? 'glass';

  if (variant === 'glass' && !action.colors) {
    return (
      <GlassButton
        label={action.label}
        disabled={action.disabled}
        onPress={onPress}
      />
    );
  }

  const [from, to] = action.colors ?? variantColors(variant, theme);
  return (
    <GradientButton
      label={action.label}
      onPress={onPress}
      from={from}
      to={to}
      glow={from}
      disabled={action.disabled}
      loading={action.loading}
      height={BUTTON_HEIGHT}
      radius={BUTTON_RADIUS}
    />
  );
}

/* ---------------------------------- کارت ---------------------------------- */

type Props = {
  icon?: React.ComponentType<any>;
  tone?: Tone;
  title: string;
  message?: string;
  actions?: ModalAction[];
  onActionPress: (action: ModalAction) => void;
};

export default function ModalCard({
  icon,
  tone = 'indigo',
  title,
  message,
  actions,
  onActionPress,
}: Props) {
  const list = actions ?? [];
  const stacked = list.length > 2;

  return (
    <ThemedView
      bg={t => t.modal.card}
      border={t => t.modal.cardBorder}
      style={{
        borderWidth: 1,
        borderRadius: 32,
        paddingHorizontal: 22,
        paddingTop: 28,
        paddingBottom: list.length ? 22 : 28,
        alignItems: 'center',
        gap: 14,
      }}
    >
      {icon ? <IconBubble Icon={icon} tone={tone} /> : null}

      <ThemedText
        color={t => t.text.primary}
        style={{ fontFamily: fonts.bold, fontSize: 22, textAlign: 'center' }}
      >
        {title}
      </ThemedText>

      {message ? (
        <ThemedText
          color={t => t.text.secondary}
          style={{
            fontFamily: fonts.regular,
            fontSize: 14,
            lineHeight: 26,
            textAlign: 'center',
            writingDirection: 'rtl',
          }}
        >
          {message}
        </ThemedText>
      ) : null}

      {list.length ? (
        <View
          style={{
            alignSelf: 'stretch',
            flexDirection: stacked ? 'column' : 'row-reverse',
            gap: 12,
            marginTop: 10,
          }}
        >
          {list.map((action, i) => (
            <View key={i} style={stacked ? undefined : { flex: 1 }}>
              <ActionButton
                action={action}
                onPress={() => onActionPress(action)}
              />
            </View>
          ))}
        </View>
      ) : null}
    </ThemedView>
  );
}
