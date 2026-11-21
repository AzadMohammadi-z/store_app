const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

const FA = '۰۱۲۳۴۵۶۷۸۹';
const AR = '٠١٢٣٤٥٦٧٨٩';

/** ارقام فارسی و عربی را به انگلیسی تبدیل می‌کند */
export function toEnDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, d => String(FA.indexOf(d)))
    .replace(/[٠-٩]/g, d => String(AR.indexOf(d)));
}

/** ورودی خام را به حداکثر ۱۰ رقم موبایل ایران (بدون صفر اول و بدون ۹۸) تبدیل می‌کند */
export function normalizeIranMobile(input: string) {
  let d = toEnDigits(input).replace(/\D/g, '');
  d = d.replace(/^0+/, '');
  if (d.startsWith('98') && d.length > 10) d = d.slice(2);
  return d.slice(0, 10);
}

/** 9123456789 ← 912 345 6789 */
export function groupIranMobile(d: string) {
  return [d.slice(0, 3), d.slice(3, 6), d.slice(6, 10)]
    .filter(Boolean)
    .join(' ');
}

export const isValidIranMobile = (d: string) => /^9\d{9}$/.test(d);

export function toFaDigits(value: string) {
  return value.replace(/\d/g, d => FA_DIGITS[Number(d)]);
}

/** ۱۲۰۰۰۰۰ ← ۱٬۲۰۰٬۰۰۰ */
export function formatPrice(value: number) {
  const grouped = Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '٬');
  return toFaDigits(grouped);
}

/** فقط رقم‌ها را نگه می‌دارد (فارسی و عربی هم قبول است) و به طول مشخص برش می‌دهد */
export function normalizeCode(input: string, length: number) {
  return toEnDigits(input).replace(/\D/g, '').slice(0, length);
}

/** ۸۸ ثانیه ← ۰۱:۲۸ (با ارقام فارسی) */
export function formatTimer(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return toFaDigits(
    `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`,
  );
}

/** ۴٫۸ (جداکننده‌ی اعشار فارسی) */
export function formatRating(value: number) {
  return toFaDigits(value.toFixed(1)).replace('.', '٫');
}
