'use client';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import React, { PropsWithChildren } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/popover';

export function DesktopMenu({ children }: PropsWithChildren<{}>) {
  return <div className="hidden lg:flex lg:gap-x-12">{children}</div>;
}

export function DesktopMenuDropDown({
  title,
  children,
}: PropsWithChildren<{ title: string }>) {
  return (
    <Popover>
      <PopoverTrigger className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
        {title}
        <ChevronDownIcon
          className="h-5 w-5 flex-none text-gray-400"
          aria-hidden="true"
        />
      </PopoverTrigger>

      <PopoverContent className="absolute -left-16 top-full z-10 mt-3 w-56 rounded-xl bg-white p-2 shadow-lg ring-1 ring-gray-900/5">
        {children}
      </PopoverContent>
    </Popover>
  );
}
