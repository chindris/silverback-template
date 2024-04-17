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
          blockquote: ({ children }: PropsWithChildren<{}>) => {
            return (
              <blockquote className="border-l-0 relative pl-0">
                <svg
                  width="32"
                  height="24"
                  viewBox="0 0 32 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.6893 24V14.1453C18.6893 6.54 23.664 1.38533 30.6667 0L31.9933 2.868C28.7507 4.09066 26.6667 7.71867 26.6667 10.6667H32V24H18.6893ZM0 24V14.1453C0 6.54 4.99733 1.384 12 0L13.328 2.868C10.084 4.09066 8 7.71867 8 10.6667L13.3107 10.6667V24H0Z"
                    fill="#9CA3AF"
                  />
                </svg>
                {children}
              </blockquote>
            );
          },
        }}
        markup={props.markup}
      />
    </div>
  );
}
