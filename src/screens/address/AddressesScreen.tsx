import React from 'react';
import { FlatList, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronRight, MapPin, Trash2 } from 'lucide-react-native';
import { type Address, useAddresses } from '../../address/AddressProvider';
import AddressCard from '../../components/address/AddressCard';
import GradientButton from '../../components/common/GradientButton';
import Screen from '../../components/common/Screen';
import SquareButton from '../../components/common/SquareButton';
import { useModal } from '../../components/modal/ModalProvider';
import { SCREEN_PADDING } from '../../constants/layout';
import type { RootStackParamList } from '../../navigation/types';
import { fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import { ThemedIcon, ThemedText } from '../../theme/themed';

type Props = NativeStackScreenProps<RootStackParamList, 'Addresses'>;

export default function AddressesScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { addresses, removeAddress, setDefault } = useAddresses();
  const { showModal } = useModal();

  const confirmDelete = (address: Address) =>
    showModal({
      icon: Trash2,
      tone: 'red',
      title: 'حذف آدرس؟',
      message: `آدرس «${address.title}» حذف می‌شود. این کار قابل بازگشت نیست.`,
      actions: [
        {
          label: 'بله، حذف',
          variant: 'danger',
          onPress: () => removeAddress(address.id),
        },
        { label: 'انصراف' },
      ],
    });

  const bottom = Math.max(insets.bottom, 12);

  return (
    <Screen standalone>
      <View
        style={{
          paddingHorizontal: SCREEN_PADDING,
          paddingTop: 8,
          paddingBottom: 14,
        }}
      >
        {/* هدر: بازگشت (راست) و عنوان */}
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
            style={{ fontFamily: fonts.extrabold, fontSize: 26 }}
          >
            آدرس‌های من
          </ThemedText>
        </View>
      </View>

      <FlatList
        data={addresses}
        keyExtractor={a => a.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: SCREEN_PADDING,
          paddingBottom: bottom + 90,
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
              paddingBottom: 60,
            }}
          >
            <ThemedIcon
              Icon={MapPin}
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
              هنوز آدرسی ثبت نکرده‌ای
            </ThemedText>
            <ThemedText
              color={t => t.text.secondary}
              style={{
                fontFamily: fonts.regular,
                fontSize: 14,
                textAlign: 'center',
              }}
            >
              با افزودن آدرس، خریدهای بعدی سریع‌تر می‌شوند.
            </ThemedText>
          </Animated.View>
        }
        renderItem={({ item, index }) => (
          <AddressCard
            address={item}
            index={index}
            onEdit={() => navigation.navigate('AddressEdit', { id: item.id })}
            onDelete={() => confirmDelete(item)}
            onSetDefault={() => setDefault(item.id)}
          />
        )}
      />

      {/* دکمه‌ی ثابت پایین */}
      <View
        pointerEvents="box-none"
        style={{
          position: 'absolute',
          left: SCREEN_PADDING,
          right: SCREEN_PADDING,
          bottom,
        }}
      >
        <GradientButton
          label="افزودن آدرس جدید"
          onPress={() => navigation.navigate('AddressEdit')}
          from={theme.auth.buttonFrom}
          to={theme.auth.buttonTo}
          glow={theme.auth.glow}
          height={58}
          radius={29}
        />
      </View>
    </Screen>
  );
}
