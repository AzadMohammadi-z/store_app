import type { Order } from './types';

// داده‌ی نمونه؛ بعداً از API می‌آید
export const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    number: '1048237',
    date: '۲۶ آبان ۱۴۰۵',
    state: 'pending',
    paymentExpiresAt: Date.now() + (23 * 60 + 40) * 60 * 1000,
    total: 2350000,
    packages: [
      {
        id: '1a',
        storeName: 'فروشگاه یک',
        itemCount: 2,
        status: 'preparing',
        from: '#3B82F6',
        to: '#6D4AFF',
      },
      {
        id: '1b',
        storeName: 'فروشگاه دو',
        itemCount: 1,
        status: 'preparing',
        from: '#0EA5A4',
        to: '#3B82F6',
      },
    ],
  },
  {
    id: '2',
    number: '1047912',
    date: '۲۰ آبان ۱۴۰۵',
    state: 'processing',
    total: 3180000,
    packages: [
      {
        id: '2a',
        storeName: 'فروشگاه یک',
        itemCount: 1,
        status: 'shipped',
        from: '#0EA5A4',
        to: '#3B82F6',
      },
      {
        id: '2b',
        storeName: 'فروشگاه دو',
        itemCount: 3,
        status: 'preparing',
        from: '#EC4899',
        to: '#8B5CF6',
      },
    ],
  },
  {
    id: '3',
    number: '1045560',
    date: '۸ آبان ۱۴۰۵',
    state: 'delivered',
    total: 890000,
    packages: [
      {
        id: '3a',
        storeName: 'فروشگاه یک',
        itemCount: 1,
        status: 'delivered',
        from: '#3B82F6',
        to: '#6D4AFF',
      },
    ],
  },
  {
    id: '4',
    number: '1039844',
    date: '۱۲ مهر ۱۴۰۵',
    state: 'cancelled',
    total: 1240000,
    packages: [
      {
        id: '4a',
        storeName: 'فروشگاه یک',
        itemCount: 2,
        status: 'preparing',
        from: '#EC4899',
        to: '#8B5CF6',
      },
    ],
  },
];
