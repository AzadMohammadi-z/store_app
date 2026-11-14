import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Screen from '../../components/common/Screen';
import ThemeToggleButton from '../../components/common/ThemeToggleButton';
import { TAB_BAR_SPACE } from '../../constants/layout';
import { fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import { ThemedText } from '../../theme/themed';

export default function HomeScreen() {
  const { theme } = useTheme();

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: TAB_BAR_SPACE }}
      >
        <View
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <ThemedText
            color={t => t.text.primary}
            style={{ fontFamily: fonts.bold, fontSize: 18 }}
          >
            نوازون
          </ThemedText>
          <ThemeToggleButton />
        </View>
      </ScrollView>
    </Screen>
  );
}
