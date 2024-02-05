import { useLocation } from '@amazeelabs/scalars';

import { Locale } from './generated/index.js';

const locales = Object.values(Locale);
const defaultLocale: Locale = 'en';

function isLocale(input: any): input is Locale {
  return locales.includes(input);
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
