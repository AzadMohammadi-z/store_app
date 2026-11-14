import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { fonts } from '../theme/fonts';
import { useTheme, type Theme } from '../theme/ThemeProvider';
import { TAB_BAR } from './tabBar.config';

const createStyles = (t: Theme) =>
  StyleSheet.create({
    wrapper: {
      position: 'absolute',
      left: TAB_BAR.sideMargin,
      right: TAB_BAR.sideMargin,
    },
    bar: {
      direction: 'ltr',
      flexDirection: 'row',
      height: TAB_BAR.barHeight,
      padding: TAB_BAR.padding,
      borderRadius: TAB_BAR.barHeight / 2,
      borderWidth: TAB_BAR.borderWidth,
      borderColor: 'transparent', // رنگ حاشیه را barBorder می‌کشد
    },
    barBorder: {
      position: 'absolute',
      top: -TAB_BAR.borderWidth,
      left: -TAB_BAR.borderWidth,
      right: -TAB_BAR.borderWidth,
      bottom: -TAB_BAR.borderWidth,
      borderRadius: TAB_BAR.barHeight / 2,
      borderWidth: TAB_BAR.borderWidth,
    },
    barClip: {
      ...StyleSheet.absoluteFill,
      borderRadius: TAB_BAR.barHeight / 2 - TAB_BAR.borderWidth,
      overflow: 'hidden',
    },
    blur: {
      ...StyleSheet.absoluteFill,
      borderRadius: TAB_BAR.barHeight / 2 - TAB_BAR.borderWidth,
    },
    tint: {
      ...StyleSheet.absoluteFill,
    },
    rim: {
      position: 'absolute',
      top: 0,
      left: TAB_BAR.barHeight / 2,
      right: TAB_BAR.barHeight / 2,
      height: 1,
    },
    indicator: {
      position: 'absolute',
      top: TAB_BAR.padding,
      left: TAB_BAR.padding,
      borderWidth: 1,
      overflow: 'hidden',
    },
    item: {
      flex: 1,
      height: TAB_BAR.itemHeight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    label: {
      fontSize: TAB_BAR.labelSize,
    },
    labelWrap: {
      marginTop: 3,
      alignSelf: 'stretch',
      alignItems: 'center',
    },
    layer: {
      ...StyleSheet.absoluteFill,
    },
    labelOverlay: {
      ...StyleSheet.absoluteFill,
      alignItems: 'center',
    },
    badge: {
      position: 'absolute',
      top: -6,
      right: -10,
      minWidth: 17,
      height: 17,
      paddingHorizontal: 4,
      borderRadius: 9,
      backgroundColor: t.danger,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeText: {
      color: t.tabBar.badgeText,
      fontSize: 10,
      fontFamily: fonts.bold,
    },
  });

export function useTabBarStyles() {
  const { theme } = useTheme();
  return useMemo(() => createStyles(theme), [theme]);
}
