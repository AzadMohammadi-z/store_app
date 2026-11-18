import React, { useEffect, useMemo, useState } from 'react';
import {
  BackHandler,
  FlatList,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, Search, X } from 'lucide-react-native';
import { fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import { ThemedText, ThemedView } from '../../theme/themed';

const normalize = (s: string) => s.replace(/ي/g, 'ی').replace(/ك/g, 'ک').trim();

type Props = {
  visible: boolean;
  title: string;
  options: string[];
  selected: string | null;
  onSelect: (value: string) => void;
  onClose: () => void;
};

export default function SelectSheet({
  visible,
  title,
  options,
  selected,
  onSelect,
  onClose,
}: Props) {
  const { theme } = useTheme();
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!visible) setQuery('');
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });
    return () => sub.remove();
  }, [visible, onClose]);

  const data = useMemo(() => {
    const q = normalize(query);
    return q ? options.filter(o => normalize(o).includes(q)) : options;
  }, [options, query]);

  // ظرف همیشه هست تا انیمیشن خروج فرزندها اجرا شود
  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      {visible ? (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(160)}
          style={StyleSheet.absoluteFill}
        >
          <ThemedView bg={t => t.modal.scrim} style={StyleSheet.absoluteFill} />
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={onClose}
            accessible={false}
          />
        </Animated.View>
      ) : null}

      <KeyboardAvoidingView
        behavior="padding"
        pointerEvents="box-none"
        style={{ flex: 1, justifyContent: 'flex-end' }}
      >
        {visible ? (
          <Animated.View
            entering={SlideInDown.duration(280)}
            exiting={SlideOutDown.duration(220)}
          >
            <ThemedView
              bg={t => t.modal.card}
              border={t => t.modal.cardBorder}
              style={{
                maxHeight: height * 0.7,
                borderTopLeftRadius: 32,
                borderTopRightRadius: 32,
                borderWidth: 1,
                borderBottomWidth: 0,
                paddingTop: 20,
              }}
            >
              {/* سرتیتر */}
              <View
                style={{
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 20,
                  marginBottom: 14,
                }}
              >
                <ThemedText
                  color={t => t.text.primary}
                  style={{ fontFamily: fonts.bold, fontSize: 18 }}
                >
                  {title}
                </ThemedText>
                <Pressable
                  onPress={onClose}
                  hitSlop={12}
                  accessibilityRole="button"
                  accessibilityLabel="بستن"
                >
                  <X size={22} color={theme.text.secondary} strokeWidth={2.2} />
                </Pressable>
              </View>

              {/* جست‌وجو */}
              <ThemedView
                bg={t => t.form.field}
                border={t => t.form.fieldBorder}
                style={{
                  height: 48,
                  marginHorizontal: 20,
                  marginBottom: 8,
                  borderRadius: 16,
                  borderWidth: 1,
                  paddingHorizontal: 14,
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <Search
                  size={18}
                  color={theme.text.secondary}
                  strokeWidth={2.2}
                />
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder="جست‌وجو"
                  placeholderTextColor={theme.search.placeholder}
                  selectionColor={theme.gradient.to}
                  cursorColor={theme.gradient.to}
                  style={{
                    flex: 1,
                    height: 48,
                    padding: 0,
                    textAlign: 'right',
                    writingDirection: 'rtl',
                    fontFamily: fonts.regular,
                    fontSize: 14,
                    color: theme.text.primary,
                  }}
                />
              </ThemedView>

              {/* فهرست */}
              <FlatList
                data={data}
                keyExtractor={item => item}
                keyboardShouldPersistTaps="handled"
                style={{ flexShrink: 1 }}
                contentContainerStyle={{ paddingBottom: insets.bottom + 12 }}
                ListEmptyComponent={
                  <ThemedText
                    color={t => t.text.secondary}
                    style={{
                      fontFamily: fonts.regular,
                      fontSize: 14,
                      textAlign: 'center',
                      padding: 24,
                    }}
                  >
                    موردی پیدا نشد
                  </ThemedText>
                }
                renderItem={({ item }) => {
                  const isSelected = item === selected;
                  return (
                    <Pressable
                      onPress={() => onSelect(item)}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                      style={{
                        height: 54,
                        paddingHorizontal: 20,
                        flexDirection: 'row-reverse',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: isSelected ? fonts.bold : fonts.medium,
                          fontSize: 15,
                          color: isSelected
                            ? theme.auth.link
                            : theme.text.primary,
                        }}
                      >
                        {item}
                      </Text>
                      {isSelected ? (
                        <Check
                          size={20}
                          color={theme.auth.link}
                          strokeWidth={2.4}
                        />
                      ) : null}
                    </Pressable>
                  );
                }}
              />
            </ThemedView>
          </Animated.View>
        ) : null}
      </KeyboardAvoidingView>
    </View>
  );
}
