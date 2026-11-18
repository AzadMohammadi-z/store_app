import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs from './MainTabs';
import CheckoutScreen from '../screens/checkout/CheckoutScreen';
import OrdersScreen from '../screens/orders/OrdersScreen';
import AddressEditScreen from '../screens/address/AddressEditScreen';
import AddressesScreen from '../screens/address/AddressesScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{ animation: 'slide_from_left' }}
      />
      <Stack.Screen
        name="Orders"
        component={OrdersScreen}
        options={{ animation: 'slide_from_left' }}
      />
      <Stack.Screen
        name="Addresses"
        component={AddressesScreen}
        options={{ animation: 'slide_from_left' }}
      />
      <Stack.Screen
        name="AddressEdit"
        component={AddressEditScreen}
        options={{ animation: 'slide_from_left' }}
      />
    </Stack.Navigator>
  );
}
