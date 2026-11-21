import type { StoreInfo } from '../cart/CartProvider';
import type { Product } from '../components/home/ProductCard';

// داده‌ی نمونه؛ بعداً از API می‌آید
export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'نام محصول',
    store: 'فروشگاه یک',
    price: 1250000,
    from: '#93C5FD',
    to: '#C4B5FD',
  },
  {
    id: '2',
    name: 'نام محصول',
    store: 'فروشگاه دو',
    price: 890000,
    from: '#C4B5FD',
    to: '#F9A8D4',
  },
  {
    id: '3',
    name: 'نام محصول',
    store: 'فروشگاه سه',
    price: 2400000,
    from: '#A5B4FC',
    to: '#67E8F9',
  },
  {
    id: '4',
    name: 'نام محصول',
    store: 'فروشگاه یک',
    price: 560000,
    from: '#F9A8D4',
    to: '#FCA5A5',
  },
  {
    id: '5',
    name: 'نام محصول',
    store: 'فروشگاه دو',
    price: 3150000,
    from: '#86EFAC',
    to: '#93C5FD',
  },
  {
    id: '6',
    name: 'نام محصول',
    store: 'فروشگاه سه',
    price: 740000,
    from: '#FDE68A',
    to: '#F9A8D4',
  },
];

/** اطلاعات نمونه‌ی فروشگاه برای سبد خرید (هزینه و زمان ارسال بعداً از API می‌آید) */
export function mockStoreInfo(
  name: string,
  from?: string,
  to?: string,
): StoreInfo {
  return {
    id: name,
    name,
    city: 'تهران',
    shippingCost: 45000,
    eta: '۱ تا ۳ روز کاری',
    from,
    to,
  };
}

export type ProductColor = { id: string; name: string; hex: string };

export type ProductDetail = {
  id: string;
  name: string;
  store: {
    id: string;
    name: string;
    city: string;
    rating: number;
    badge?: string;
    from?: string;
    to?: string;
  };
  /** قیمت نهایی (تومان) */
  price: number;
  oldPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  gallery: { id: string; from: string; to: string; image?: { uri: string } }[];
  colors: ProductColor[];
  sizes: string[];
  shipping: { fromCity: string; eta: string };
  returnPolicy: string;
  description: string;
  specs: { label: string; value: string }[];
};

const GALLERY_COLORS: [string, string][] = [
  ['#6D4AFF', '#3B82F6'],
  ['#3B82F6', '#0EA5A4'],
  ['#8B5CF6', '#EC4899'],
  ['#0EA5A4', '#6D4AFF'],
];

/** جزئیات نمونه؛ بعداً از API می‌آید */
export function getProductDetail(id: string): ProductDetail | null {
  const base = PRODUCTS.find(p => p.id === id);
  if (!base) return null;

  return {
    id: base.id,
    name: base.name,
    store: {
      id: base.store,
      name: base.store,
      city: 'تهران',
      rating: 4.9,
      badge: 'فروشگاه برتر',
      from: base.from,
      to: base.to,
    },
    price: base.price,
    oldPrice: Math.round(base.price / 0.8 / 1000) * 1000,
    discountPercent: 20,
    rating: 4.8,
    reviewCount: 128,
    inStock: true,
    gallery: GALLERY_COLORS.map(([from, to], i) => ({ id: `g${i}`, from, to })),
    colors: [
      { id: 'purple', name: 'بنفش', hex: '#6D28D9' },
      { id: 'teal', name: 'فیروزه‌ای', hex: '#0E7FA8' },
      { id: 'pink', name: 'سرخابی', hex: '#BE185D' },
      { id: 'white', name: 'سفید', hex: '#E5E7EB' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    shipping: { fromCity: 'تهران', eta: '۱ تا ۳ روز کاری' },
    returnPolicy: 'طبق قوانین مرجوعی همین فروشگاه',
    description:
      'توضیحات محصول: لورم ایپسوم متن ساختگی برای نمایش طراحی. این متن جایگزین توضیحات واقعی فروشنده می‌شود. لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ است و برای شرح بیشتر محصول استفاده می‌شود.',
    specs: [
      { label: 'جنس', value: 'پنبه' },
      { label: 'وزن', value: '۳۵۰ گرم' },
      { label: 'کشور سازنده', value: 'ایران' },
    ],
  };
}
