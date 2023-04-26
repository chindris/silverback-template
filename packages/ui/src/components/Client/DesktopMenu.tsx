'use client';
import { Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import React, { Fragment, PropsWithChildren } from 'react';

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
      <Popover.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
        {title}
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
          {children}
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
