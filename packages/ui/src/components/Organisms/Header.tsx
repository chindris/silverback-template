import { FrameQuery, Link } from '@custom/schema';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { useIntl } from 'react-intl';

import { isTruthy } from '../../utils/isTruthy.js';
import { buildNavigationTree } from '../../utils/navigation.js';
import { useOperation } from '../../utils/operation.js';
import { DesktopMenu, DesktopMenuDropDown } from '../Client/DesktopMenu.js';
import {
  MobileMenu,
  MobileMenuButton,
  MobileMenuDropdown,
  MobileMenuLink,
  MobileMenuProvider,
} from '../Client/MobileMenu.js';
import { LanguageSwitcher } from '../Molecules/LanguageSwitcher.js';

function useHeaderNavigation(lang: string = 'en') {
  return (
    useOperation(FrameQuery)
      .data?.mainNavigation?.filter((nav) => nav?.locale === lang)
      .pop()
      ?.items.filter(isTruthy) || []
  );
}

export function Header() {
  const intl = useIntl();
  const items = buildNavigationTree(useHeaderNavigation(intl.locale));

  return (
    <MobileMenuProvider>
      <header className="bg-white">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">
                {intl.formatMessage({
                  defaultMessage: 'Company name',
                  id: 'FPGwAt',
                })}
              </span>
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt=""
              />
            </a>
          </div>
          <div className="flex lg:hidden">
            <MobileMenuButton className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700">
              <span className="sr-only">
                {intl.formatMessage({
                  defaultMessage: 'Open main navigation',
                  id: 'e7yFQY',
                })}
              </span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </MobileMenuButton>
          </div>
          <DesktopMenu>
            {items.map((item, key) =>
              item.children.length === 0 ? (
                <Link
                  key={key}
                  href={item.target}
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  {item.title}
                </Link>
              ) : (
                <DesktopMenuDropDown title={item.title} key={key}>
                  {item.children.map((child) => (
                    <Link
                      key={child.target}
                      href={child.target}
                      className="block rounded-lg py-2 px-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
                    >
                      {child.title}
                    </Link>
                  ))}
                </DesktopMenuDropDown>
              ),
            )}
            <LanguageSwitcher />
          </DesktopMenu>
        </nav>
        <MobileMenu>
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">
                {intl.formatMessage({
                  defaultMessage: 'Company name',
                  id: 'FPGwAt',
                })}
              </span>
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt=""
              />
            </a>
            <MobileMenuButton className="-m-2.5 rounded-md p-2.5 text-gray-700">
              <span className="sr-only">
                {intl.formatMessage({
                  defaultMessage: 'Close navigation',
                  id: 'SRsuWF',
                })}
              </span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </MobileMenuButton>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {items.map((item) =>
                  item.children.length === 0 ? (
                    <Link
                      key={item.title}
                      href={item.target}
                      className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      {item.title}
                    </Link>
                  ) : (
                    <MobileMenuDropdown title={item.title} key={item.title}>
                      {item.children.map((child) => (
                        <MobileMenuLink
                          key={child.target}
                          href={child.target}
                          title={child.title}
                        />
                      ))}
                    </MobileMenuDropdown>
                  ),
                )}
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </MobileMenu>
      </header>
    </MobileMenuProvider>
  );
}
