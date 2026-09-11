import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FernMark } from '@/components/fern-mark';
import { PlantRow } from '@/components/plant-row';
import { PrimaryButton } from '@/components/primary-button';
import type { Plant } from '@/db/plants';
import { formatWeekdayHeader, today } from '@/lib/dates';
import { dueBannerLabel, wateringStatus } from '@/lib/watering';
import { usePlants } from '@/store/plants';
import { colors, radius, screenPadding } from '@/theme';

export default function PlantListScreen() {
  const insets = useSafeAreaInsets();
  const { plants, loading } = usePlants();

  const dueCount = plants.filter((plant) => wateringStatus(plant.nextWateringAt).isDue).length;
  const banner = dueBannerLabel(dueCount);

  function openPlant(plant: Plant) {
    router.navigate({ pathname: '/planta/[id]', params: { id: plant.id } });
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.headerTexts}>
          <Text style={styles.date}>{formatWeekdayHeader(today())}</Text>
          <Text style={styles.title}>Minhas plantas</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cadastrar planta"
          onPress={() => router.navigate('/nova')}
          style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}>
          <Text style={styles.addSign}>+</Text>
        </Pressable>
      </View>

      {banner ? (
        <View style={styles.banner}>
          <View style={styles.bannerDot} />
          <Text style={styles.bannerText}>{banner}</Text>
        </View>
      ) : null}

      <FlatList
        data={plants}
        keyExtractor={(plant) => plant.id}
        renderItem={({ item }) => <PlantRow plant={item} onPress={() => openPlant(item)} />}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 24 },
          plants.length === 0 && styles.listEmpty,
        ]}
        ListEmptyComponent={loading ? null : <EmptyState />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function EmptyState() {
  return (
    <View style={styles.empty}>
      <FernMark size={88} color={colors.greenBorder} />
      <Text style={styles.emptyTitle}>Nenhuma planta ainda</Text>
      <Text style={styles.emptyText}>
        Cadastre sua primeira planta e o Samambaia avisa quando for dia de regar.
      </Text>
      <PrimaryButton
        label="Cadastrar planta"
        onPress={() => router.navigate('/nova')}
        style={styles.emptyButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: screenPadding,
    paddingTop: 14,
    paddingBottom: 20,
  },
  headerTexts: {
    flex: 1,
    gap: 6,
  },
  date: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.textFaint,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.6,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  addButtonPressed: {
    backgroundColor: colors.greenPressed,
  },
  addSign: {
    color: colors.surface,
    fontSize: 24,
    fontWeight: '500',
    lineHeight: 28,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.greenSoft,
    borderRadius: 16,
    padding: 14,
    paddingHorizontal: 16,
    marginHorizontal: screenPadding,
    marginBottom: 22,
  },
  bannerDot: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.green,
  },
  bannerText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.green,
  },
  list: {
    paddingHorizontal: screenPadding,
    gap: 14,
  },
  listEmpty: {
    flexGrow: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingBottom: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textFaint,
    textAlign: 'center',
    lineHeight: 22,
  },
  emptyButton: {
    alignSelf: 'stretch',
    marginTop: 20,
    marginHorizontal: 10,
  },
});
