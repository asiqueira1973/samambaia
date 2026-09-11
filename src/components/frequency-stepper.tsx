import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MAX_FREQUENCY_DAYS, MIN_FREQUENCY_DAYS } from '@/db/plants';
import { colors, radius } from '@/theme';

type Props = {
  value: number;
  onChange: (value: number) => void;
};

/** Seletor numérico simples: − / valor / +, entre 1 e 365 dias. */
export function FrequencyStepper({ value, onChange }: Props) {
  const canDecrease = value > MIN_FREQUENCY_DAYS;
  const canIncrease = value < MAX_FREQUENCY_DAYS;

  function step(delta: number) {
    const next = Math.min(MAX_FREQUENCY_DAYS, Math.max(MIN_FREQUENCY_DAYS, value + delta));
    if (next === value) return;
    Haptics.selectionAsync();
    onChange(next);
  }

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Diminuir um dia"
        disabled={!canDecrease}
        onPress={() => step(-1)}
        style={({ pressed }) => [
          styles.control,
          styles.decrease,
          !canDecrease && styles.controlDisabled,
          pressed && canDecrease && styles.decreasePressed,
        ]}>
        <Text style={[styles.decreaseSign, !canDecrease && styles.signDisabled]}>−</Text>
      </Pressable>

      <View
        accessible
        accessibilityLabel={`Regar a cada ${value} ${value === 1 ? 'dia' : 'dias'}`}
        style={styles.value}>
        <Text style={styles.number}>{value}</Text>
        <Text style={styles.unit}>{value === 1 ? 'dia' : 'dias'}</Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Aumentar um dia"
        disabled={!canIncrease}
        onPress={() => step(1)}
        style={({ pressed }) => [
          styles.control,
          styles.increase,
          !canIncrease && styles.controlDisabled,
          pressed && canIncrease && styles.increasePressed,
        ]}>
        <Text style={[styles.increaseSign, !canIncrease && styles.signDisabled]}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.field,
    padding: 14,
    paddingHorizontal: 16,
  },
  control: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  decrease: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  decreasePressed: {
    backgroundColor: colors.greenSoft,
  },
  increase: {
    backgroundColor: colors.green,
  },
  increasePressed: {
    backgroundColor: colors.greenPressed,
  },
  controlDisabled: {
    opacity: 0.4,
  },
  decreaseSign: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.green,
    lineHeight: 28,
  },
  increaseSign: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.surface,
    lineHeight: 28,
  },
  signDisabled: {
    opacity: 0.7,
  },
  value: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  number: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -1,
  },
  unit: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.textMuted,
  },
});
