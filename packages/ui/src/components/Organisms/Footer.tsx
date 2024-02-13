import { FrameQuery, Link } from '@custom/schema';
import React from 'react';
import { useIntl } from 'react-intl';

import { isTruthy } from '../../utils/isTruthy';
import { buildNavigationTree } from '../../utils/navigation';
import { useOperation } from '../../utils/operation';

function useFooterNavigation(lang: string = 'en') {
  return (
    useOperation(FrameQuery)
      .data?.footerNavigation?.filter((nav) => nav?.locale === lang)
      .pop()
      ?.items.filter(isTruthy) || []
  );
}

export function Footer() {
  const intl = useIntl();
  const items = buildNavigationTree(useFooterNavigation(intl.locale));
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl overflow-hidden py-20 px-6 sm:py-24 lg:px-8">
        <nav
          className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12"
          aria-label="Footer"
        >
          {items.filter(isTruthy).map((item) => (
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
          &copy;{' '}
          {intl.formatMessage(
            {
              defaultMessage: '{year} {company_name}. All rights reserved.',
              id: 'qA8qQH',
            },
            {
              year: 2024,
              company_name: intl.formatMessage({
                defaultMessage: 'Company name',
                id: 'FPGwAt',
              }),
            },
          )}
        </p>
      </div>
    </footer>
  );
}
