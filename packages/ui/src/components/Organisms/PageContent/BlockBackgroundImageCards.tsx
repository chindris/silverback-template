import {
  BlockImageTeaser,
  BlockImageTeasers,
  Image,
  Link,
} from '@custom/schema';
import React from 'react';

import { isTruthy } from '../../../utils/isTruthy';

export function BlockBackgroundImageCards(props: BlockImageTeasers) {
  return (
    // eslint-disable-next-line tailwindcss/no-custom-classname
    <section className="container-page my-16 block-background-image-cards">
      <div className="container-content text-center">
        <div className="grid grid-cols-2 gap-2">
          {props.teasers.filter(isTruthy).map((teaser, index) => (
            <BlockBackgroundImageCard key={index} {...teaser} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function BlockBackgroundImageCard(props: BlockImageTeaser) {
  return (
    <div className="p-8 col-span-2 md:col-span-1 text-left h-72 md:h-96 relative bg-gray-900">
      {props.image ? (
        <Image
          className="object-cover w-full h-72 md:h-96 mb-5 absolute top-0 left-0"
          source={props.image.source}
          alt={props.image.alt}
        />
      ) : null}

      <div className={'relative'}>
        {props.title ? (
          <h2 className="mb-5 max-w-xl text-4xl font-extrabold tracking-tight leading-tight text-white">
            {props.title}
          </h2>
        ) : null}

        {props.ctaUrl && props.ctaText ? (
          <Link
            href={props.ctaUrl}
            type="button"
            className="inline-flex items-center px-4 py-2.5 font-medium text-center text-white border border-white rounded-lg hover:bg-white hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-700"
          >
            {props.ctaText}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
