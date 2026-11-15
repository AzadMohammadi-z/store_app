import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import VerifyScreen from '../screens/auth/VerifyScreen';
import type { AccountStackParamList } from './types';

const Stack = createNativeStackNavigator<AccountStackParamList>();

export default function AccountNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        // راست‌به‌چپ: صفحه‌ی بعدی از سمت چپ وارد می‌شود
        animation: 'slide_from_left',
        contentStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Verify" component={VerifyScreen} />
    </Stack.Navigator>
  );
}
