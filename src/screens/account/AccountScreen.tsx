import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Screen from '../../components/common/Screen';
import { TAB_BAR_SPACE } from '../../constants/layout';

export default function AccountScreen() {
  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: TAB_BAR_SPACE }}>
        <Text style={{ fontFamily: 'Vazirmatn-Bold', fontSize: 18 }}>
          حساب کاربری
        </Text>
      </ScrollView>
    </Screen>
  );
}
