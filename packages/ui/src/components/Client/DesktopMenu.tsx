'use client';
import { Disclosure, Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import React, { PropsWithChildren } from 'react';

import { avoidFocusOnClick } from '../../utils/avoidFocusOnClick';

export function DesktopMenu({ children }: PropsWithChildren<{}>) {
  return (
    <Popover.Group className="hidden lg:flex lg:gap-x-12">
      {children}
    </Popover.Group>
  );
}

export function DesktopMenuDropDown({
  title,
  children,
}: PropsWithChildren<{ title: string }>) {
  return (
    <Popover className="relative">
      {({ open }) => (
        <React.Fragment>
          <Popover.Button
            className={clsx(
              'flex items-center text-base font-medium ml-8 hover:text-blue-600',
              open ? 'text-blue-600' : 'text-gray-600',
            )}
            onClick={() => avoidFocusOnClick()}
          >
            {title}
            <ChevronDownIcon
              className={clsx(
                'h-5 w-5 flex-none text-blue-600',
                open && 'rotate-180',
              )}
              aria-hidden="true"
            />
          </Popover.Button>
          <Transition
            as={React.Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel
              static
              className="absolute left-8 top-full z-10 mt-3 w-56 rounded bg-white shadow-md ring-1 ring-gray-100"
            >
              {children}
            </Popover.Panel>
          </Transition>
        </React.Fragment>
      )}
    </Popover>
  );
}

export function DesktopMenuDropdownDisclosure({
  title,
  children,
}: PropsWithChildren<{ title: string }>) {
  return (
    <Disclosure as="div" className="">
      {({ open }) => (
        <div className={clsx('m-1.5 rounded', open && 'bg-gray-100')}>
          <Disclosure.Button
            className={clsx(
              'flex w-full items-center justify-between px-2 py-1 text-sm leading-[1.25rem] hover:text-blue-600',
              open ? 'text-blue-600 font-medium' : 'text-gray-500',
            )}
          >
            {title}
            <ChevronDownIcon
              className={clsx('h-5 w-5 flex-none text-blue-600', {
                'rotate-180': open,
              })}
              aria-hidden="true"
            />
          </Disclosure.Button>
          <Disclosure.Panel className="">{children}</Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
}
