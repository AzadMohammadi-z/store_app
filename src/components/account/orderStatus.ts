import type { Tone } from './IconTile';

export type OrderStatus = 'pending' | 'preparing' | 'shipped' | 'delivered';

export const STATUS_META: Record<
  OrderStatus,
  { label: string; tone: Tone; progress: number }
> = {
  pending: { label: 'در انتظار پرداخت', tone: 'blue', progress: 0.1 },
  preparing: { label: 'در حال آماده‌سازی', tone: 'amber', progress: 0.35 },
  shipped: { label: 'ارسال شد', tone: 'teal', progress: 0.7 },
  delivered: { label: 'تحویل شد', tone: 'purple', progress: 1 },
};
