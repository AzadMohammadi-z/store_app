import React from 'react';
import { View } from 'react-native';
import { Bell } from 'lucide-react-native';
import SquareButton from '../common/SquareButton';
import { fonts } from '../../theme/fonts';
import { ThemedText } from '../../theme/themed';

export default function AccountHeader({
  onPressBell,
}: {
  onPressBell: () => void;
}) {
  return (
    <View
      style={{
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <ThemedText
        color={t => t.text.primary}
        style={{ fontFamily: fonts.extrabold, fontSize: 28 }}
      >
        حساب من
      </ThemedText>
      <SquareButton Icon={Bell} onPress={onPressBell} label="اعلان‌ها" />
    </View>
  );
}
