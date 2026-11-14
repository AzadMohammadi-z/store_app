const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

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
