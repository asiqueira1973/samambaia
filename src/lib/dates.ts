/**
 * Datas de rega são guardadas como data de calendário local ("YYYY-MM-DD"),
 * nunca como timestamp. Isso mantém "faltam 2 dias" correto mesmo que o app
 * seja aberto às 23h59 ou depois de uma viagem que muda o fuso.
 */

const MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];

const DIAS_DA_SEMANA = [
  'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado',
];

export type IsoDate = string;

function pad(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

export function toIsoDate(date: Date): IsoDate {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Data de hoje no fuso do aparelho. */
export function today(): IsoDate {
  return toIsoDate(new Date());
}

/** Converte "YYYY-MM-DD" em um Date à meia-noite local. */
export function toDate(iso: IsoDate): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(iso: IsoDate, days: number): IsoDate {
  const date = toDate(iso);
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
}

/** Quantos dias de calendário faltam de `from` até `to` (negativo = atrasado). */
export function daysBetween(from: IsoDate, to: IsoDate): number {
  const ms = toDate(to).getTime() - toDate(from).getTime();
  return Math.round(ms / 86_400_000);
}

/** "4 de setembro" — com o ano junto quando não é o ano corrente. */
export function formatLongDate(iso: IsoDate, reference: IsoDate = today()): string {
  const date = toDate(iso);
  const base = `${date.getDate()} de ${MESES[date.getMonth()]}`;
  return date.getFullYear() === toDate(reference).getFullYear()
    ? base
    : `${base} de ${date.getFullYear()}`;
}

/** "Quarta, 11 de setembro" — cabeçalho da lista. */
export function formatWeekdayHeader(iso: IsoDate): string {
  const date = toDate(iso);
  return `${DIAS_DA_SEMANA[date.getDay()]}, ${date.getDate()} de ${MESES[date.getMonth()]}`;
}

/** Meia-noite + 9h do dia informado, no fuso do aparelho. */
export function atNineAm(iso: IsoDate): Date {
  const date = toDate(iso);
  date.setHours(9, 0, 0, 0);
  return date;
}
