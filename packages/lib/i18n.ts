export type Locale = 'en' | 'es' | 'fr' | 'de' | 'pt' | 'it';

export const SUPPORTED_LOCALES: Locale[] = ['en', 'es', 'fr', 'de', 'pt', 'it'];
export const DEFAULT_LOCALE: Locale = 'en';

export function resolveLocale(locale: string | null | undefined): Locale {
  if (!locale) return DEFAULT_LOCALE;
  const base = locale.split('-')[0] as Locale;
  return SUPPORTED_LOCALES.includes(base) ? base : DEFAULT_LOCALE;
}

export function getLocalizedPromptBody(
  body: string,
  bodyI18n: Record<string, string> | null | undefined,
  locale: Locale
): string {
  if (!bodyI18n) return body;
  return bodyI18n[locale] ?? bodyI18n[DEFAULT_LOCALE] ?? body;
}
