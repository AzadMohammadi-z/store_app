import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOutUp,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronRight, ClipboardList, Search, X } from 'lucide-react-native';
import Screen from '../../components/common/Screen';
import SearchBox from '../../components/common/SearchBox';
import SquareButton from '../../components/common/SquareButton';
import OrderCard from '../../components/orders/OrderCard';
import OrderFilters from '../../components/orders/OrderFilters';
import { SCREEN_PADDING } from '../../constants/layout';
import type { RootStackParamList } from '../../navigation/types';
import { MOCK_ORDERS } from '../../orders/mockOrders';
import { FILTERS, type OrderFilter, matchesFilter } from '../../orders/types';
import { fonts } from '../../theme/fonts';
import { ThemedIcon, ThemedText } from '../../theme/themed';
import { toEnDigits } from '../../utils/format';

type Props = NativeStackScreenProps<RootStackParamList, 'Orders'>;

const todo = () => {
  // TODO: صفحه‌ی مربوطه (پرداخت، جزئیات و پیگیری، ثبت نظر)
};

export default function OrdersScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const orders = MOCK_ORDERS; // TODO: دریافت از API

  const [filter, setFilter] = useState<OrderFilter>(
    route.params?.filter ?? 'all',
  );
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  // اگر صفحه باز بود و دوباره با فیلتر دیگری صدا زده شد
  useEffect(() => {
    if (route.params?.filter) setFilter(route.params.filter);
  }, [route.params?.filter]);

  const counts = Object.fromEntries(
    FILTERS.map(f => [
      f.key,
      orders.filter(o => matchesFilter(o, f.key)).length,
    ]),
  ) as Record<OrderFilter, number>;

  const q = toEnDigits(query).trim();
  const visible = orders.filter(
    o =>
      matchesFilter(o, filter) &&
      (!q ||
        o.number.includes(q) ||
        o.packages.some(p => p.storeName.includes(q))),
  );

  const toggleSearch = () => {
    if (searchOpen) setQuery('');
    setSearchOpen(open => !open);
  };

  return (
    <Screen standalone>
      <View
        style={{ paddingHorizontal: SCREEN_PADDING, paddingTop: 8, gap: 14 }}
      >
        {/* هدر: بازگشت (راست)، عنوان، جست‌وجو (چپ) */}
        <View
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <SquareButton
            Icon={ChevronRight}
            onPress={() => navigation.goBack()}
            label="بازگشت"
          />
          <ThemedText
            color={t => t.text.primary}
            style={{
              flex: 1,
              fontFamily: fonts.extrabold,
              fontSize: 26,
              textAlign: 'right',
            }}
          >
            سفارش‌های من
          </ThemedText>
          <SquareButton
            Icon={searchOpen ? X : Search}
            onPress={toggleSearch}
            label={searchOpen ? 'بستن جست‌وجو' : 'جست‌وجو'}
          />
        </View>

        {searchOpen ? (
          <Animated.View
            entering={FadeInDown.duration(250)}
            exiting={FadeOutUp.duration(180)}
          >
            <SearchBox
              value={query}
              onChangeText={setQuery}
              placeholder="شماره‌ی سفارش یا نام فروشگاه"
            />
          </Animated.View>
        ) : null}
      </View>

      <View style={{ marginTop: 14 }}>
        <OrderFilters value={filter} counts={counts} onChange={setFilter} />
      </View>

      <FlatList
        data={visible}
        keyExtractor={o => o.id}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          padding: SCREEN_PADDING,
          paddingBottom: insets.bottom + 24,
          gap: 16,
          flexGrow: 1,
        }}
        ListEmptyComponent={
          <Animated.View
            entering={FadeIn.duration(300)}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              paddingBottom: 80,
            }}
          >
            <ThemedIcon
              Icon={ClipboardList}
              size={56}
              strokeWidth={1.6}
              color={t => t.text.secondary}
            />
            <ThemedText
              color={t => t.text.primary}
              style={{
                fontFamily: fonts.bold,
                fontSize: 17,
                textAlign: 'center',
              }}
            >
              سفارشی پیدا نشد
            </ThemedText>
          </Animated.View>
        }
        renderItem={({ item, index }) => (
          <OrderCard
            order={item}
            index={index}
            onPay={todo}
            onDetails={todo}
            onReview={todo}
          />
        )}
      />
    </Screen>
  );
}
