import { Link, Locale, useLocation } from '@custom/schema';
import clsx from 'clsx';
import React from 'react';

import { useTranslations } from '../../utils/translations';

export function LanguageSwitcher() {
  const translations = useTranslations();
  const [location] = useLocation();
  return (
    <ul className="flex gap-2 uppercase">
      {Object.values(Locale).map((locale) => (
        <li key={locale}>
          {translations[locale] ? (
            <Link
              href={translations[locale]!}
              className={clsx('text-gray-500', {
                underline: location.pathname !== translations[locale],
              })}
            >
              {locale}
            </Link>
          ) : (
            <span className="text-gray-400">{locale}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
