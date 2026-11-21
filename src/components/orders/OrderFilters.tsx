import React from 'react';
import { FlatList, View } from 'react-native';
import SelectablePill from '../common/SelectablePill';
import { SCREEN_PADDING } from '../../constants/layout';
import { FILTERS, type OrderFilter } from '../../orders/types';

type Props = {
  value: OrderFilter;
  counts: Record<OrderFilter, number>;
  onChange: (filter: OrderFilter) => void;
};

export default function OrderFilters({ value, counts, onChange }: Props) {
  return (
    <FlatList
      data={FILTERS}
      keyExtractor={f => f.key}
      extraData={[value, counts]}
      horizontal
      inverted // راست‌به‌چپ: اولین قرص سمت راست
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: SCREEN_PADDING }}
      ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
      renderItem={({ item }) => (
        <SelectablePill
          label={item.label}
          // روی «همه» شمارنده نمی‌گذاریم
          count={item.key === 'all' ? 0 : counts[item.key]}
          selected={value === item.key}
          onPress={() => onChange(item.key)}
        />
      )}
    />
  );
}
