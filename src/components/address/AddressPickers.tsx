import React from 'react';
import SelectSheet from '../form/SelectSheet';
import type { AddressForm } from './useAddressForm';
import { IRAN, PROVINCES } from '../../data/iran';

export default function AddressPickers({ form }: { form: AddressForm }) {
  const { values, set, picker, setPicker } = form;
  const cities = values.province ? IRAN[values.province] ?? [] : [];

  return (
    <>
      <SelectSheet
        visible={picker === 'province'}
        title="انتخاب استان"
        options={PROVINCES}
        selected={values.province}
        onClose={() => setPicker(null)}
        onSelect={value => {
          if (value !== values.province) set.city(null);
          set.province(value);
          setPicker(null);
        }}
      />
      <SelectSheet
        visible={picker === 'city'}
        title="انتخاب شهر"
        options={cities}
        selected={values.city}
        onClose={() => setPicker(null)}
        onSelect={value => {
          set.city(value);
          setPicker(null);
        }}
      />
    </>
  );
}
