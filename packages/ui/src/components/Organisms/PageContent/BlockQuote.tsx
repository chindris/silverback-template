import { BlockQuoteFragment, Html, Image } from '@custom/schema';
import React from 'react';

export function BlockQuote(props: BlockQuoteFragment) {
  return (
    <div className="container-content">
      <div className="prose lg:prose-xl prose-p:text-xl prose-p:font-bold prose-p:leading-8 prose-p:text-[#111928]">
        <blockquote className="border-l-0 relative pl-0 pb-8 pt-16">
          <svg
            width="32"
            height="24"
            viewBox="0 0 32 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-labelledby="quote-svg-title"
          >
            <title id="quote-svg-title">Quote Symbol</title>
            <path
              d="M18.6893 24V14.1453C18.6893 6.54 23.664 1.38533 30.6667 0L31.9933 2.868C28.7507 4.09066 26.6667 7.71867 26.6667 10.6667H32V24H18.6893ZM0 24V14.1453C0 6.54 4.99733 1.384 12 0L13.328 2.868C10.084 4.09066 8 7.71867 8 10.6667L13.3107 10.6667V24H0Z"
              fill="#9CA3AF"
            />
          </svg>
          <p>{props.quote && <Html markup={props.quote} />}</p>
          <div className="flex not-prose items-center flex-wrap">
            {props.image && (
              <Image
                className="w-6 h-6 rounded-full object-contain mr-3.5 "
                source={props.image.source}
                alt={props.image.alt || 'Author image'}
              />
            )}
            <div className="not-italic text-base font-semibold">
              {props.author && <p className="not-prose">{props.author}</p>}
            </div>
            {props.role && (
              <p className="not-prose flex">
                <span className="ml-3 text-base">/</span>
                <span className="mt-0.5 not-italic text-gray-500 text-sm ml-3">
                  {props.role}
                </span>
              </p>
            )}
          </div>
        </blockquote>
      </div>
    </div>
  );
}
