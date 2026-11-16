import React from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { Info, ShoppingBag } from 'lucide-react-native';
import { useCart } from '../../cart/CartProvider';
import GradientButton from '../../components/common/GradientButton';
import Screen from '../../components/common/Screen';
import CartSummary, { DiscountRow } from '../../components/cart/CartSummary';
import PackageCard from '../../components/cart/PackageCard';
import { SCREEN_PADDING, TAB_BAR_SPACE } from '../../constants/layout';
import { fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import { ThemedIcon, ThemedText, ThemedView } from '../../theme/themed';
import { toFaDigits } from '../../utils/format';

function Chip({ text }: { text: string }) {
  return (
    <ThemedView
      bg={t => t.card.background}
      border={t => t.card.border}
      style={{
        height: 40,
        paddingHorizontal: 18,
        borderRadius: 20,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ThemedText
        color={t => t.text.primary}
        style={{ fontFamily: fonts.bold, fontSize: 14 }}
      >
        {text}
      </ThemedText>
    </ThemedView>
  );
}

export default function CartScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const cart = useCart();
  const empty = cart.lines.length === 0;

  const confirmClear = () => {
    Alert.alert('حذف همه', 'همه‌ی کالاهای سبد خرید حذف شوند؟', [
      { text: 'انصراف', style: 'cancel' },
      { text: 'حذف', style: 'destructive', onPress: cart.clear },
    ]);
  };

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: SCREEN_PADDING,
          paddingBottom: TAB_BAR_SPACE,
          gap: 16,
          flexGrow: 1,
        }}
      >
        {/* هدر: عنوان (راست) و حذف همه (چپ) */}
        <View
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <ThemedText
            color={t => t.text.primary}
            style={{ fontFamily: fonts.extrabold, fontSize: 28 }}
          >
            سبد خرید
          </ThemedText>

          {!empty ? (
            <Pressable
              onPress={confirmClear}
              hitSlop={10}
              accessibilityRole="button"
            >
              <ThemedText
                color={t => t.auth.link}
                style={{ fontFamily: fonts.medium, fontSize: 14 }}
              >
                حذف همه
              </ThemedText>
            </Pressable>
          ) : null}
        </View>

        {empty ? (
          <Animated.View
            entering={FadeIn.duration(400)}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              gap: 14,
              paddingBottom: 60,
            }}
          >
            <ThemedIcon
              Icon={ShoppingBag}
              size={64}
              strokeWidth={1.6}
              color={t => t.text.secondary}
            />
            <ThemedText
              color={t => t.text.primary}
              style={{
                fontFamily: fonts.bold,
                fontSize: 18,
                textAlign: 'center',
              }}
            >
              سبد خرید شما خالی است
            </ThemedText>
            <ThemedText
              color={t => t.text.secondary}
              style={{
                fontFamily: fonts.regular,
                fontSize: 14,
                textAlign: 'center',
              }}
            >
              محصول‌های دلخواهت را به سبد اضافه کن.
            </ThemedText>
            <View style={{ alignSelf: 'stretch', marginTop: 8 }}>
              <GradientButton
                label="رفتن به خانه"
                onPress={() => navigation.navigate('Home')}
                from={theme.auth.buttonFrom}
                to={theme.auth.buttonTo}
              />
            </View>
          </Animated.View>
        ) : (
          <>
            {/* قرص‌های آماری */}
            <View style={{ flexDirection: 'row-reverse', gap: 10 }}>
              <Chip text={`${toFaDigits(String(cart.itemCount))} کالا`} />
              <Chip text={`${toFaDigits(String(cart.packageCount))} فروشگاه`} />
              <Chip text={`${toFaDigits(String(cart.packageCount))} بسته`} />
            </View>

            {/* جعبه‌ی توضیح */}
            <ThemedView
              bg={t => t.auth.badgeBackground}
              border={t => t.auth.badgeBorder}
              style={{
                borderWidth: 1,
                borderRadius: 22,
                padding: 16,
                flexDirection: 'row-reverse',
                alignItems: 'flex-start',
                gap: 10,
              }}
            >
              <ThemedIcon
                Icon={Info}
                size={18}
                strokeWidth={2.2}
                color={t => t.auth.link}
              />
              <ThemedText
                color={t => t.text.secondary}
                style={{
                  flex: 1,
                  fontFamily: fonts.regular,
                  fontSize: 13,
                  lineHeight: 24,
                  textAlign: 'right',
                  writingDirection: 'rtl',
                }}
              >
                کالاهای هر فروشگاه در یک بسته‌ی جداگانه ارسال می‌شوند، پس ممکن
                است زمان رسیدن بسته‌ها فرق کند. پرداخت همه‌ی بسته‌ها یک‌جا انجام
                می‌شود.
              </ThemedText>
            </ThemedView>

            {/* بسته‌ها */}
            {cart.groups.map((group, index) => (
              <PackageCard
                key={group.store.id}
                group={group}
                index={index}
                onIncrement={cart.increment}
                onDecrement={cart.decrement}
                onRemove={cart.remove}
              />
            ))}

            <DiscountRow
              onPress={() => {
                // TODO: پنجره یا صفحه‌ی وارد کردن کد تخفیف
              }}
            />

            <CartSummary
              itemCount={cart.itemCount}
              packageCount={cart.packageCount}
              itemsTotal={cart.itemsTotal}
              shippingTotal={cart.shippingTotal}
              discount={cart.discount}
              payable={cart.payable}
              onCheckout={() => {
                // TODO: رفتن به صفحه‌ی پرداخت
              }}
            />
          </>
        )}
      </ScrollView>
    </Screen>
  );
}
