import { daysBetween, today, type IsoDate } from '@/lib/dates';
import { colors } from '@/theme';

export type WateringStatus = {
  /** Dias de calendário até a próxima rega. Negativo quer dizer atrasada. */
  daysLeft: number;
  /** "Hoje é o dia", "Amanhã", "Em 5 dias", "Atrasada há 2 dias". */
  label: string;
  /** Versão curta usada no selo da tela de detalhe. */
  badge: string;
  color: string;
  /** Precisa de água agora — hoje ou antes. */
  isDue: boolean;
};

export function wateringStatus(nextWateringAt: IsoDate, reference: IsoDate = today()): WateringStatus {
  const daysLeft = daysBetween(reference, nextWateringAt);

  if (daysLeft < 0) {
    const dias = Math.abs(daysLeft);
    const label = dias === 1 ? 'Atrasada há 1 dia' : `Atrasada há ${dias} dias`;
    return { daysLeft, label, badge: label, color: colors.overdue, isDue: true };
  }

  if (daysLeft === 0) {
    return {
      daysLeft,
      label: 'Hoje é o dia',
      badge: 'Hoje é o dia',
      color: colors.green,
      isDue: true,
    };
  }

  if (daysLeft === 1) {
    return { daysLeft, label: 'Amanhã', badge: 'Amanhã', color: colors.textFaint, isDue: false };
  }

  return {
    daysLeft,
    label: `Em ${daysLeft} dias`,
    badge: `Em ${daysLeft} dias`,
    color: colors.textFaint,
    isDue: false,
  };
}

/** "Rega a cada 7 dias" / "Rega todo dia". */
export function frequencyLabel(frequencyDays: number): string {
  return frequencyDays === 1 ? 'Rega todo dia' : `Rega a cada ${frequencyDays} dias`;
}

/** Texto do aviso no topo da lista. `null` quando não há nada para regar. */
export function dueBannerLabel(dueCount: number): string | null {
  if (dueCount <= 0) return null;
  return dueCount === 1
    ? '1 planta precisa de água hoje'
    : `${dueCount} plantas precisam de água hoje`;
}
