'use client';
import { BlockAccordionFragment, Html } from '@custom/schema';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import {
  ArrowRightCircleIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/20/solid';
import clsx from 'clsx';
import type { Element } from 'hast';
import { selectAll } from 'hast-util-select';
import React, { PropsWithChildren } from 'react';
import { Plugin } from 'unified';

const unorderedItems: Plugin<[], Element> = () => (tree) => {
  selectAll('ul > li', tree).forEach((node) => {
    node.properties!.unordered = true;
  });
};

type HeadingProps = {
  level?: string;
  className?: string;
  children: React.ReactNode;
};
const Heading = ({ level, className, children }: HeadingProps) => {
  switch (level) {
    case 'h1':
      return <h1 className={className}>{children}</h1>;
    case 'h2':
      return <h2 className={className}>{children}</h2>;
    case 'h3':
      return <h3 className={className}>{children}</h3>;
    case 'h4':
      return <h4 className={className}>{children}</h4>;
    case 'h5':
      return <h5 className={className}>{children}</h5>;
    case 'h6':
      return <h6 className={className}>{children}</h6>;
    default:
      return <h2 className={className}>{children}</h2>;
  }
};

export function BlockAccordion(props: BlockAccordionFragment) {
  return (
    <div className="container-page my-10">
      <div className="container-content">
        <div className="container-text">
          {props.items.map((item, index) => (
            <Disclosure
              as="div"
              className="border-b border-gray-200 last:border-0"
              key={index}
            >
              {({ open }) => (
                <>
                  <Heading level={props.headingLevel}>
                    <DisclosureButton
                      className={clsx(
                        'flex w-full items-center justify-between p-4 pl-1 text-left font-medium text-lg hover:bg-gray-100',
                        { 'text-black': open, 'text-gray-500': !open },
                      )}
                    >
                      <span className="flex items-center">
                        {item.icon && <AccordionIcon icon={item.icon} />}{' '}
                        {item.title}
                      </span>
                      <span>
                        {open ? (
                          <ChevronUpIcon
                            className={'h-6 w-6'}
                            focusable={false}
                          />
                        ) : (
                          <ChevronDownIcon
                            className={'h-6 w-6'}
                            focusable={false}
                          />
                        )}
                      </span>
                    </DisclosureButton>
                  </Heading>
                  <DisclosurePanel
                    className={clsx('py-5 text-base font-normal text-gray-500')}
                  >
                    <div className="sm:w-full md:w-4/5">
                      {item.textContent?.markup && (
                        <Html
                          plugins={[unorderedItems]}
                          components={{
                            li: ({
                              unordered,
                              children,
                              className,
                              ...props
                            }: PropsWithChildren<{
                              unordered?: boolean;
                              className?: string;
                            }>) => {
                              return (
                                <li
                                  {...props}
                                  className={clsx(className, {
                                    'ml-5 mt-1 mb-1 list-disc': unordered,
                                  })}
                                >
                                  {children}
                                </li>
                              );
                            },
                          }}
                          markup={item.textContent.markup}
                        />
                      )}
                    </div>
                  </DisclosurePanel>
                </>
              )}
            </Disclosure>
          ))}
        </div>
      </div>
    </div>
  );
}

function AccordionIcon({
  icon,
  focusable = false,
}: {
  icon: string;
  focusable?: boolean;
}) {
  switch (icon) {
    case 'questionmark':
      return (
        <QuestionMarkCircleIcon
          className="w-5 h-5 me-2 shrink-0 text-gray-500"
          focusable={focusable}
        />
      );
    case 'checkmark':
      return (
        <CheckCircleIcon
          className="w-5 h-5 me-2 shrink-0 text-gray-500"
          focusable={focusable}
        />
      );
    case 'arrow':
      return (
        <ArrowRightCircleIcon
          className="w-5 h-5 me-2 shrink-0 text-gray-500"
          focusable={focusable}
        />
      );
    default:
      return null;
  }
}
