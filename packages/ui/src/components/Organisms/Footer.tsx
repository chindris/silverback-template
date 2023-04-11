import { Link, NavigationFragment } from '@custom/schema';
import React from 'react';

import { useIntl } from '../../utils/intl';
import { isTruthy } from '../../utils/isTruthy';

export function Footer(props: { footerNavigation: NavigationFragment }) {
  const intl = useIntl();
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl overflow-hidden py-20 px-6 sm:py-24 lg:px-8">
        <nav
          className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12"
          aria-label="Footer"
        >
          {props.footerNavigation.items.filter(isTruthy).map((item) => (
            <div key={item.title} className="pb-6">
              <Link
                href={item.target}
                className="text-sm leading-6 text-gray-600 hover:text-gray-900"
              >
                {item.title}
              </Link>
            </div>
          ))}
        </nav>
        <p className="mt-10 text-center text-xs leading-5 text-gray-500">
          {intl.formatMessage(
            {
              defaultMessage:
                '&copy; {year} {company_name}. All rights reserved.',
              id: 'H3UnZS',
            },
            {
              year: 2020,
              company_name: 'Company name, Inc',
            },
          )}
        </p>
      </div>
    </footer>
  );
}
