import React from 'react';
import { Pressable, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { fonts } from '../../theme/fonts';
import { ThemedIcon, ThemedText } from '../../theme/themed';
import { SCREEN_PADDING } from '../../constants/layout';

type Props = {
  title: string;
  actionLabel?: string;
  onPressAction?: () => void;
};

export default function SectionHeader({
  title,
  actionLabel = 'همه',
  onPressAction,
}: Props) {
  return (
    <View
      style={{
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SCREEN_PADDING,
      }}
    >
      <ThemedText
        color={t => t.text.primary}
        style={{ fontFamily: fonts.bold, fontSize: 16 }}
      >
        {title}
      </ThemedText>

      {onPressAction ? (
        <Pressable
          onPress={onPressAction}
          hitSlop={10}
          accessibilityRole="button"
          style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}
        >
          <ThemedIcon
            Icon={ChevronLeft}
            size={16}
            strokeWidth={2.2}
            color={t => t.gradient.to}
          />
          <ThemedText
            color={t => t.gradient.to}
            style={{ fontFamily: fonts.medium, fontSize: 13 }}
          >
            {actionLabel}
          </ThemedText>
        </Pressable>
      ) : null}
    </View>
  );
}
