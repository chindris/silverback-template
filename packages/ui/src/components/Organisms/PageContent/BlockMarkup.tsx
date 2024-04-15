import { BlockMarkupFragment, Html } from '@custom/schema';
import { ArrowRightCircleIcon } from '@heroicons/react/20/solid';
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

export function BlockMarkup(props: BlockMarkupFragment) {
  return (
    <div
      className={clsx([
        'mx-auto max-w-3xl prose lg:prose-xl mt-10',
        'prose-a:text-indigo-600',
        'prose-blockquote:border-indigo-200',
        'prose-em:text-indigo-600',
        'prose-strong:text-indigo-600',
        'marker:text-indigo-600 marker:font-bold',
        'prose-h2:text-indigo-600 prose-h2:font-bold',
      ])}
    >
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
                className={clsx(className, { 'list-none relative': unordered })}
              >
                {unordered ? (
                  <ArrowRightCircleIcon className="not-prose w-6 h-6 absolute mt-1.5 left-[-1.5em] text-indigo-600" />
                ) : null}
                {children}
              </li>
            );
          },
        }}
        markup={props.markup}
      />
    </div>
  );
}
