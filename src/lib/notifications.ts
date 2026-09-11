import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import type { Plant } from '@/db/plants';
import { addDays, atNineAm, daysBetween, today } from '@/lib/dates';
import { colors } from '@/theme';

/** Canal obrigatório no Android — precisa bater com `defaultChannel` do app.json. */
const CHANNEL_ID = 'regas';

/**
 * O iOS entrega no máximo 64 notificações locais agendadas por app. Ficamos
 * abaixo disso de propósito, para nunca perder um agendamento silenciosamente.
 */
const MAX_SCHEDULED = 56;

/** Quantos ciclos futuros agendamos por planta, para o lembrete continuar mesmo sem abrir o app. */
const MAX_CYCLES_PER_PLANT = 8;

export const PLANT_ID_DATA_KEY = 'plantId';

/** Chamado uma vez, no boot: define como a notificação aparece com o app aberto. */
export async function configureNotifications(): Promise<void> {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Regas',
      importance: Notifications.AndroidImportance.HIGH,
      lightColor: colors.green,
    });
  }
}

/** Já concedida? Devolve `true` sem incomodar. Caso contrário, pede uma vez. */
export async function ensureNotificationPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;

  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

async function hasPermission(): Promise<boolean> {
  return (await Notifications.getPermissionsAsync()).granted;
}

/** Datas de rega futuras de uma planta, a partir da próxima. */
function upcomingWateringDates(plant: Plant, cycles: number): Date[] {
  const frequency = Math.max(1, plant.frequencyDays);
  const now = Date.now();
  const dates: Date[] = [];
  let date = plant.nextWateringAt;

  // Planta atrasada tem datas no passado: pulamos os ciclos vencidos de uma vez
  // em vez de percorrer dia a dia.
  const daysOverdue = daysBetween(plant.nextWateringAt, today());
  if (daysOverdue > 0) {
    date = addDays(date, Math.floor(daysOverdue / frequency) * frequency);
  }

  while (dates.length < cycles) {
    const fireAt = atNineAm(date);
    if (fireAt.getTime() > now) dates.push(fireAt);
    date = addDays(date, frequency);
  }

  return dates;
}

/**
 * Recria todos os agendamentos a partir do estado atual do banco.
 * Cancelar tudo e reagendar é mais barato (e mais seguro) do que rastrear ids
 * individuais: o app tem poucas plantas e qualquer divergência se autocorrige.
 */
export async function rescheduleAllReminders(plants: Plant[]): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();

  if (plants.length === 0 || !(await hasPermission())) return;

  const cyclesPerPlant = Math.max(
    1,
    Math.min(MAX_CYCLES_PER_PLANT, Math.floor(MAX_SCHEDULED / plants.length))
  );

  for (const plant of plants) {
    for (const date of upcomingWateringDates(plant, cyclesPerPlant)) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Hora de regar',
          body: `${plant.name} precisa de água hoje.`,
          data: { [PLANT_ID_DATA_KEY]: plant.id },
          sound: 'default',
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date,
          channelId: CHANNEL_ID,
        },
      });
    }
  }
}
