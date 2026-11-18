import React from 'react';
import { View } from 'react-native';
import { Check } from 'lucide-react-native';
import GlassCard from '../common/GlassCard';
import GradientBox from '../common/GradientBox';
import { fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import { ThemedIcon, ThemedText, ThemedView } from '../../theme/themed';
import { toFaDigits } from '../../utils/format';

const STEPS = ['سبد خرید', 'اطلاعات', 'پرداخت'];
const DOT = 32;

type State = 'done' | 'current' | 'upcoming';

function Dot({ state, number }: { state: State; number: number }) {
  const { theme } = useTheme();

  if (state === 'done') {
    return (
      <ThemedView
        bg={t => t.tones.purple.bg}
        border={t => t.auth.badgeBorder}
        style={{
          width: DOT,
          height: DOT,
          borderRadius: DOT / 2,
          borderWidth: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ThemedIcon
          Icon={Check}
          size={16}
          strokeWidth={2.6}
          color={t => t.tones.purple.icon}
        />
      </ThemedView>
    );
  }

  if (state === 'current') {
    return (
      <GradientBox
        from={theme.auth.buttonFrom}
        to={theme.auth.buttonTo}
        style={{
          width: DOT,
          height: DOT,
          borderRadius: DOT / 2,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ThemedText
          color={() => '#FFFFFF'}
          style={{ fontFamily: fonts.bold, fontSize: 14 }}
        >
          {toFaDigits(String(number))}
        </ThemedText>
      </GradientBox>
    );
  }

  return (
    <ThemedView
      border={t => t.auth.skipBorder}
      style={{
        width: DOT,
        height: DOT,
        borderRadius: DOT / 2,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ThemedText
        color={t => t.text.secondary}
        style={{ fontFamily: fonts.bold, fontSize: 14 }}
      >
        {toFaDigits(String(number))}
      </ThemedText>
    </ThemedView>
  );
}

/** current: شماره‌ی مرحله‌ی فعلی از صفر (۰ = سبد خرید، ۱ = اطلاعات، ۲ = پرداخت) */
export default function CheckoutStepper({ current }: { current: number }) {
  return (
    <GlassCard
      radius={26}
      style={{ paddingVertical: 14, paddingHorizontal: 16 }}
    >
      <View
        style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 10 }}
      >
        {STEPS.map((label, i) => {
          const state: State =
            i < current ? 'done' : i === current ? 'current' : 'upcoming';
          return (
            <React.Fragment key={label}>
              {i > 0 ? (
                <ThemedView
                  bg={t => t.card.divider}
                  style={{ flex: 1, height: 1 }}
                />
              ) : null}

              <View
                style={{
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Dot state={state} number={i + 1} />
                <ThemedText
                  key={state}
                  color={
                    state === 'done'
                      ? t => t.auth.link
                      : state === 'current'
                      ? t => t.text.primary
                      : t => t.text.secondary
                  }
                  style={{
                    fontFamily: state === 'current' ? fonts.bold : fonts.medium,
                    fontSize: 14,
                  }}
                >
                  {label}
                </ThemedText>
              </View>
            </React.Fragment>
          );
        })}
      </View>
    </GlassCard>
  );
}
