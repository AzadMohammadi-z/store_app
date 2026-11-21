export const JALALI_MONTHS = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];

/** قاعده‌ی ۳۳ ساله‌ی کبیسه؛ برای سال‌های جاری و گذشته دقیق است */
export function isJalaliLeap(year: number) {
  return [1, 5, 9, 13, 17, 22, 26, 30].includes(year % 33);
}

export function daysInJalaliMonth(year: number, month: number) {
  if (month <= 6) return 31;
  if (month <= 11) return 30;
  return isJalaliLeap(year) ? 30 : 29;
}

/** سال شمسی جاری (قبل از ۲۱ مارس هنوز سال قبل است) */
export function currentJalaliYear(now = new Date()) {
  const beforeNowruz =
    now.getMonth() < 2 || (now.getMonth() === 2 && now.getDate() < 21);
  return now.getFullYear() - (beforeNowruz ? 622 : 621);
}

const pad = (n: number) => String(n).padStart(2, '0');

/** ۱۳۷۵، ۱، ۱ ← "1375/01/01" (ارقام انگلیسی؛ برای نمایش با فونت ارقام فارسی رسم می‌شود) */
export const formatJalali = (y: number, m: number, d: number) =>
  `${y}/${pad(m)}/${pad(d)}`;

export function parseJalali(value: string | null) {
  const match = value ? /^(\d{4})\/(\d{2})\/(\d{2})$/.exec(value) : null;
  return match
    ? { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) }
    : null;
}
