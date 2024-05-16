import { BlockAccordionFragment, Html } from '@custom/schema';
import {
  ArrowRightCircleIcon,
  CheckCircleIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { Accordion, CustomFlowbiteTheme, Flowbite } from 'flowbite-react';
import type { Element } from 'hast';
import { selectAll } from 'hast-util-select';
import React, { PropsWithChildren } from 'react';
import { Plugin } from 'unified';

const unorderedItems: Plugin<[], Element> = () => (tree) => {
  selectAll('ul > li', tree).forEach((node) => {
    node.properties!.unordered = true;
  });
};

const accordionTheme: CustomFlowbiteTheme['accordion'] = {
  root: {
    base: 'mt-10 divide-y divide-gray-200 border-gray-200',
    flush: {
      off: 'last:border-0',
      on: 'last:border-0',
    },
  },
  content: {
    base: 'pb-5 pt-5 text-base font-normal text-gray-500',
  },
  title: {
    base: 'flex w-full items-center justify-between p-4 pl-1 text-left font-medium text-lg text-gray-500',
    flush: {
      off: 'hover:bg-gray-100',
      on: 'bg-transparent',
    },
    heading: '',
    open: {
      off: '',
      on: 'text-gray-900',
    },
  },
};

// Applying the custom theme to the Accordion component
// doesn't work out, wrapping it in a Flowbite component.
const theme: CustomFlowbiteTheme = {
  accordion: accordionTheme,
};

export function BlockAccordion(props: BlockAccordionFragment) {
  return (
    <div className="container-page">
      <div className="container-content">
        <div className="container-text">
          <Flowbite theme={{ theme }}>
            <Accordion collapseAll>
              {props.items.map((item, index) => (
                <Accordion.Panel key={index}>
                  <Accordion.Title>
                    <span className="flex items-center">
                      {item.icon && <AccordionIcon icon={item.icon} />}{' '}
                      {item.title}
                    </span>
                  </Accordion.Title>
                  <Accordion.Content className="space-y-2">
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
                  </Accordion.Content>
                </Accordion.Panel>
              ))}
            </Accordion>
          </Flowbite>
        </div>
      </div>
    </div>
  );
}

function AccordionIcon({ icon }: { icon: string }) {
  switch (icon) {
    case 'questionmark':
      return (
        <QuestionMarkCircleIcon className="w-5 h-5 me-2 shrink-0 text-gray-500" />
      );
    case 'checkmark':
      return (
        <CheckCircleIcon className="w-5 h-5 me-2 shrink-0 text-gray-500" />
      );
    case 'arrow':
      return (
        <ArrowRightCircleIcon className="w-5 h-5 me-2 shrink-0 text-gray-500" />
      );
    default:
      return null;
  }
}
