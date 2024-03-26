'use client';
import { Link, Url } from '@custom/schema';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import React, { PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shadcn/accordion';
import { Sheet, SheetContent, SheetTrigger } from '@/shadcn/sheet';

export function MobileMenu({ children }: PropsWithChildren<{}>) {
  const intl = useIntl();
  return (
    <div className={'lg:hidden'}>
      <Sheet>
        <SheetTrigger
          asChild
          className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
        >
          <button>
            <span className="sr-only">
              {intl.formatMessage({
                defaultMessage: 'Open main navigation',
                id: 'e7yFQY',
              })}
            </span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </SheetTrigger>
        <SheetContent className="bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <Accordion type="multiple">{children}</Accordion>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function MobileMenuLink({ title, href }: { href: Url; title: string }) {
  return (
    <Link
      href={href}
      className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
    >
      {title}
    </Link>
  );
}

export function MobileMenuDropdown({
  title,
  target,
  children,
}: PropsWithChildren<{ title: string; target?: Url }>) {
  return (
    <AccordionItem value={title.replace(/\s+/g, '-')} className="-mx-3">
      <div
        className={`block w-full items-center justify-between rounded-lg pb-2 pl-3 pr-3.5 text-base font-semibold leading-7`}
      >
        <AccordionTrigger className={'w-full'}>
          <span className={'text-base font-semibold leading-7'}>{title}</span>
          <ChevronDownIcon className="h-5 w-5 shrink-0 transition-transform duration-200" />
        </AccordionTrigger>
      </div>
      <AccordionContent className="space-y-2">
        {target && (
          <a
            href={target}
            className={
              'block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50'
            }
          >
            {title}
          </a>
        )}
        {children}
      </AccordionContent>
    </AccordionItem>
  );
}
