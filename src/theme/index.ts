/**
 * Paleta e medidas extraídas do mockup em `telas-do-app-samambaia/`.
 * Tipografia é a padrão do sistema (San Francisco no iOS, Roboto no Android),
 * por isso nenhum `fontFamily` é declarado em lugar nenhum do app.
 */
export const colors = {
  /** Verde da marca — botões, destaques e o ícone do app. */
  green: '#1F6B3B',
  greenPressed: '#16522C',
  /** Fundo dos avisos e do selo de status. */
  greenSoft: '#EAF3EC',
  greenBorder: '#C8DFCF',

  text: '#15201A',
  textMuted: '#6C7A70',
  textFaint: '#8A9990',
  textDisabled: '#C8CFC9',

  border: '#E6EAE5',
  surface: '#FFFFFF',
  surfaceSoft: '#F6F8F5',
  surfaceDashed: '#F1F4F0',
  photoPlaceholder: '#EEF1EC',

  /** Planta que passou do dia de regar. */
  overdue: '#C2410C',
} as const;

export const radius = {
  card: 22,
  photoThumb: 18,
  photoLarge: 26,
  field: 20,
  button: 18,
  buttonLarge: 20,
  pill: 999,
} as const;

/** Margem horizontal usada em todas as telas. */
export const screenPadding = 22;
