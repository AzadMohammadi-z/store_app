import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { SCREEN_PADDING } from '../../constants/layout';
import ProductCard, { type Product } from './ProductCard';

const GAP = 12;

type Props = {
  products: Product[];
  onPressProduct?: (p: Product) => void;
  onAdd?: (p: Product) => void;
};

export default function ProductGrid({
  products,
  onPressProduct,
  onAdd,
}: Props) {
  const { width } = useWindowDimensions();
  // Math.floor تا خطای اعشار باعث رفتن کارت دوم به خط بعد نشود
  const cardWidth = Math.floor((width - SCREEN_PADDING * 2 - GAP) / 2);

  return (
    <View
      style={{
        flexDirection: 'row-reverse', // اولین محصول سمت راست
        flexWrap: 'wrap',
        gap: GAP,
        paddingHorizontal: SCREEN_PADDING,
      }}
    >
      {products.map((p, i) => (
        <ProductCard
          key={p.id}
          product={p}
          index={i}
          width={cardWidth}
          onPress={onPressProduct}
          onAdd={onAdd}
        />
      ))}
    </View>
  );
}
