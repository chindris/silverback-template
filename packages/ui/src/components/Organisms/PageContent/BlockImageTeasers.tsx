import { BlockImageTeasersFragment, Image, Link } from '@custom/schema';
import clsx from 'clsx';
import React from 'react';

import { isTruthy } from '../../../utils/isTruthy';

export function BlockImageTeasers(props: BlockImageTeasersFragment) {
  return (
    // eslint-disable-next-line tailwindcss/no-custom-classname
    <section className="my-10 block-background-image-cards">
      <div className="text-center">
        <div
          className={clsx('grid gap-2', {
            'grid-cols-2': props.teasers.filter(isTruthy).length > 1,
          })}
        >
          {props.teasers.filter(isTruthy).map((teaser, index) => (
            <BlockImageTeaser key={index} {...teaser} />
          ))}
        </div>
      </div>
    </section>
  );
}

// This component uses the following Flowbite component:
// https://flowbite.com/blocks/marketing/hero/#background-image-cards
export function BlockImageTeaser(
  props: BlockImageTeasersFragment['teasers'][0],
) {
  return (
    <div className="p-8 pl-5 md:pl-14 lg:pl-20 col-span-2 lg:col-span-1 text-left h-72 lg:h-96 relative bg-gray-900">
      {props.image ? (
        <Image
          className="object-cover w-full h-72 lg:h-96 absolute top-0 left-0"
          source={props.image.source}
          alt={props.image.alt}
        />
      ) : null}

      <div className={'relative'}>
        {props.title ? (
          <h2 className="mb-6 max-w-xl text-4xl font-bold tracking-tight leading-tight text-white">
            {props.title}
          </h2>
        ) : null}

        {props.ctaUrl && props.ctaText ? (
          <Link
            href={props.ctaUrl}
            type="button"
            className="inline-flex text-base items-center px-5 py-3 font-medium text-center text-white border border-white rounded-lg hover:bg-white hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-700"
          >
            {props.ctaText}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
