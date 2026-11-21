import React, { useEffect, useMemo, useState } from 'react';
import {
  BackHandler,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import GradientButton from '../common/GradientButton';
import { fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import { ThemedText, ThemedView } from '../../theme/themed';
import { toFaDigits } from '../../utils/format';
import {
  JALALI_MONTHS,
  currentJalaliYear,
  daysInJalaliMonth,
  formatJalali,
  parseJalali,
} from '../../utils/jalali';

const ITEM_H = 44;
const ROWS = 5;
const MIN_YEAR = 1300;

/* -------------------------------- یک ستون -------------------------------- */

type ColumnProps = {
  title: string;
  data: number[];
  selected: number;
  label: (n: number) => string;
  onSelect: (n: number) => void;
  flex: number;
};

function Column({ title, data, selected, label, onSelect, flex }: ColumnProps) {
  const { theme } = useTheme();
  const index = Math.max(0, data.indexOf(selected));

  return (
    <View style={{ flex }}>
      <ThemedText
        color={t => t.text.secondary}
        style={{
          fontFamily: fonts.medium,
          fontSize: 12,
          textAlign: 'center',
          marginBottom: 6,
        }}
      >
        {title}
      </ThemedText>

      <FlatList
        data={data}
        keyExtractor={n => String(n)}
        extraData={selected}
        showsVerticalScrollIndicator={false}
        style={{ height: ITEM_H * ROWS }}
        getItemLayout={(_, i) => ({
          length: ITEM_H,
          offset: ITEM_H * i,
          index: i,
        })}
        initialScrollIndex={Math.max(0, index - Math.floor(ROWS / 2))}
        renderItem={({ item }) => {
          const active = item === selected;
          return (
            <Pressable
              onPress={() => onSelect(item)}
              style={{
                height: ITEM_H,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {active ? (
                <ThemedView
                  bg={t => t.account.segmentSelected}
                  border={t => t.account.segmentSelectedBorder}
                  style={{
                    position: 'absolute',
                    left: 6,
                    right: 6,
                    top: 3,
                    bottom: 3,
                    borderRadius: 14,
                    borderWidth: 1,
                  }}
                />
              ) : null}
              <Text
                style={{
                  fontFamily: active ? fonts.bold : fonts.medium,
                  fontSize: 16,
                  color: active ? theme.text.primary : theme.text.secondary,
                }}
              >
                {label(item)}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

/* ------------------------------ محتوای برگه ------------------------------ */

type BodyProps = {
  value: string | null;
  onConfirm: (value: string) => void;
  onClose: () => void;
};

// با باز شدن برگه ساخته می‌شود، پس مقدار اولیه‌ی ستون‌ها همیشه تازه است
function SheetBody({ value, onConfirm, onClose }: BodyProps) {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const maxYear = useMemo(() => currentJalaliYear() - 10, []);
  const years = useMemo(
    () => Array.from({ length: maxYear - MIN_YEAR + 1 }, (_, i) => maxYear - i),
    [maxYear],
  );
  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);

  const initial = parseJalali(value);
  const [year, setYear] = useState(initial?.year ?? Math.min(1375, maxYear));
  const [month, setMonth] = useState(initial?.month ?? 1);
  const [day, setDay] = useState(initial?.day ?? 1);

  const dayCount = daysInJalaliMonth(year, month);
  const safeDay = Math.min(day, dayCount);
  const days = useMemo(
    () => Array.from({ length: dayCount }, (_, i) => i + 1),
    [dayCount],
  );

  return (
    <View
      style={{
        paddingTop: 20,
        paddingHorizontal: 20,
        paddingBottom: insets.bottom + 16,
        gap: 16,
      }}
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
          تاریخ تولد
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

      {/* راست به چپ: سال، ماه، روز */}
      <View style={{ flexDirection: 'row-reverse', gap: 8 }}>
        <Column
          title="سال"
          data={years}
          selected={year}
          label={n => toFaDigits(String(n))}
          onSelect={setYear}
          flex={1.1}
        />
        <Column
          title="ماه"
          data={months}
          selected={month}
          label={n => JALALI_MONTHS[n - 1]}
          onSelect={setMonth}
          flex={1.4}
        />
        {/* با عوض شدن تعداد روزها (۳۰ یا ۳۱) ستون دوباره ساخته می‌شود */}
        <Column
          key={dayCount}
          title="روز"
          data={days}
          selected={safeDay}
          label={n => toFaDigits(String(n))}
          onSelect={setDay}
          flex={0.9}
        />
      </View>

      <GradientButton
        label="تأیید"
        onPress={() => onConfirm(formatJalali(year, month, safeDay))}
        from={theme.auth.buttonFrom}
        to={theme.auth.buttonTo}
        glow={isDark ? theme.auth.glow : undefined}
        height={54}
        radius={27}
      />
    </View>
  );
}

/* --------------------------------- برگه --------------------------------- */

type Props = {
  visible: boolean;
  value: string | null;
  onConfirm: (value: string) => void;
  onClose: () => void;
};

export default function JalaliDateSheet({
  visible,
  value,
  onConfirm,
  onClose,
}: Props) {
  useEffect(() => {
    if (!visible) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });
    return () => sub.remove();
  }, [visible, onClose]);

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

      <View
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
                borderTopLeftRadius: 32,
                borderTopRightRadius: 32,
                borderWidth: 1,
                borderBottomWidth: 0,
              }}
            >
              <SheetBody
                value={value}
                onConfirm={onConfirm}
                onClose={onClose}
              />
            </ThemedView>
          </Animated.View>
        ) : null}
      </View>
    </View>
  );
}
