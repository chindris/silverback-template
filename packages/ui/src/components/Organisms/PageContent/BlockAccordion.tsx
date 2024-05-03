import {
  BlockAccordionFragment,
  BlockAccordionItemTextFragment,
} from '@custom/schema';
import {
  ArrowRightCircleIcon,
  CheckCircleIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/20/solid';
import React from 'react';

import { BlockMarkup } from './BlockMarkup';

export function BlockAccordion(props: BlockAccordionFragment) {
  return (
    <div data-accordion="open">
      {props.items.map((item, index) => (
        <AccordionItemText key={index} id={index} {...item} />
      ))}
    </div>
  );
}

function AccordionItemText(
  props: BlockAccordionItemTextFragment & {
    id: number;
  },
) {
  return (
    <>
      <h2 id={`accordion-open-heading-${props.id}`}>
        <button
          type="button"
          className="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3"
          data-accordion-target={`#accordion-open-body-${props.id}`}
          aria-expanded="true"
          aria-controls={`accordion-open-body-${props.id}`}
        >
          <span className="flex items-center">
            {props.icon && <AccordionIcon icon={props.icon} />} {props.title}
          </span>
        </button>
      </h2>
      <div
        id={`accordion-open-body-${props.id}`}
        className="hidden"
        aria-labelledby="accordion-open-heading-1"
      >
        <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
          {props.textContent?.markup && <BlockMarkup {...props.textContent} />}
        </div>
      </div>
    </>
  );
}

function AccordionIcon({ icon }: { icon: string }) {
  switch (icon) {
    case 'questionmark':
      return <QuestionMarkCircleIcon className="w-5 h-5 me-2 shrink-0" />;
    case 'checkmark':
      return <CheckCircleIcon className="w-5 h-5 me-2 shrink-0" />;
    case 'arrow':
      return <ArrowRightCircleIcon className="w-5 h-5 me-2 shrink-0" />;
    default:
      return null;
  }
}
