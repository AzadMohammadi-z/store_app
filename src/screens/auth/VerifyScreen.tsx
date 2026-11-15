import React, { useEffect, useState } from 'react';
import { Keyboard, Pressable, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronRight } from 'lucide-react-native';
import AuthLayout from '../../components/auth/AuthLayout';
import OtpField, { CODE_LENGTH } from '../../components/auth/OtpField';
import ResendButton from '../../components/auth/ResendButton';
import GradientButton from '../../components/common/GradientButton';
import { useAuth } from '../../auth/AuthProvider';
import type { AccountStackParamList } from '../../navigation/types';
import { fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import { ThemedText } from '../../theme/themed';
import { groupIranMobile, toFaDigits } from '../../utils/format';

type Props = NativeStackScreenProps<AccountStackParamList, 'Verify'>;

const RESEND_SECONDS = 120;

export default function VerifyScreen({ navigation, route }: Props) {
  const { phone } = route.params;
  const { theme } = useTheme();
  const { login } = useAuth();

  const [code, setCode] = useState('');
  const [left, setLeft] = useState(RESEND_SECONDS);
  const [loading, setLoading] = useState(false);

  // شمارش معکوس ارسال دوباره
  useEffect(() => {
    if (left <= 0) return;
    const id = setTimeout(() => setLeft(s => s - 1), 1000);
    return () => clearTimeout(id);
  }, [left]);

  const valid = code.length === CODE_LENGTH;
  const shownPhone = toFaDigits(`0${groupIranMobile(phone)}`).replace(
    / /g,
    '\u00A0',
  );

  const submit = async () => {
    if (!valid || loading) return;
    Keyboard.dismiss();
    setLoading(true);
    // TODO: بررسی کد با API
    await new Promise<void>(resolve => setTimeout(resolve, 800));
    login();
  };

  const resend = () => {
    // TODO: درخواست ارسال دوباره‌ی کد به API
    setCode('');
    setLeft(RESEND_SECONDS);
  };

  return (
    <AuthLayout
      topAction={{
        icon: ChevronRight,
        onPress: () => navigation.goBack(),
        accessibilityLabel: 'بازگشت',
      }}
      brandName="نوازون"
      title="کد تأیید را وارد کنید"
      subtitle={
        <>
          کد {toFaDigits(String(CODE_LENGTH))} رقمی ارسال‌شده به{' '}
          <Text style={{ color: theme.text.primary, fontFamily: fonts.bold }}>
            {shownPhone}
          </Text>{' '}
          را وارد کنید.
        </>
      }
    >
      <Pressable
        onPress={() => navigation.goBack()}
        hitSlop={10}
        accessibilityRole="button"
        style={{ alignSelf: 'center', marginBottom: 10 }}
      >
        <ThemedText
          color={t => t.auth.link}
          style={{ fontFamily: fonts.bold, fontSize: 14, textAlign: 'center' }}
        >
          ویرایش شماره
        </ThemedText>
      </Pressable>

      <OtpField value={code} onChange={setCode} onSubmit={submit} />

      <GradientButton
        label="تأیید و ورود"
        onPress={submit}
        from={theme.auth.buttonFrom}
        to={theme.auth.buttonTo}
        glow={theme.auth.glow}
        disabled={!valid}
        loading={loading}
      />

      <ResendButton seconds={left} onPress={resend} />
    </AuthLayout>
  );
}
