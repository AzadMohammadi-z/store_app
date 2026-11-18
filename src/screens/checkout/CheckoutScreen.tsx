import React, { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, ScrollView, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronRight, CircleCheck } from 'lucide-react-native';
import { useAddresses } from '../../address/AddressProvider';
import { useAuth } from '../../auth/AuthProvider';
import { useCart } from '../../cart/CartProvider';
import AddressFormFields from '../../components/address/AddressFormFields';
import AddressPickers from '../../components/address/AddressPickers';
import { useAddressForm } from '../../components/address/useAddressForm';
import CheckoutStepper from '../../components/checkout/CheckoutStepper';
import CheckoutSummary from '../../components/checkout/CheckoutSummary';
import GlassCard from '../../components/common/GlassCard';
import GradientButton from '../../components/common/GradientButton';
import Screen from '../../components/common/Screen';
import SquareButton from '../../components/common/SquareButton';
import ToggleSwitch from '../../components/form/ToggleSwitch';
import { useModal } from '../../components/modal/ModalProvider';
import { SCREEN_PADDING } from '../../constants/layout';
import useKeyboardVisible from '../../hooks/useKeyboardVisible';
import type { RootStackParamList } from '../../navigation/types';
import { fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import { ThemedText, ThemedView } from '../../theme/themed';
import { formatPrice, toFaDigits } from '../../utils/format';

type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>;

export default function CheckoutScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const cart = useCart();
  const { phone: authPhone } = useAuth();
  const { addresses, defaultAddress, addAddress } = useAddresses();
  const { showModal } = useModal();
  const keyboardVisible = useKeyboardVisible();

  // از آدرس پیش‌فرض پر می‌شود؛ اگر نبود، فقط شماره‌ی ورود
  const form = useAddressForm(defaultAddress ?? { phone: authPhone });
  const [remember, setRemember] = useState(true);

  const submit = () => {
    const values = form.validate();
    if (!values) return;

    Keyboard.dismiss();

    if (remember) {
      const exists = addresses.some(
        a => a.postal === values.postal && a.address === values.address,
      );
      if (!exists) {
        addAddress({
          ...values,
          title:
            addresses.length === 0
              ? 'خانه'
              : `آدرس ${toFaDigits(String(addresses.length + 1))}`,
        });
      }
    }

    // TODO: ثبت سفارش و رفتن به مرحله‌ی پرداخت
    showModal({
      icon: CircleCheck,
      tone: 'teal',
      title: 'اطلاعات ارسال ثبت شد',
      message: 'مرحله‌ی پرداخت به‌زودی اضافه می‌شود.',
      autoClose: 2000,
    });
  };

  return (
    <Screen standalone>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: SCREEN_PADDING,
            paddingBottom: 150,
            gap: 16,
          }}
        >
          {/* هدر: بازگشت (راست) و عنوان */}
          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <SquareButton
              Icon={ChevronRight}
              onPress={() => navigation.goBack()}
              label="بازگشت"
            />
            <ThemedText
              color={t => t.text.primary}
              style={{ fontFamily: fonts.extrabold, fontSize: 26 }}
            >
              اطلاعات ارسال
            </ThemedText>
          </View>

          <CheckoutStepper current={1} />

          {/* مشخصات گیرنده */}
          <GlassCard style={{ padding: 18, gap: 16 }}>
            <ThemedText
              color={t => t.text.primary}
              style={{
                fontFamily: fonts.bold,
                fontSize: 18,
                textAlign: 'right',
              }}
            >
              مشخصات گیرنده
            </ThemedText>

            <AddressFormFields form={form} />

            <View
              style={{
                flexDirection: 'row-reverse',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <ThemedText
                color={t => t.text.primary}
                style={{
                  flex: 1,
                  fontFamily: fonts.bold,
                  fontSize: 14,
                  textAlign: 'right',
                }}
              >
                ذخیره‌ی این آدرس برای خریدهای بعدی
              </ThemedText>
              <ToggleSwitch
                value={remember}
                onChange={setRemember}
                label="ذخیره‌ی این آدرس برای خریدهای بعدی"
              />
            </View>
          </GlassCard>

          <CheckoutSummary onEditCart={() => navigation.goBack()} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* نوار پایین: با باز شدن کیبورد پنهان می‌شود */}
      {!keyboardVisible ? (
        <Animated.View
          entering={FadeInDown.duration(250)}
          exiting={FadeOutDown.duration(180)}
          style={{
            position: 'absolute',
            left: SCREEN_PADDING,
            right: SCREEN_PADDING,
            bottom: Math.max(insets.bottom, 12),
          }}
        >
          <ThemedView
            bg={t => t.modal.card}
            border={t => t.modal.cardBorder}
            style={{
              borderWidth: 1,
              borderRadius: 28,
              padding: 12,
              flexDirection: 'row-reverse',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <View
              style={{ alignItems: 'flex-end', gap: 2, paddingHorizontal: 6 }}
            >
              <ThemedText
                color={t => t.text.secondary}
                style={{ fontFamily: fonts.regular, fontSize: 12 }}
              >
                قابل پرداخت
              </ThemedText>
              <ThemedText
                color={t => t.text.primary}
                style={{ fontFamily: fonts.bold, fontSize: 17 }}
              >
                {formatPrice(cart.payable)} تومان
              </ThemedText>
            </View>

            <View style={{ flex: 1 }}>
              <GradientButton
                label="تأیید و پرداخت"
                onPress={submit}
                from={theme.auth.buttonFrom}
                to={theme.auth.buttonTo}
                height={52}
                radius={20}
              />
            </View>
          </ThemedView>
        </Animated.View>
      ) : null}

      <AddressPickers form={form} />
    </Screen>
  );
}
