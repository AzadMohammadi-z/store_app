import React, { useState } from 'react';
import { Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import AuthLayout from '../../components/auth/AuthLayout';
import PhoneField from '../../components/auth/PhoneField';
import GradientButton from '../../components/common/GradientButton';
import type { AccountStackParamList } from '../../navigation/types';
import { fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import { ThemedText } from '../../theme/themed';
import { isValidIranMobile } from '../../utils/format';
import { X } from 'lucide-react-native';

type Props = NativeStackScreenProps<AccountStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { theme } = useTheme();

  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const valid = isValidIranMobile(phone);

  const submit = async () => {
    if (!valid || loading) return;
    setLoading(true);
    try {
      // TODO: درخواست ارسال کد تأیید به API (شماره: +98 و phone)
      await new Promise<void>(resolve => setTimeout(resolve, 600));
      navigation.navigate('Verify', { phone });
    } finally {
      setLoading(false);
    }
  };

  // «بعداً»: برگشت به تب خانه
  const goHome = () => {
    navigation.getParent()?.navigate('Home' as never);
  };

  return (
    <AuthLayout
      topAction={{
        icon: X,
        side: 'left',
        onPress: goHome,
        accessibilityLabel: 'بستن',
      }}
      brandName="نوازون"
      title="ورود یا ثبت‌نام"
      subtitle="برای ورود یا ثبت نام شماره موبایل خود را وارد نمایید."
    >
      <ThemedText
        color={t => t.text.secondary}
        style={{ fontFamily: fonts.bold, fontSize: 14, textAlign: 'right' }}
      >
        شماره موبایل
      </ThemedText>

      <PhoneField value={phone} onChange={setPhone} onSubmit={submit} />

      <GradientButton
        label="دریافت کد تأیید"
        onPress={submit}
        from={theme.auth.buttonFrom}
        to={theme.auth.buttonTo}
        glow={theme.auth.glow}
        disabled={!valid}
        loading={loading}
      />

      <ThemedText
        color={t => t.text.secondary}
        style={{
          fontFamily: fonts.regular,
          fontSize: 12,
          lineHeight: 22,
          textAlign: 'center',
          writingDirection: 'rtl',
        }}
      >
        با ورود،{' '}
        <Text
          style={{ color: theme.auth.link, fontFamily: fonts.medium }}
          onPress={() => {
            // TODO: صفحه‌ی قوانین و مقررات
          }}
        >
          قوانین و مقررات
        </Text>{' '}
        و{' '}
        <Text
          style={{ color: theme.auth.link, fontFamily: fonts.medium }}
          onPress={() => {
            // TODO: صفحه‌ی حریم خصوصی
          }}
        >
          حریم خصوصی
        </Text>{' '}
        نوازون را می‌پذیریم.
      </ThemedText>
    </AuthLayout>
  );
}
