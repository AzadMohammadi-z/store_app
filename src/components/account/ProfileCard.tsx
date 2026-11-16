import React from 'react';
import { View } from 'react-native';
import { Pencil } from 'lucide-react-native';
import GlassCard from '../common/GlassCard';
import GradientBox from '../common/GradientBox';
import SquareButton from '../common/SquareButton';
import { fonts } from '../../theme/fonts';
import { ThemedText } from '../../theme/themed';
import { groupIranMobile, toFaDigits } from '../../utils/format';

type Props = {
  name: string;
  /** ده رقم بدون صفر اول */
  phone: string;
  onEdit: () => void;
};

export default function ProfileCard({ name, phone, onEdit }: Props) {
  // فاصله‌ی ناشکن تا شماره در متن راست‌به‌چپ برعکس نشود
  const shownPhone = phone
    ? toFaDigits(`0${groupIranMobile(phone)}`).replace(/ /g, '\u00A0')
    : '';

  return (
    <GlassCard
      style={{
        padding: 18,
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 16,
      }}
    >
      <GradientBox
        from="#6D4AFF"
        to="#3B82F6"
        style={{
          width: 66,
          height: 66,
          borderRadius: 33,
          borderWidth: 2,
          borderColor: 'rgba(255,255,255,0.35)',
        }}
      />

      <View style={{ flex: 1, alignItems: 'flex-end', gap: 4 }}>
        <ThemedText
          color={t => t.text.primary}
          numberOfLines={1}
          style={{ fontFamily: fonts.bold, fontSize: 18, textAlign: 'right' }}
        >
          {name}
        </ThemedText>
        {shownPhone ? (
          <ThemedText
            color={t => t.text.secondary}
            style={{ fontFamily: fonts.regular, fontSize: 14 }}
          >
            {shownPhone}
          </ThemedText>
        ) : null}
      </View>

      <SquareButton Icon={Pencil} onPress={onEdit} label="ویرایش پروفایل" />
    </GlassCard>
  );
}
