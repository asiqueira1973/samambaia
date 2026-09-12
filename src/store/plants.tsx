import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { AppState } from 'react-native';

import {
  createPlant as createPlantRow,
  deletePlant as deletePlantRow,
  listPlants,
  updatePlant as updatePlantRow,
  waterPlant as waterPlantRow,
  type Plant,
} from '@/db/plants';
import { deletePhoto } from '@/lib/photos';
import { rescheduleAllReminders } from '@/lib/notifications';

type PlantsContextValue = {
  plants: Plant[];
  loading: boolean;
  refresh: () => Promise<void>;
  addPlant: (input: { name: string; photoUri: string | null; frequencyDays: number }) => Promise<Plant>;
  editPlant: (
    id: string,
    input: { name: string; photoUri: string | null; frequencyDays: number }
  ) => Promise<void>;
  waterPlant: (id: string) => Promise<void>;
  removePlant: (id: string) => Promise<void>;
};

const PlantsContext = createContext<PlantsContextValue | null>(null);

export function PlantsProvider({ children }: { children: ReactNode }) {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * Toda alteração passa por aqui: relê o banco (fonte da verdade) e refaz os
   * agendamentos, para a lista e as notificações nunca divergirem.
   */
  const syncFromDatabase = useCallback(async () => {
    const rows = await listPlants();
    setPlants(rows);
    await rescheduleAllReminders(rows);
  }, []);

  const refresh = useCallback(async () => {
    await syncFromDatabase();
    setLoading(false);
  }, [syncFromDatabase]);

  useEffect(() => {
    let active = true;

    async function load() {
      const rows = await listPlants();
      if (!active) return;
      setPlants(rows);
      setLoading(false);
      await rescheduleAllReminders(rows);
    }

    load();

    // "Faltam 2 dias" é calculado a partir da data de hoje. Se o app ficar
    // aberto durante a virada do dia, a lista precisa ser recalculada quando
    // ele volta para a frente.
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') load();
    });

    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  const addPlant = useCallback(
    async (input: { name: string; photoUri: string | null; frequencyDays: number }) => {
      const plant = await createPlantRow(input);
      await syncFromDatabase();
      return plant;
    },
    [syncFromDatabase]
  );

  const editPlant = useCallback(
    async (id: string, input: { name: string; photoUri: string | null; frequencyDays: number }) => {
      const previous = plants.find((candidate) => candidate.id === id);
      await updatePlantRow(id, input);
      // A foto antiga só sai do aparelho depois que o banco já aponta para a nova.
      if (previous && previous.photoUri !== input.photoUri) deletePhoto(previous.photoUri);
      await syncFromDatabase();
    },
    [plants, syncFromDatabase]
  );

  const waterPlant = useCallback(
    async (id: string) => {
      await waterPlantRow(id);
      await syncFromDatabase();
    },
    [syncFromDatabase]
  );

  const removePlant = useCallback(
    async (id: string) => {
      const plant = plants.find((candidate) => candidate.id === id);
      await deletePlantRow(id);
      deletePhoto(plant?.photoUri);
      await syncFromDatabase();
    },
    [plants, syncFromDatabase]
  );

  const value = useMemo(
    () => ({ plants, loading, refresh, addPlant, editPlant, waterPlant, removePlant }),
    [plants, loading, refresh, addPlant, editPlant, waterPlant, removePlant]
  );

  return <PlantsContext.Provider value={value}>{children}</PlantsContext.Provider>;
}

export function usePlants(): PlantsContextValue {
  const context = useContext(PlantsContext);
  if (!context) throw new Error('usePlants precisa estar dentro de <PlantsProvider>.');
  return context;
}

/** Uma planta específica da lista já carregada. */
export function usePlant(id: string | undefined): Plant | undefined {
  const { plants } = usePlants();
  return plants.find((plant) => plant.id === id);
}
