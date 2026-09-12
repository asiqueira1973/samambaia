import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PlantPhoto } from '@/components/plant-photo';
import { PrimaryButton } from '@/components/primary-button';
import type { Plant } from '@/db/plants';
import { showActionSheet } from '@/lib/action-sheet';
import { formatLongDate } from '@/lib/dates';
import { frequencyLabel, wateringStatus } from '@/lib/watering';
import { usePlant, usePlants } from '@/store/plants';
import { colors, radius, screenPadding } from '@/theme';

export default function PlantDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { loading } = usePlants();
  const plant = usePlant(id);

  // A planta some da lista quando é excluída — e ao voltar da exclusão esta
  // tela ainda renderiza um quadro antes de sair de cena.
  if (!plant) {
    return (
      <View style={[styles.screen, styles.missing, { paddingTop: insets.top + 24 }]}>
        {loading ? null : (
          <>
            <Text style={styles.missingText}>Esta planta não está mais no seu jardim.</Text>
            <PrimaryButton label="Voltar" onPress={() => router.back()} />
          </>
        )}
      </View>
    );
  }

  return <PlantDetail plant={plant} />;
}

function PlantDetail({ plant }: { plant: Plant }) {
  const insets = useSafeAreaInsets();
  const { waterPlant, removePlant } = usePlants();
  const [watering, setWatering] = useState(false);

  const status = wateringStatus(plant.nextWateringAt);

  async function water() {
    if (watering) return;
    setWatering(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await waterPlant(plant.id);
    setWatering(false);
  }

  function openOptions() {
    showActionSheet(plant.name, [
      { label: 'Excluir planta', destructive: true, onPress: confirmRemoval },
    ]);
  }

  function confirmRemoval() {
    Alert.alert(
      `Excluir ${plant.name}?`,
      'A foto e o histórico de rega são apagados do aparelho.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await removePlant(plant.id);
            router.back();
          },
        },
      ]
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <View style={[styles.photoArea, { marginTop: insets.top }]}>
          <PlantPhoto uri={plant.photoUri} placeholderSize={120} style={styles.photo} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            onPress={() => router.back()}
            hitSlop={10}
            style={({ pressed }) => [styles.photoButton, styles.backButton, pressed && styles.photoButtonPressed]}>
            <Text style={styles.backSign}>‹</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Mais opções"
            onPress={openOptions}
            hitSlop={10}
            style={({ pressed }) => [styles.photoButton, styles.optionsButton, pressed && styles.photoButtonPressed]}>
            <Text style={styles.optionsSign}>•••</Text>
          </Pressable>
        </View>

        <View style={styles.body}>
          <View style={[styles.badge, { backgroundColor: badgeBackground(status.color) }]}>
            <Text style={[styles.badgeText, { color: status.color }]}>{status.badge}</Text>
          </View>

          <Text style={styles.name}>{plant.name}</Text>
          <Text style={styles.frequency}>{frequencyLabel(plant.frequencyDays)}</Text>

          <View style={styles.rows}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Última rega</Text>
              <Text style={styles.rowValue}>
                {plant.lastWateredAt ? formatLongDate(plant.lastWateredAt) : 'Ainda não regada'}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Próxima rega</Text>
              <Text style={[styles.rowValue, { color: status.color }]}>
                {status.daysLeft === 0 ? 'Hoje' : formatLongDate(plant.nextWateringAt)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <PrimaryButton label="Reguei hoje" onPress={water} height={60} disabled={watering} />
      </View>
    </View>
  );
}

/** Selo verde claro no fluxo normal, âmbar quando a rega está atrasada. */
function badgeBackground(statusColor: string): string {
  return statusColor === colors.overdue ? '#FDEEE3' : colors.greenSoft;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    flex: 1,
  },
  missing: {
    paddingHorizontal: screenPadding,
    justifyContent: 'center',
    gap: 20,
  },
  missingText: {
    fontSize: 18,
    color: colors.textMuted,
    textAlign: 'center',
  },
  photoArea: {
    height: 380,
    // Em tela 16:9 não cabe foto de 380 mais o corpo inteiro. A foto encolhe
    // até 160 para o nome e as datas continuarem visíveis sem rolagem.
    flexShrink: 1,
    minHeight: 160,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoButton: {
    position: 'absolute',
    top: 16,
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoButtonPressed: {
    backgroundColor: colors.surface,
  },
  backButton: {
    left: 20,
  },
  optionsButton: {
    right: 20,
  },
  optionsSign: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.5,
  },
  backSign: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 26,
    marginTop: -2,
  },
  body: {
    flexShrink: 0,
    paddingHorizontal: screenPadding,
    paddingTop: 26,
    paddingBottom: 28,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingVertical: 7,
    paddingHorizontal: 13,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  name: {
    fontSize: 34,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.8,
    marginTop: 14,
  },
  frequency: {
    fontSize: 16,
    color: colors.textFaint,
    marginTop: 4,
  },
  rows: {
    marginTop: 26,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLabel: {
    fontSize: 16,
    color: colors.textMuted,
  },
  rowValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flexShrink: 1,
    textAlign: 'right',
  },
  footer: {
    paddingHorizontal: screenPadding,
    paddingTop: 8,
    backgroundColor: colors.surface,
  },
});
