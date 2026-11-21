import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import Screen from '../../components/common/Screen';
import SearchBox from '../../components/common/SearchBox';
import HeroCarousel, { type Slide } from '../../components/home/HeroCarousel';
import {
  SCREEN_PADDING,
  SECTION_GAP,
  TAB_BAR_SPACE,
} from '../../constants/layout';
import HomeHeader from './components/HomeHeader';
import SectionHeader from '../../components/common/SectionHeader';
import TopStoresList, { type Store } from '../../components/home/TopStoresList';
import ProductGrid from '../../components/home/ProductGrid';
import { useNavigation } from '@react-navigation/native';
import { PRODUCTS, mockStoreInfo } from '../../data/products';
import { useCart } from '../../cart/CartProvider';

// داده‌ی نمونه؛ بعداً از API می‌آید
const STORES: Store[] = [
  {
    id: '1',
    name: 'فروشگاه یک',
    category: 'نوع فروشگاه',
    from: '#60A5FA',
    to: '#A78BFA',
  },
  {
    id: '2',
    name: 'فروشگاه دو',
    category: 'نوع فروشگاه',
    from: '#34D399',
    to: '#3B82F6',
  },
  {
    id: '3',
    name: 'فروشگاه سه',
    category: 'نوع فروشگاه',
    from: '#F472B6',
    to: '#8B5CF6',
  },
  {
    id: '4',
    name: 'فروشگاه چهار',
    category: 'نوع فروشگاه',
    from: '#FBBF24',
    to: '#F472B6',
  },
  {
    id: '5',
    name: 'فروشگاه پنج',
    category: 'نوع فروشگاه',
    from: '#818CF8',
    to: '#22D3EE',
  },
];

// داده‌ی نمونه؛ بعداً از API می‌آید
const SLIDES: Slide[] = [
  {
    id: '1',
    badge: 'عنوان تصویر',
    title: 'متن برتر تبلیغاتی',
    subtitle: 'توضیح کوتاه درباره‌ی این پیشنهاد',
    accent: '#8B5CF6',
  },
  {
    id: '2',
    badge: 'جدید',
    title: 'فروشگاه‌های ویژه این هفته',
    subtitle: 'تخفیف‌های محدود را از دست نده',
    accent: '#3B82F6',
  },
  {
    id: '3',
    badge: 'پیشنهاد',
    title: 'خرید با سکه و تخفیف بیشتر',
    subtitle: 'هر خرید، امتیاز بیشتر',
    accent: '#EC4899',
  },
];

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [query, setQuery] = useState('');
  const { addItem } = useCart();
  return (
    <Screen>
      <View
        style={{
          paddingHorizontal: SCREEN_PADDING,
          paddingTop: 8,
          paddingBottom: 12,
          gap: 14,
        }}
      >
        <HomeHeader />
        <SearchBox value={query} onChangeText={setQuery} />
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingTop: SECTION_GAP - 12,
          paddingBottom: TAB_BAR_SPACE,
          gap: SECTION_GAP,
        }}
      >
        <HeroCarousel slides={SLIDES} />

        <View style={{ gap: 12 }}>
          <SectionHeader
            title="فروشگاه‌های برتر"
            onPressAction={() => {
              // بعداً: رفتن به صفحه‌ی همه‌ی فروشگاه‌ها
            }}
          />
          <TopStoresList
            stores={STORES}
            onPressStore={store => {
              // بعداً: رفتن به صفحه‌ی فروشگاه
            }}
          />
        </View>

        <View style={{ gap: 12 }}>
          <SectionHeader title="پیشنهاد برای شما" />
          <ProductGrid
            products={PRODUCTS}
            onPressProduct={p => navigation.navigate('Product', { id: p.id })}
            onAdd={p =>
              addItem({
                id: p.id,
                name: p.name,
                specs: 'مشخصات محصول',
                price: p.price,
                from: p.from,
                to: p.to,
                store: mockStoreInfo(p.store, p.from, p.to),
              })
            }
          />
        </View>

        {/* بخش‌های بعدی: فروشگاه‌های برتر، پیشنهاد برای شما (با paddingHorizontal: 16) */}
      </ScrollView>
    </Screen>
  );
}
