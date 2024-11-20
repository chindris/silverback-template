import { Locale, useLocation } from '@custom/schema';

const locales = Object.values(Locale);
export const defaultLocale: Locale = 'en';

export function isLocale(input: unknown): input is Locale {
  return locales.includes(input as Locale);
}

/**
 * Extract the current locale from the path prefix.
 */
export function useLocale() {
  const [{ pathname }] = useLocation();
  const prefix = pathname.split('/')[1];
  return isLocale(prefix) ? prefix : defaultLocale;
}

type Localized = { locale: Locale };

/**
 * Select the most appropriate of localization from a list of options.
 */
export function useLocalized<T extends Localized>(
  options?: Array<T | undefined>,
): T | undefined {
  const locale = useLocale();
  return (
    options?.filter((option) => option?.locale === locale).pop() ||
    options?.filter((option) => option?.locale === defaultLocale).pop()
  );
}
