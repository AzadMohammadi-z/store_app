import React, { useState } from 'react';
import { Dimensions, Keyboard, Pressable, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import Screen from '../common/Screen';
import AuthLogo from './AuthLogo';
import { AUTH_SHEET_TOP, SCREEN_PADDING } from '../../constants/layout';
import { GradientText } from '../../navigation/GradientMask';
import { fonts } from '../../theme/fonts';
import { ThemedIcon, ThemedText, ThemedView } from '../../theme/themed';

export type TopAction = {
  onPress: () => void;
  /** دکمه‌ی متنی، سمت چپ */
  label?: string;
  /** دکمه‌ی آیکونی (مربع)، سمت راست */
  icon?: React.ComponentType<any>;
  accessibilityLabel?: string;
  side?: 'left' | 'right';
};

type Props = {
  topAction: TopAction;
  brandName?: string;
  title: string;
  subtitle?: React.ReactNode;
  /** فاصله‌ی لبه‌ی بالای کارت از بالای صفحه (زیر نوار وضعیت). کمتر = کارت بالاتر */
  sheetTop?: number;
  /** محتوای کارت پایین */
  children: React.ReactNode;
};

const TOP_BAR = 52; // ارتفاع ردیف بالا (۸ فاصله + ۴۴ دکمه)
const sheetTop = AUTH_SHEET_TOP;

export default function AuthLayout({
  topAction,
  brandName,
  title,
  subtitle,
  children,
}: Props) {
  const {
    icon: Icon,
    label,
    onPress,
    accessibilityLabel,
    side = Icon ? 'right' : 'left',
  } = topAction;

  // ارتفاع صفحه فقط یک بار خوانده می‌شود تا با باز شدن کیبورد چیزی جابه‌جا نشود
  const [windowHeight] = useState(() => Dimensions.get('window').height);

  return (
    <Screen standalone variant="auth">
      {/* لمس فضای خالی، کیبورد را می‌بندد */}
      <Pressable
        style={{ flex: 1 }}
        onPress={Keyboard.dismiss}
        accessible={false}
      >
        {/* بالا: دکمه‌ی متنی سمت چپ، یا دکمه‌ی آیکونی سمت راست */}
        <View
          style={{
            height: TOP_BAR,
            flexDirection: 'row',
            justifyContent: side === 'right' ? 'flex-end' : 'flex-start',
            paddingHorizontal: SCREEN_PADDING,
            paddingTop: 8,
          }}
        >
          <Pressable
            onPress={onPress}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel ?? label}
          >
            <ThemedView
              bg={t => t.auth.skipBackground}
              border={t => t.auth.skipBorder}
              style={{
                height: 44,
                minWidth: 44,
                paddingHorizontal: Icon ? 0 : 22,
                borderRadius: Icon ? 14 : 22,
                borderWidth: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {Icon ? (
                <ThemedIcon
                  Icon={Icon}
                  size={22}
                  strokeWidth={2.2}
                  color={t => t.text.primary}
                />
              ) : (
                <ThemedText
                  color={t => t.text.primary}
                  style={{ fontFamily: fonts.bold, fontSize: 14 }}
                >
                  {label}
                </ThemedText>
              )}
            </ThemedView>
          </Pressable>
        </View>

        {/* ناحیه‌ی ثابت لوگو و عنوان */}
        <View
          style={{
            height: sheetTop - TOP_BAR,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 32,
            gap: 22,
          }}
        >
          <Animated.View
            entering={FadeInDown.delay(80).duration(500)}
            style={{ alignItems: 'center' }}
          >
            <AuthLogo size={104} />
            {brandName ? (
              <GradientText
                style={{ fontFamily: fonts.extrabold, fontSize: 32 }}
              >
                {brandName}
              </GradientText>
            ) : null}
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(160).duration(500)}
            style={{ alignItems: 'center', gap: 5 }}
          >
            <ThemedText
              color={t => t.text.primary}
              style={{
                fontFamily: fonts.bold,
                fontSize: 26,
                textAlign: 'center',
              }}
            >
              {title}
            </ThemedText>
            {subtitle ? (
              <ThemedText
                color={t => t.text.secondary}
                style={{
                  fontFamily: fonts.regular,
                  fontSize: 15,
                  lineHeight: 28,
                  textAlign: 'center',
                  writingDirection: 'rtl',
                }}
              >
                {subtitle}
              </ThemedText>
            ) : null}
          </Animated.View>
        </View>

        {/* کارت شیشه‌ای: از یک فاصله‌ی ثابت از بالا شروع می‌شود و تا ته صفحه ادامه دارد */}
        <Animated.View
          entering={FadeInUp.delay(200).duration(550)}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: sheetTop,
            height: windowHeight,
          }}
        >
          <ThemedView
            bg={t => t.auth.sheetBackground}
            border={t => t.auth.sheetBorder}
            style={{
              flex: 1,
              borderTopLeftRadius: 40,
              borderTopRightRadius: 40,
              borderWidth: 1,
              borderBottomWidth: 0,
              paddingHorizontal: 24,
              paddingTop: 28,
              gap: 18,
            }}
          >
            {children}
          </ThemedView>
        </Animated.View>
      </Pressable>
    </Screen>
  );
}
