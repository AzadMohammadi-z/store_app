import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppBackground, { type BackgroundVariant } from './AppBackground';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** برای صفحه‌های خارج از تب‌ها (مثل Detail و Login): پس‌زمینه‌ی خودش را می‌کشد */
  standalone?: boolean;
  /** نوع پس‌زمینه (فقط وقتی standalone است اثر دارد) */
  variant?: BackgroundVariant;
};

export default function Screen({
  children,
  style,
  standalone = false,
  variant = 'default',
}: Props) {
  return (
    <View style={{ flex: 1 }}>
      {standalone ? <AppBackground variant={variant} /> : null}
      <SafeAreaView edges={['top']} style={[{ flex: 1 }, style]}>
        {children}
      </SafeAreaView>
    </View>
  );
}
