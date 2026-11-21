import type { NavigatorScreenParams } from '@react-navigation/native';
import type { OrderFilter } from '../orders/types';

export type MainTabParamList = {
  Home: undefined;
  Categories: undefined;
  Cart: undefined;
  Account: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  Checkout: undefined;
  Orders: { filter?: OrderFilter } | undefined;
  Addresses: undefined;
  AddressEdit: { id?: string } | undefined;
  EditProfile: undefined;
  Product: { id: string };
  Detail: { id: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type AccountStackParamList = {
  Login: undefined;
  Verify: { phone: string };
};
