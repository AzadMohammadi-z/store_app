import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Screen from '../../components/common/Screen';
import { TAB_BAR_SPACE } from '../../constants/layout';

export default function WalletScreen() {
  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: TAB_BAR_SPACE }}>
        <Text style={{ fontFamily: 'Vazirmatn-Bold', fontSize: 18 }}>
          سبد خرید
        </Text>
      </ScrollView>
    </Screen>
  );
}
