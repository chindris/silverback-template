import { Locale, useLocation } from '@custom/schema';

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
