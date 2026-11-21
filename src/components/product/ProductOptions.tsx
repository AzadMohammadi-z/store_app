import React from 'react';
import { Pressable, View } from 'react-native';
import GlassCard from '../common/GlassCard';
import SelectablePill from '../common/SelectablePill';
import type { ProductColor } from '../../data/products';
import { fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import { ThemedText } from '../../theme/themed';

function Swatch({
  color,
  selected,
  onPress,
}: {
  color: ProductColor;
  selected: boolean;
  onPress: () => void;
}) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={color.name}
      accessibilityState={{ selected }}
    >
      <View
        style={{
          width: 46,
          height: 46,
          borderRadius: 23,
          borderWidth: 2,
          borderColor: selected ? theme.auth.link : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: 34,
            height: 34,
            borderRadius: 17,
            backgroundColor: color.hex,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.25)',
          }}
        />
      </View>
    </Pressable>
  );
}

function OptionRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View
      style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 14 }}
    >
      <ThemedText
        color={t => t.text.secondary}
        style={{
          width: 56,
          fontFamily: fonts.medium,
          fontSize: 14,
          textAlign: 'right',
        }}
      >
        {label}
      </ThemedText>
      <View
        style={{
          flex: 1,
          flexDirection: 'row-reverse',
          alignItems: 'center',
          gap: 12,
        }}
      >
        {children}
      </View>
    </View>
  );
}

type Props = {
  colors: ProductColor[];
  sizes: string[];
  colorId?: string;
  size?: string;
  onColor: (id: string) => void;
  onSize: (size: string) => void;
};

export default function ProductOptions({
  colors,
  sizes,
  colorId,
  size,
  onColor,
  onSize,
}: Props) {
  if (colors.length === 0 && sizes.length === 0) return null;

  return (
    <GlassCard style={{ padding: 18, gap: 18 }}>
      <ThemedText
        color={t => t.text.primary}
        style={{ fontFamily: fonts.bold, fontSize: 17, textAlign: 'right' }}
      >
        انتخاب مشخصات
      </ThemedText>

      {colors.length > 0 ? (
        <OptionRow label="رنگ">
          {colors.map(c => (
            <Swatch
              key={c.id}
              color={c}
              selected={c.id === colorId}
              onPress={() => onColor(c.id)}
            />
          ))}
        </OptionRow>
      ) : null}

      {sizes.length > 0 ? (
        <OptionRow label="اندازه">
          {sizes.map(s => (
            <SelectablePill
              key={s}
              label={s}
              height={42}
              style={{ minWidth: 56 }}
              selected={s === size}
              onPress={() => onSize(s)}
            />
          ))}
        </OptionRow>
      ) : null}
    </GlassCard>
  );
}
