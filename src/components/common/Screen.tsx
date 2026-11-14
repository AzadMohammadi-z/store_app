import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppBackground from './AppBackground';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** برای صفحه‌های خارج از تب‌ها (مثل Detail): پس‌زمینه‌ی خودش را می‌کشد */
  standalone?: boolean;
};

export default function Screen({ children, style, standalone = false }: Props) {
  return (
    <View style={{ flex: 1 }}>
      {standalone ? <AppBackground /> : null}
      <SafeAreaView edges={['top']} style={[{ flex: 1 }, style]}>
        {children}
      </SafeAreaView>
    </View>
  );
}
