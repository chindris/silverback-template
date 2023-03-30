'use client';
import { HeaderFragment, Link } from '@custom/schema';
import { Dialog, Disclosure, Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import React, { Fragment, useState } from 'react';

import { useLocale } from '../../utils/locale';
import { buildNavigationTree } from '../../utils/navigation';

export default function Header(props: HeaderFragment) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const items = buildNavigationTree(props.mainNavigation, useLocale());

  return (
    <header className="bg-white">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img
              className="h-8 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt=""
            />
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <Popover.Group className="hidden lg:flex lg:gap-x-12">
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
              <Popover className="relative" key={key}>
                <Popover.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
                  {item.title}
                  <ChevronDownIcon
                    className="h-5 w-5 flex-none text-gray-400"
                    aria-hidden="true"
                  />
                </Popover.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel className="absolute -left-8 top-full z-10 mt-3 w-56 rounded-xl bg-white p-2 shadow-lg ring-1 ring-gray-900/5">
                    {item.children.map((child) => (
                      <a
                        key={child.target}
                        href={child.target}
                        className="block rounded-lg py-2 px-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
                      >
                        {child.title}
                      </a>
                    ))}
                  </Popover.Panel>
                </Transition>
              </Popover>
            ),
          )}
        </Popover.Group>

        {/*TODO: Add the language switcher here.*/}
        {/*<div className="hidden lg:flex lg:flex-1 lg:justify-end">*/}
        {/*  <a href="#" className="text-sm font-semibold leading-6 text-gray-900">*/}
        {/*    Log in <span aria-hidden="true">&rarr;</span>*/}
        {/*  </a>*/}
        {/*</div>*/}
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=green&shade=600"
                alt=""
              />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
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
                    <Disclosure as="div" className="-mx-3" key={item.title}>
                      {({ open }) => (
                        <>
                          <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 hover:bg-gray-50">
                            {item.title}
                            <ChevronDownIcon
                              className={clsx('h-5 w-5 flex-none', {
                                'rotate-180': open,
                              })}
                              aria-hidden="true"
                            />
                          </Disclosure.Button>
                          <Disclosure.Panel className="mt-2 space-y-2">
                            {item.children.map((child) => (
                              <Disclosure.Button
                                key={child.title}
                                as="a"
                                href={child.target}
                                className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                              >
                                {child.title}
                              </Disclosure.Button>
                            ))}
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  ),
                )}
              </div>
              {/*TODO: Add the language switcher here.*/}
              {/*<div className="py-6">*/}
              {/*  <a*/}
              {/*    href="#"*/}
              {/*    className="-mx-3 block rounded-lg py-2.5 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"*/}
              {/*  >*/}
              {/*    Log in*/}
              {/*  </a>*/}
              {/*</div>*/}
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
