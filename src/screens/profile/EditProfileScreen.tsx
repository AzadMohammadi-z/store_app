import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CalendarDays, Camera, ChevronRight, Lock } from 'lucide-react-native';
import { useAuth } from '../../auth/AuthProvider';
import Avatar from '../../components/account/Avatar';
import GlassCard from '../../components/common/GlassCard';
import GradientButton from '../../components/common/GradientButton';
import ProgressBar from '../../components/common/ProgressBar';
import Screen from '../../components/common/Screen';
import SelectablePill from '../../components/common/SelectablePill';
import SquareButton from '../../components/common/SquareButton';
import FormField from '../../components/form/FormField';
import JalaliDateSheet from '../../components/form/JalaliDateSheet';
import SelectField from '../../components/form/SelectField';
import TextField from '../../components/form/TextField';
import { useModal } from '../../components/modal/ModalProvider';
import StatusPill from '../../components/orders/StatusPill';
import { SCREEN_PADDING } from '../../constants/layout';
import useKeyboardVisible from '../../hooks/useKeyboardVisible';
import type { RootStackParamList } from '../../navigation/types';
import { profileCompletion } from '../../profile/completion';
import { type Gender, useProfile } from '../../profile/ProfileProvider';
import { fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import { ThemedText } from '../../theme/themed';
import { groupIranMobile, toFaDigits } from '../../utils/format';

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

// راست به چپ؛ عدد flex عرض هر قرص را تعیین می‌کند
const GENDERS: { value: Gender; label: string; flex: number }[] = [
  { value: 'female', label: 'زن', flex: 1 },
  { value: 'male', label: 'مرد', flex: 1 },
  { value: 'none', label: 'ترجیح نمی‌دهم', flex: 1.5 },
];

export default function EditProfileScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { phone, logout } = useAuth();
  const { profile, update, reset } = useProfile();
  const { showModal } = useModal();
  const keyboardVisible = useKeyboardVisible();

  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [email, setEmail] = useState(profile.email);
  const [birthDate, setBirthDate] = useState<string | null>(profile.birthDate);
  const [gender, setGender] = useState<Gender | null>(profile.gender);

  const [dateOpen, setDateOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const emailInvalid =
    email.trim() !== '' && !/^\S+@\S+\.\S+$/.test(email.trim());
  const errors = {
    firstName: submitted && firstName.trim().length < 2,
    lastName: submitted && lastName.trim().length < 2,
    email: submitted && emailInvalid,
  };

  // با تایپ، درصد همان لحظه به‌روز می‌شود
  const { percent, hint } = profileCompletion(
    { firstName, lastName, email, birthDate, gender },
    !!phone,
  );
  const displayName = `${firstName} ${lastName}`.trim() || 'کاربر نوازون';

  const changePhoto = () => {
    // TODO: انتخاب عکس نیاز به پکیج native (مثل react-native-image-picker) دارد
    showModal({
      icon: Camera,
      tone: 'purple',
      title: 'تصویر پروفایل',
      message: 'انتخاب و تغییر تصویر پروفایل به‌زودی اضافه می‌شود.',
      actions: [{ label: 'باشه' }],
    });
  };

  const save = () => {
    setSubmitted(true);
    if (
      firstName.trim().length < 2 ||
      lastName.trim().length < 2 ||
      emailInvalid
    )
      return;

    Keyboard.dismiss();
    // TODO: ارسال تغییرات به API
    update({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      birthDate,
      gender,
    });
    navigation.goBack();
  };

  const confirmDelete = () =>
    showModal({
      icon: Camera,
      tone: 'red',
      title: 'حذف حساب کاربری؟',
      message: 'همه‌ی اطلاعات حساب شما حذف می‌شود. این کار قابل بازگشت نیست.',
      actions: [
        {
          label: 'بله، حذف حساب',
          variant: 'danger',
          onPress: () => {
            // TODO: درخواست حذف حساب به API؛ آدرس‌ها و سبد خرید هم باید پاک شوند
            reset();
            navigation.goBack();
            logout();
          },
        },
        { label: 'انصراف' },
      ],
    });

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
          {/* هدر */}
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
              ویرایش حساب
            </ThemedText>
          </View>

          {/* آواتار */}
          <View style={{ alignItems: 'center', gap: 8, paddingVertical: 6 }}>
            <Avatar size={104} onCameraPress={changePhoto} />
            <ThemedText
              color={t => t.text.primary}
              numberOfLines={1}
              style={{ fontFamily: fonts.bold, fontSize: 20, marginTop: 10 }}
            >
              {displayName}
            </ThemedText>
            <Pressable
              onPress={changePhoto}
              hitSlop={10}
              accessibilityRole="button"
            >
              <ThemedText
                color={t => t.text.secondary}
                style={{ fontFamily: fonts.regular, fontSize: 14 }}
              >
                تغییر تصویر پروفایل
              </ThemedText>
            </Pressable>
          </View>

          {/* تکمیل حساب */}
          <GlassCard style={{ padding: 18, gap: 12 }}>
            <View
              style={{
                flexDirection: 'row-reverse',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <ThemedText
                color={t => t.text.primary}
                style={{ fontFamily: fonts.bold, fontSize: 17 }}
              >
                تکمیل حساب کاربری
              </ThemedText>
              <ThemedText
                color={t => t.auth.link}
                style={{ fontFamily: fonts.bold, fontSize: 14 }}
              >
                {toFaDigits(String(percent))}٪
              </ThemedText>
            </View>

            <ProgressBar progress={percent / 100} />

            <ThemedText
              color={t => t.text.secondary}
              style={{
                fontFamily: fonts.regular,
                fontSize: 13,
                lineHeight: 22,
                textAlign: 'right',
                writingDirection: 'rtl',
              }}
            >
              {hint}
            </ThemedText>
          </GlassCard>

          {/* فرم */}
          <GlassCard style={{ padding: 18, gap: 16 }}>
            <View style={{ flexDirection: 'row-reverse', gap: 12 }}>
              <FormField
                label="نام"
                style={{ flex: 1 }}
                error={errors.firstName ? 'نام را وارد کنید' : undefined}
              >
                <TextField
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="نام"
                  error={errors.firstName}
                  autoComplete="given-name"
                  returnKeyType="next"
                />
              </FormField>

              <FormField
                label="نام خانوادگی"
                style={{ flex: 1 }}
                error={
                  errors.lastName ? 'نام خانوادگی را وارد کنید' : undefined
                }
              >
                <TextField
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="نام خانوادگی"
                  error={errors.lastName}
                  autoComplete="family-name"
                  returnKeyType="next"
                />
              </FormField>
            </View>

            <FormField
              label="شماره موبایل"
              labelExtra={<StatusPill label="تأیید شده" tone="green" />}
              helper="برای تغییر شماره، کد تأیید به شماره‌ی جدید ارسال می‌شود."
            >
              <SelectField
                numeric
                Icon={Lock}
                value={phone ? `0${groupIranMobile(phone)}` : null}
                placeholder="—"
              />
            </FormField>

            <FormField
              label="ایمیل"
              optional
              error={errors.email ? 'ایمیل معتبر نیست' : undefined}
            >
              <TextField
                ltr
                value={email}
                onChangeText={setEmail}
                placeholder="name@example.com"
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
              />
            </FormField>

            <FormField label="تاریخ تولد" optional>
              <SelectField
                numeric
                Icon={CalendarDays}
                value={birthDate}
                placeholder="۱۳۷۵/۰۱/۰۱"
                onPress={() => {
                  Keyboard.dismiss();
                  setDateOpen(true);
                }}
              />
            </FormField>

            <FormField label="جنسیت" optional>
              <View style={{ flexDirection: 'row-reverse', gap: 12 }}>
                {GENDERS.map(g => (
                  <SelectablePill
                    key={g.value}
                    label={g.label}
                    height={46}
                    style={{ flex: g.flex }}
                    selected={gender === g.value}
                    // لمس دوباره‌ی گزینه‌ی انتخاب‌شده، آن را برمی‌دارد
                    onPress={() =>
                      setGender(gender === g.value ? null : g.value)
                    }
                  />
                ))}
              </View>
            </FormField>
          </GlassCard>

          {/* حذف حساب */}
          <Pressable
            onPress={confirmDelete}
            hitSlop={10}
            accessibilityRole="button"
            style={{ alignSelf: 'center', paddingVertical: 6 }}
          >
            <ThemedText
              color={t => t.form.error}
              style={{ fontFamily: fonts.medium, fontSize: 15 }}
            >
              حذف حساب کاربری
            </ThemedText>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* دکمه‌ی ثابت پایین؛ با باز شدن کیبورد پنهان می‌شود */}
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
          <GradientButton
            label="ذخیره‌ی تغییرات"
            onPress={save}
            from={theme.auth.buttonFrom}
            to={theme.auth.buttonTo}
            glow={theme.auth.glow}
            height={58}
            radius={29}
          />
        </Animated.View>
      ) : null}

      <JalaliDateSheet
        visible={dateOpen}
        value={birthDate}
        onClose={() => setDateOpen(false)}
        onConfirm={value => {
          setBirthDate(value);
          setDateOpen(false);
        }}
      />
    </Screen>
  );
}
