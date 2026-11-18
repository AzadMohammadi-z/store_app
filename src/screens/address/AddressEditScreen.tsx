import React, { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronRight } from 'lucide-react-native';
import { useAddresses } from '../../address/AddressProvider';
import { useAuth } from '../../auth/AuthProvider';
import AddressFormFields from '../../components/address/AddressFormFields';
import AddressPickers from '../../components/address/AddressPickers';
import { useAddressForm } from '../../components/address/useAddressForm';
import GlassCard from '../../components/common/GlassCard';
import GradientButton from '../../components/common/GradientButton';
import Screen from '../../components/common/Screen';
import SquareButton from '../../components/common/SquareButton';
import FormField from '../../components/form/FormField';
import TextField from '../../components/form/TextField';
import ToggleSwitch from '../../components/form/ToggleSwitch';
import { SCREEN_PADDING } from '../../constants/layout';
import type { RootStackParamList } from '../../navigation/types';
import { fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import { ThemedText } from '../../theme/themed';

type Props = NativeStackScreenProps<RootStackParamList, 'AddressEdit'>;

export default function AddressEditScreen({ navigation, route }: Props) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { phone: authPhone } = useAuth();
  const { addresses, addAddress, updateAddress } = useAddresses();

  const id = route.params?.id;
  const [existing] = useState(() => addresses.find(a => a.id === id));
  const editing = !!existing;

  const form = useAddressForm(existing ?? { phone: authPhone });
  const [title, setTitle] = useState(existing?.title ?? '');
  const [titleError, setTitleError] = useState(false);
  const [makeDefault, setMakeDefault] = useState(existing?.isDefault ?? false);

  // اولین آدرس خودکار پیش‌فرض می‌شود و آدرس پیش‌فرض هم نیازی به کلید ندارد
  const showDefaultToggle = existing
    ? !existing.isDefault
    : addresses.length > 0;

  const submit = () => {
    const values = form.validate();
    const titleInvalid = title.trim().length < 2;
    setTitleError(titleInvalid);
    if (!values || titleInvalid) return;

    Keyboard.dismiss();
    const data = { ...values, title: title.trim(), isDefault: makeDefault };

    if (existing) updateAddress(existing.id, data);
    else addAddress(data);

    navigation.goBack();
  };

  return (
    <Screen standalone>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: SCREEN_PADDING,
            paddingBottom: Math.max(insets.bottom, 12) + 24,
            gap: 16,
          }}
        >
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
              {editing ? 'ویرایش آدرس' : 'افزودن آدرس جدید'}
            </ThemedText>
          </View>

          <GlassCard style={{ padding: 18, gap: 16 }}>
            <FormField
              label="عنوان آدرس"
              error={titleError ? 'عنوان آدرس را وارد کنید' : undefined}
            >
              <TextField
                value={title}
                onChangeText={setTitle}
                placeholder="مثلاً خانه، محل کار"
                error={titleError}
                returnKeyType="next"
              />
            </FormField>

            <AddressFormFields form={form} />

            {showDefaultToggle ? (
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
                  تنظیم به‌عنوان آدرس پیش‌فرض
                </ThemedText>
                <ToggleSwitch
                  value={makeDefault}
                  onChange={setMakeDefault}
                  label="تنظیم به‌عنوان آدرس پیش‌فرض"
                />
              </View>
            ) : null}
          </GlassCard>

          <GradientButton
            label={editing ? 'ذخیره‌ی تغییرات' : 'ذخیره‌ی آدرس'}
            onPress={submit}
            from={theme.auth.buttonFrom}
            to={theme.auth.buttonTo}
            glow={theme.auth.glow}
            height={58}
            radius={29}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <AddressPickers form={form} />
    </Screen>
  );
}
