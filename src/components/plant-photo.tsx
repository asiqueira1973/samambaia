import { Image } from 'expo-image';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { FernMark } from '@/components/fern-mark';
import { colors } from '@/theme';

type Props = {
  uri: string | null;
  /** Tamanho da marca de samambaia mostrada quando a planta não tem foto. */
  placeholderSize: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * Foto da planta, com a marca da samambaia no lugar quando não há imagem.
 * O recorte (cantos arredondados, tamanho) fica no contêiner, então quem usa
 * o componente passa um único estilo e os dois estados ficam iguais.
 */
export function PlantPhoto({ uri, placeholderSize, style }: Props) {
  return (
    <View style={[styles.container, !uri && styles.empty, style]}>
      {uri ? (
        <Image
          source={{ uri }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={120}
        />
      ) : (
        <FernMark size={placeholderSize} color={colors.greenBorder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    backgroundColor: colors.photoPlaceholder,
  },
});
