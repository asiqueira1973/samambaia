import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PlantPhoto } from '@/components/plant-photo';
import type { Plant } from '@/db/plants';
import { frequencyLabel, wateringStatus } from '@/lib/watering';
import { colors, radius } from '@/theme';

type Props = {
  plant: Plant;
  onPress: () => void;
};

export function PlantRow({ plant, onPress }: Props) {
  const status = wateringStatus(plant.nextWateringAt);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${plant.name}. ${status.label}.`}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
      <PlantPhoto uri={plant.photoUri} placeholderSize={44} style={styles.photo} />

      <View style={styles.texts}>
        <Text style={styles.name} numberOfLines={1}>
          {plant.name}
        </Text>
        <Text style={styles.frequency}>{frequencyLabel(plant.frequencyDays)}</Text>
        <Text style={[styles.status, { color: status.color }]}>{status.label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    padding: 12,
  },
  rowPressed: {
    backgroundColor: colors.surfaceSoft,
  },
  photo: {
    width: 76,
    height: 76,
    borderRadius: radius.photoThumb,
    flexShrink: 0,
  },
  texts: {
    flex: 1,
    gap: 6,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  frequency: {
    fontSize: 14,
    color: colors.textFaint,
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
  },
});
