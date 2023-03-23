import { Locale } from '@custom/schema';

import { useIntl } from './intl';

export function useLocale() {
  return useIntl().locale as Locale;
}
