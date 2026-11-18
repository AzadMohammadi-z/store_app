import React, { useEffect } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import GradientBox from '../common/GradientBox';
import { SCREEN_PADDING } from '../../constants/layout';
import { FILTERS, type OrderFilter } from '../../orders/types';
import { fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import { ThemedView } from '../../theme/themed';
import { toFaDigits } from '../../utils/format';

type ChipProps = {
  label: string;
  count: number;
  selected: boolean;
  onPress: () => void;
};

function Chip({ label, count, selected, onPress }: ChipProps) {
  const { theme } = useTheme();
  const sel = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    sel.value = withTiming(selected ? 1 : 0, { duration: 200 });
  }, [selected, sel]);

  const gradientStyle = useAnimatedStyle(() => ({ opacity: sel.value }));
  const textColor = selected ? '#FFFFFF' : theme.text.primary;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
    >
      <ThemedView
        bg={t => t.card.background}
        border={t => t.card.border}
        style={{
          height: 44,
          borderRadius: 22,
          borderWidth: 1,
          paddingHorizontal: 16,
          flexDirection: 'row-reverse',
          alignItems: 'center',
          gap: 8,
          overflow: 'hidden',
        }}
      >
        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, gradientStyle]}
        >
          <GradientBox
            from={theme.auth.buttonFrom}
            to={theme.auth.buttonTo}
            horizontal
            style={{ flex: 1 }}
          />
        </Animated.View>

        <Text
          style={{
            color: textColor,
            fontFamily: selected ? fonts.bold : fonts.medium,
            fontSize: 14,
          }}
        >
          {label}
        </Text>

        {count > 0 ? (
          <View
            style={{
              minWidth: 22,
              height: 22,
              paddingHorizontal: 6,
              borderRadius: 11,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: selected
                ? 'rgba(255,255,255,0.25)'
                : theme.auth.codeBackground,
            }}
          >
            <Text
              style={{ color: textColor, fontFamily: fonts.bold, fontSize: 12 }}
            >
              {toFaDigits(String(count))}
            </Text>
          </View>
        ) : null}
      </ThemedView>
    </Pressable>
  );
}

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
        <Chip
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
