import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { TAB_BAR_SPACE } from '../../constants/layout';
import Screen from '../../components/common/Screen';

export default function CategoriesScreen() {
  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: TAB_BAR_SPACE }}>
        <Text style={{ fontFamily: 'Vazirmatn-Bold', fontSize: 18 }}>
          دسته بندی
        </Text>
        {/* {Array.from({ length: 12 }).map((_, i) => (
          <View
            key={i}
            style={{
              height: 90,
              margin: 8,
              borderRadius: 16,
              backgroundColor: i % 2 ? '#F59E0B' : '#6366F1',
            }}
          />
        ))} */}
      </ScrollView>
    </Screen>
  );
}
