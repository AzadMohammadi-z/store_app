import { useState } from 'react';
import type { AddressFields } from '../../address/AddressProvider';
import { isValidIranMobile } from '../../utils/format';

export type AddressPicker = 'province' | 'city' | null;

/** مقدار اولیه؛ فقط بار اول خوانده می‌شود */
export function useAddressForm(initial?: Partial<AddressFields>) {
  const [name, setName] = useState(initial?.name ?? '');
  const [phone, setPhone] = useState(initial?.phone ?? '');
  const [province, setProvince] = useState<string | null>(
    initial?.province ?? null,
  );
  const [city, setCity] = useState<string | null>(initial?.city ?? null);
  const [address, setAddress] = useState(initial?.address ?? '');
  const [postal, setPostal] = useState(initial?.postal ?? '');

  const [picker, setPicker] = useState<AddressPicker>(null);
  const [submitted, setSubmitted] = useState(false);

  const invalid = {
    name: name.trim().length < 3,
    phone: !isValidIranMobile(phone),
    province: !province,
    city: !city,
    address: address.trim().length < 10,
    postal: !/^\d{10}$/.test(postal),
  };

  /** خطاها فقط بعد از اولین تلاش برای ثبت نشان داده می‌شوند */
  const errors = {
    name: submitted && invalid.name,
    phone: submitted && invalid.phone,
    province: submitted && invalid.province,
    city: submitted && invalid.city,
    address: submitted && invalid.address,
    postal: submitted && invalid.postal,
  };

  /** اگر فرم معتبر بود مقدارها را برمی‌گرداند، وگرنه خطاها را نشان می‌دهد و null می‌دهد */
  const validate = (): AddressFields | null => {
    setSubmitted(true);
    if (Object.values(invalid).some(Boolean) || !province || !city) return null;
    return {
      name: name.trim(),
      phone,
      province,
      city,
      address: address.trim(),
      postal,
    };
  };

  return {
    values: { name, phone, province, city, address, postal },
    set: {
      name: setName,
      phone: setPhone,
      province: setProvince,
      city: setCity,
      address: setAddress,
      postal: setPostal,
    },
    errors,
    picker,
    setPicker,
    validate,
  };
}

export type AddressForm = ReturnType<typeof useAddressForm>;
