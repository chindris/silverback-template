import { Link, Locale, useLocation } from '@custom/schema';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import React, { Fragment } from 'react';

import { useTranslations } from '../../utils/translations';

function getLanguageName(locale: string) {
  const languageNames = new Intl.DisplayNames([locale], {
    type: 'language',
  });
  return languageNames.of(locale);
}

export function LanguageSwitcher() {
  const translations = useTranslations();
  const [location] = useLocation();
  const currentLocale = Object.values(Locale).find((locale) => {
    const translationPath = translations[locale];
    return location.pathname.includes(translationPath || '');
  });

  if (!currentLocale) {
    console.error(
      'No matching locale found in current path:',
      location.pathname,
    );
    return null;
  }

  const otherLocales = Object.values(Locale).filter(
    (locale) => locale !== currentLocale,
  );

  return (
    <div className="relative inline-block text-left">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex justify-center w-full rounded-md bg-white text-sm hover:text-blue-600">
            {getLanguageName(currentLocale as string)}
            <ChevronDownIcon className="ml-1 h-5 w-5" aria-hidden="true" />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Menu.Items className="origin-top-right absolute z-50 right-0 mt-3 w-48 rounded bg-white shadow-md ring-1 ring-gray-100">
            <div className="py-1">
              {otherLocales.map((locale) => (
                <Menu.Item key={locale}>
                  {({ focus }) =>
                    translations[locale] ? (
                      <Link
                        href={translations[locale]!}
                        className={clsx(
                          focus ? 'text-blue-600' : 'text-gray-500',
                          'block px-4 py-2 text-sm',
                        )}
                      >
                        {getLanguageName(locale as string)}
                      </Link>
                    ) : (
                      <span
                        className={clsx(
                          focus ? 'bg-gray-100 text-gray-900' : 'text-gray-500',
                          'block px-3.5 py-2 text-sm',
                        )}
                      >
                        {getLanguageName(locale as string)}
                      </span>
                    )
                  }
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
