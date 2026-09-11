import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius } from '@/theme';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  /** Altura do botão: 56 nos formulários, 60 na ação principal do detalhe. */
  height?: number;
  style?: StyleProp<ViewStyle>;
};

export function PrimaryButton({ label, onPress, disabled, height = 56, style }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          height,
          borderRadius: height >= 60 ? radius.buttonLarge : radius.button,
          backgroundColor: disabled
            ? colors.textDisabled
            : pressed
              ? colors.greenPressed
              : colors.green,
        },
        style,
      ]}>
      <Text style={[styles.label, { fontSize: height >= 60 ? 18 : 17 }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: colors.surface,
    fontWeight: '600',
  },
});
