'use client';
import { Dialog, Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import React, { createContext, PropsWithChildren } from 'react';

const MobileMenuContext = createContext({
  isOpen: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setIsOpen: (isOpen: boolean) => {},
});

export function MobileMenuProvider({ children }: PropsWithChildren) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <MobileMenuContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </MobileMenuContext.Provider>
  );
}

export function MobileMenuButton(
  props: PropsWithChildren<{ className?: string }>,
) {
  const { isOpen, setIsOpen } = React.useContext(MobileMenuContext);
  return (
    <button
      type="button"
      className={props.className}
      onClick={() => setIsOpen(!isOpen)}
    >
      {props.children}
    </button>
  );
}

export function MobileMenu({ children }: PropsWithChildren<{}>) {
  const { isOpen, setIsOpen } = React.useContext(MobileMenuContext);
  return (
    <Dialog as="div" className="lg:hidden" open={isOpen} onClose={setIsOpen}>
      <div className="fixed inset-0 z-10" />
      <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        {children}
      </Dialog.Panel>
    </Dialog>
  );
}

export function MobileMenuLink({
  title,
  href,
}: {
  href: string;
  title: string;
}) {
  return (
    <Disclosure.Button
      as="a"
      href={href}
      className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
    >
      {title}
    </Disclosure.Button>
  );
}

export function MobileMenuDropdown({
  title,
  children,
}: PropsWithChildren<{ title: string }>) {
  return (
    <Disclosure as="div" className="-mx-3">
      {({ open }) => (
        <>
          <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 hover:bg-gray-50">
            {title}
            <ChevronDownIcon
              className={clsx('h-5 w-5 flex-none', {
                'rotate-180': open,
              })}
              aria-hidden="true"
            />
          </Disclosure.Button>
          <Disclosure.Panel className="mt-2 space-y-2">
            {children}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
