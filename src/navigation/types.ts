import type { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Home: undefined;
  Categories: undefined;
  Cart: undefined;
  Account: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
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
