'use client';
import { Url } from '@custom/schema';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import React, { PropsWithChildren } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/popover';

export function DesktopMenu({ children }: PropsWithChildren<{}>) {
  return <div className="hidden lg:flex lg:gap-x-12">{children}</div>;
}

export function DesktopMenuDropDown({
  title,
  target,
  children,
}: PropsWithChildren<{ title: string; target?: Url }>) {
  return (
    <Popover>
      <PopoverTrigger className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
        {title}
        <ChevronDownIcon
          className="h-5 w-5 flex-none text-gray-400"
          aria-hidden="true"
        />
      </PopoverTrigger>

      <PopoverContent className="top-full z-10 mt-3 w-56 rounded-xl bg-white p-2 shadow-lg ring-1 ring-gray-900/5">
        {target && (
          <a
            href={target}
            className={
              'block pl-3 py-1.5 mb-2 rounded-lg text-sm font-semibold leading-7 text-gray-900 relative hover:bg-gray-50 after:absolute after:-bottom-1 after:left-0 after:w-full after:content-[""] after:block after:border-b after:border-b-gray-200'
            }
          >
            {title}
          </a>
        )}
        {children}
      </PopoverContent>
    </Popover>
  );
}
