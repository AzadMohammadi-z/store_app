import type { OrderStatus } from '../components/account/orderStatus';

export type PackageStatus = Exclude<OrderStatus, 'pending'>;
export type OrderState = 'pending' | 'processing' | 'delivered' | 'cancelled';
export type OrderFilter =
  | 'all'
  | 'pending'
  | 'preparing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type OrderPackage = {
  id: string;
  storeName: string;
  itemCount: number;
  status: PackageStatus;
  from?: string;
  to?: string;
};

export type Order = {
  id: string;
  /** شماره‌ی سفارش با ارقام انگلیسی */
  number: string;
  /** تاریخ برای نمایش، مثلاً «۲۶ آبان ۱۴۰۵» */
  date: string;
  state: OrderState;
  /** فقط برای سفارش در انتظار پرداخت: زمان پایان مهلت (میلی‌ثانیه) */
  paymentExpiresAt?: number;
  /** تومان */
  total: number;
  packages: OrderPackage[];
};

export const FILTERS: { key: OrderFilter; label: string }[] = [
  { key: 'all', label: 'همه' },
  { key: 'pending', label: 'در انتظار پرداخت' },
  { key: 'preparing', label: 'در حال آماده‌سازی' },
  { key: 'shipped', label: 'ارسال‌شده' },
  { key: 'delivered', label: 'تحویل‌شده' },
  { key: 'cancelled', label: 'لغو شده' },
];

export function matchesFilter(order: Order, filter: OrderFilter): boolean {
  switch (filter) {
    case 'all':
      return true;
    case 'pending':
      return order.state === 'pending';
    case 'preparing':
      return (
        order.state === 'processing' &&
        order.packages.some(p => p.status === 'preparing')
      );
    case 'shipped':
      return (
        order.state === 'processing' &&
        order.packages.some(p => p.status === 'shipped')
      );
    case 'delivered':
      return order.state === 'delivered';
    case 'cancelled':
      return order.state === 'cancelled';
  }
}
