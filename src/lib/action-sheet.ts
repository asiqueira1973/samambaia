import { ActionSheetIOS, Alert, Platform } from 'react-native';

export type SheetAction = {
  label: string;
  /** Ação de risco — vermelha no iOS, `destructive` no Android. */
  destructive?: boolean;
  onPress: () => void;
};

/**
 * Menu de ações nativo de cada plataforma: action sheet no iOS, diálogo no
 * Android. "Cancelar" é acrescentado sozinho no fim.
 */
export function showActionSheet(title: string | undefined, actions: SheetAction[]): void {
  if (Platform.OS === 'ios') {
    const options = [...actions.map((action) => action.label), 'Cancelar'];
    const destructiveButtonIndex = actions.findIndex((action) => action.destructive);

    ActionSheetIOS.showActionSheetWithOptions(
      {
        title,
        options,
        cancelButtonIndex: actions.length,
        ...(destructiveButtonIndex >= 0 ? { destructiveButtonIndex } : {}),
      },
      (index) => actions[index]?.onPress()
    );
    return;
  }

  Alert.alert(title ?? '', undefined, [
    ...actions.map((action) => ({
      text: action.label,
      style: action.destructive ? ('destructive' as const) : ('default' as const),
      onPress: action.onPress,
    })),
    { text: 'Cancelar', style: 'cancel' as const },
  ]);
}
