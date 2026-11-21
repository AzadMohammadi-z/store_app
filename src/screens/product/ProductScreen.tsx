import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Share, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ChevronRight,
  CircleCheck,
  ShoppingBag,
  Star,
} from 'lucide-react-native';
import { useCart } from '../../cart/CartProvider';
import ProductGallery from '../../components/product/ProductGallery';
import ProductOptions from '../../components/product/ProductOptions';
import {
  DescriptionCard,
  ReviewsSummary,
  ShippingCard,
  StoreCard,
} from '../../components/product/ProductSections';
import Screen from '../../components/common/Screen';
import SquareButton from '../../components/common/SquareButton';
import StickyActionBar from '../../components/common/StickyActionBar';
import { useModal } from '../../components/modal/ModalProvider';
import StatusPill from '../../components/orders/StatusPill';
import { SCREEN_PADDING } from '../../constants/layout';
import {
  type ProductDetail,
  getProductDetail,
  mockStoreInfo,
} from '../../data/products';
import { useFavorites } from '../../favorites/FavoritesProvider';
import type { RootStackParamList } from '../../navigation/types';
import { fonts } from '../../theme/fonts';
import { ThemedText } from '../../theme/themed';
import { formatPrice, formatRating, toFaDigits } from '../../utils/format';

type Props = NativeStackScreenProps<RootStackParamList, 'Product'>;

const GOLD = '#FBBF24';

const todo = () => {
  // TODO: صفحه‌ی فروشگاه و صفحه‌ی نظرها
};

function ProductContent({
  product,
  navigation,
}: { product: ProductDetail } & Pick<Props, 'navigation'>) {
  const { addItem } = useCart();
  const { isFavorite, toggle } = useFavorites();
  const { showModal } = useModal();

  const [colorId, setColorId] = useState<string | undefined>(
    product.colors[0]?.id,
  );
  const [size, setSize] = useState<string | undefined>(product.sizes[0]);

  const share = () => {
    // TODO: لینک محصول وقتی آدرس‌دهی (deep link) ساخته شد
    Share.share({ message: `${product.name} را در نوازون ببین` });
  };

  const addToCart = () => {
    const color = product.colors.find(c => c.id === colorId);

    addItem({
      // هر ترکیب رنگ و اندازه یک ردیف جدا در سبد است
      id: [product.id, colorId, size].filter(Boolean).join(':'),
      name: product.name,
      specs:
        [color && `رنگ: ${color.name}`, size && `سایز: ${size}`]
          .filter(Boolean)
          .join(' · ') || undefined,
      price: product.price,
      from: product.gallery[0]?.from,
      to: product.gallery[0]?.to,
      store: mockStoreInfo(
        product.store.name,
        product.store.from,
        product.store.to,
      ),
    });

    showModal({
      icon: CircleCheck,
      tone: 'teal',
      title: 'به سبد خرید اضافه شد',
      actions: [
        {
          label: 'مشاهده‌ی سبد',
          variant: 'brand',
          onPress: () => navigation.navigate('MainTabs', { screen: 'Cart' }),
        },
        { label: 'ادامه‌ی خرید' },
      ],
    });
  };

  return (
    <Screen standalone>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 130, gap: 18 }}
      >
        <ProductGallery
          gallery={product.gallery}
          discountPercent={product.discountPercent}
          favorite={isFavorite(product.id)}
          onBack={() => navigation.goBack()}
          onShare={share}
          onToggleFavorite={() => toggle(product.id)}
        />

        {/* اطلاعات اصلی */}
        <View style={{ paddingHorizontal: SCREEN_PADDING, gap: 10 }}>
          <Pressable
            onPress={todo}
            hitSlop={8}
            accessibilityRole="button"
            style={{ alignSelf: 'flex-end' }}
          >
            <ThemedText
              color={t => t.auth.link}
              style={{ fontFamily: fonts.medium, fontSize: 15 }}
            >
              {product.store.name}
            </ThemedText>
          </Pressable>

          <ThemedText
            color={t => t.text.primary}
            style={{
              fontFamily: fonts.extrabold,
              fontSize: 26,
              textAlign: 'right',
            }}
          >
            {product.name}
          </ThemedText>

          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View
              style={{
                flexDirection: 'row-reverse',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Star size={16} color={GOLD} fill={GOLD} strokeWidth={1.5} />
              <ThemedText
                color={t => t.text.primary}
                style={{ fontFamily: fonts.bold, fontSize: 15 }}
              >
                {formatRating(product.rating)}
              </ThemedText>
              <ThemedText
                color={t => t.text.secondary}
                style={{ fontFamily: fonts.regular, fontSize: 14 }}
              >
                ({toFaDigits(String(product.reviewCount))} نظر)
              </ThemedText>
            </View>

            <StatusPill
              label={product.inStock ? 'موجود' : 'ناموجود'}
              tone={product.inStock ? 'green' : 'red'}
            />
          </View>

          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'baseline',
              gap: 12,
            }}
          >
            <ThemedText
              color={t => t.text.primary}
              style={{ fontFamily: fonts.bold, fontSize: 28 }}
            >
              {formatPrice(product.price)} تومان
            </ThemedText>
            {product.oldPrice ? (
              <ThemedText
                color={t => t.text.secondary}
                style={{
                  fontFamily: fonts.regular,
                  fontSize: 15,
                  textDecorationLine: 'line-through',
                }}
              >
                {formatPrice(product.oldPrice)}
              </ThemedText>
            ) : null}
          </View>
        </View>

        <View style={{ paddingHorizontal: SCREEN_PADDING, gap: 16 }}>
          <ProductOptions
            colors={product.colors}
            sizes={product.sizes}
            colorId={colorId}
            size={size}
            onColor={setColorId}
            onSize={setSize}
          />
          <StoreCard store={product.store} onPress={todo} />
          <ShippingCard product={product} />
          <DescriptionCard
            description={product.description}
            specs={product.specs}
          />
          <ReviewsSummary
            rating={product.rating}
            count={product.reviewCount}
            onPressAll={todo}
          />
        </View>
      </ScrollView>

      <StickyActionBar
        label="قیمت نهایی"
        value={`${formatPrice(product.price)} تومان`}
        actionLabel={product.inStock ? 'افزودن به سبد' : 'ناموجود'}
        ActionIcon={product.inStock ? ShoppingBag : undefined}
        disabled={!product.inStock}
        onAction={addToCart}
      />
    </Screen>
  );
}

export default function ProductScreen({ navigation, route }: Props) {
  const product = useMemo(
    () => getProductDetail(route.params.id),
    [route.params.id],
  );

  if (!product) {
    return (
      <Screen standalone>
        <View style={{ padding: SCREEN_PADDING, gap: 24 }}>
          <View style={{ flexDirection: 'row-reverse' }}>
            <SquareButton
              Icon={ChevronRight}
              onPress={() => navigation.goBack()}
              label="بازگشت"
            />
          </View>
          <ThemedText
            color={t => t.text.primary}
            style={{
              fontFamily: fonts.bold,
              fontSize: 18,
              textAlign: 'center',
              marginTop: 60,
            }}
          >
            این محصول پیدا نشد
          </ThemedText>
        </View>
      </Screen>
    );
  }

  return <ProductContent product={product} navigation={navigation} />;
}
