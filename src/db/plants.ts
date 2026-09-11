import { getDatabase } from '@/db';
import { addDays, today, type IsoDate } from '@/lib/dates';

export type Plant = {
  id: string;
  name: string;
  /** Caminho da foto copiada para dentro do app, ou `null` se a planta não tem foto. */
  photoUri: string | null;
  frequencyDays: number;
  /** `null` enquanto a planta nunca foi regada pelo app. */
  lastWateredAt: IsoDate | null;
  nextWateringAt: IsoDate;
  createdAt: string;
};

type PlantRow = {
  id: string;
  name: string;
  photo_uri: string | null;
  frequency_days: number;
  last_watered_at: string | null;
  next_watering_at: string;
  created_at: string;
};

export const MIN_FREQUENCY_DAYS = 1;
export const MAX_FREQUENCY_DAYS = 365;
export const DEFAULT_FREQUENCY_DAYS = 7;

function toPlant(row: PlantRow): Plant {
  return {
    id: row.id,
    name: row.name,
    photoUri: row.photo_uri,
    frequencyDays: row.frequency_days,
    lastWateredAt: row.last_watered_at,
    nextWateringAt: row.next_watering_at,
    createdAt: row.created_at,
  };
}

function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function clampFrequency(days: number): number {
  return Math.min(MAX_FREQUENCY_DAYS, Math.max(MIN_FREQUENCY_DAYS, Math.round(days)));
}

/** Da mais urgente para a menos urgente; empate desfeito pelo nome. */
export async function listPlants(): Promise<Plant[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<PlantRow>(
    'SELECT * FROM plants ORDER BY next_watering_at ASC, name COLLATE NOCASE ASC'
  );
  return rows.map(toPlant);
}

export async function getPlant(id: string): Promise<Plant | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<PlantRow>('SELECT * FROM plants WHERE id = ?', id);
  return row ? toPlant(row) : null;
}

/**
 * Cadastra a planta. A próxima rega é hoje + a frequência escolhida; a última
 * rega fica vazia porque só o botão "Reguei hoje" registra uma rega de fato.
 */
export async function createPlant(input: {
  name: string;
  photoUri: string | null;
  frequencyDays: number;
}): Promise<Plant> {
  const db = await getDatabase();
  const now = today();
  const plant: Plant = {
    id: newId(),
    name: input.name.trim(),
    photoUri: input.photoUri,
    frequencyDays: clampFrequency(input.frequencyDays),
    lastWateredAt: null,
    nextWateringAt: addDays(now, clampFrequency(input.frequencyDays)),
    createdAt: new Date().toISOString(),
  };

  await db.runAsync(
    `INSERT INTO plants (id, name, photo_uri, frequency_days, last_watered_at, next_watering_at, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    plant.id,
    plant.name,
    plant.photoUri,
    plant.frequencyDays,
    plant.lastWateredAt,
    plant.nextWateringAt,
    plant.createdAt
  );

  return plant;
}

/** Marca a rega de hoje e reagenda a próxima para hoje + frequência. */
export async function waterPlant(id: string): Promise<Plant | null> {
  const db = await getDatabase();
  const plant = await getPlant(id);
  if (!plant) return null;

  const now = today();
  const nextWateringAt = addDays(now, plant.frequencyDays);

  await db.runAsync(
    'UPDATE plants SET last_watered_at = ?, next_watering_at = ? WHERE id = ?',
    now,
    nextWateringAt,
    id
  );

  return { ...plant, lastWateredAt: now, nextWateringAt };
}

export async function deletePlant(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM plants WHERE id = ?', id);
}
