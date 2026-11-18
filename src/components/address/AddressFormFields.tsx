import React from 'react';
import { Keyboard, View } from 'react-native';
import FormField from '../form/FormField';
import SelectField from '../form/SelectField';
import TextField from '../form/TextField';
import type { AddressForm } from './useAddressForm';
import {
  groupIranMobile,
  normalizeCode,
  normalizeIranMobile,
} from '../../utils/format';

export default function AddressFormFields({ form }: { form: AddressForm }) {
  const { values, set, errors, setPicker } = form;

  return (
    <>
      <FormField
        label="نام و نام خانوادگی"
        error={errors.name ? 'نام و نام خانوادگی را وارد کنید' : undefined}
      >
        <TextField
          value={values.name}
          onChangeText={set.name}
          placeholder="نام و نام خانوادگی گیرنده"
          error={errors.name}
          autoComplete="name"
          returnKeyType="next"
        />
      </FormField>

      <FormField
        label="شماره موبایل"
        error={errors.phone ? 'شماره موبایل معتبر نیست' : undefined}
      >
        <TextField
          numeric
          value={values.phone ? `0${groupIranMobile(values.phone)}` : ''}
          onChangeText={text => set.phone(normalizeIranMobile(text))}
          placeholder="۰۹۱۲ ۳۴۵ ۶۷۸۹"
          error={errors.phone}
          keyboardType="number-pad"
          autoComplete="tel"
          textContentType="telephoneNumber"
        />
      </FormField>

      <View style={{ flexDirection: 'row-reverse', gap: 12 }}>
        <FormField
          label="استان"
          style={{ flex: 1 }}
          error={errors.province ? 'استان را انتخاب کنید' : undefined}
        >
          <SelectField
            value={values.province}
            placeholder="[انتخاب استان]"
            error={errors.province}
            onPress={() => {
              Keyboard.dismiss();
              setPicker('province');
            }}
          />
        </FormField>

        <FormField
          label="شهر"
          style={{ flex: 1 }}
          error={
            errors.city && values.province ? 'شهر را انتخاب کنید' : undefined
          }
        >
          <SelectField
            value={values.city}
            placeholder={
              values.province ? '[انتخاب شهر]' : 'ابتدا استان را انتخاب کنید'
            }
            disabled={!values.province}
            error={errors.city && !!values.province}
            onPress={() => {
              Keyboard.dismiss();
              setPicker('city');
            }}
          />
        </FormField>
      </View>

      <FormField
        label="آدرس کامل"
        error={errors.address ? 'آدرس را کامل‌تر وارد کنید' : undefined}
      >
        <TextField
          multiline
          height={110}
          value={values.address}
          onChangeText={set.address}
          placeholder="خیابان، کوچه، پلاک، واحد"
          error={errors.address}
        />
      </FormField>

      <FormField
        label="کد پستی"
        error={errors.postal ? 'کد پستی باید ۱۰ رقم باشد' : undefined}
        helper="کد پستی ۱۰ رقمی برای ارسال دقیق لازم است."
      >
        <TextField
          numeric
          value={values.postal}
          onChangeText={text => set.postal(normalizeCode(text, 10))}
          placeholder="۱۰ رقم بدون خط تیره"
          error={errors.postal}
          keyboardType="number-pad"
          autoComplete="postal-code"
        />
      </FormField>
    </>
  );
}
