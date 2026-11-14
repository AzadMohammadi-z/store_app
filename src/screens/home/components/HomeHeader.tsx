import React from 'react';
import { View } from 'react-native';
import AppLogo from '../../../components/common/AppLogo';
import ThemeToggleButton from '../../../components/common/ThemeToggleButton';
import { fonts } from '../../../theme/fonts';
import { ThemedText } from '../../../theme/themed';
import { HEADER_ICON_SIZE } from '../../../constants/layout';

export default function HomeHeader() {
  return (
    <View
      style={{
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* راست: لوگو و عنوان */}
      <View
        style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 10 }}
      >
        <AppLogo size={HEADER_ICON_SIZE} radius={12} />
        <ThemedText
          color={t => t.text.primary}
          style={{ fontFamily: fonts.bold, fontSize: 18 }}
        >
          نوازون
        </ThemedText>
      </View>

      {/* چپ: فعلاً دکمه‌ی تم؛ بعداً جایش را عوض می‌کنیم */}
      <ThemeToggleButton />
    </View>
  );
}
