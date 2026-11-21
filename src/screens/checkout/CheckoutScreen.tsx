import React, { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, ScrollView, View } from 'react-native';
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
import Screen from '../../components/common/Screen';
import SquareButton from '../../components/common/SquareButton';
import ToggleSwitch from '../../components/form/ToggleSwitch';
import { useModal } from '../../components/modal/ModalProvider';
import { SCREEN_PADDING } from '../../constants/layout';
import type { RootStackParamList } from '../../navigation/types';
import { fonts } from '../../theme/fonts';
import { ThemedText } from '../../theme/themed';
import { formatPrice, toFaDigits } from '../../utils/format';
import StickyActionBar from '../../components/common/StickyActionBar';

type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>;

export default function CheckoutScreen({ navigation }: Props) {
  const cart = useCart();
  const { phone: authPhone } = useAuth();
  const { addresses, defaultAddress, addAddress } = useAddresses();
  const { showModal } = useModal();

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
      <StickyActionBar
        label="قابل پرداخت"
        value={`${formatPrice(cart.payable)} تومان`}
        actionLabel="تأیید و پرداخت"
        onAction={submit}
        hideOnKeyboard
      />

      <AddressPickers form={form} />
    </Screen>
  );
}
