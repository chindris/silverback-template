import { BlockImageFragment, Html, Image } from '@custom/schema';
import React from 'react';

import { ScrollPop } from '../../Client/ScrollPop';

export function BlockImage(props: BlockImageFragment) {
  return (
    <ScrollPop>
      <figure className="mt-16 mx-auto max-w-3xl">
        {props.image ? (
          <Image
            className="aspect-video rounded-xl object-cover w-full"
            source={props.image.source}
            alt={props.image.alt}
          />
        ) : null}
        {props.caption ? (
          <figcaption className="mt-4 flex gap-x-2 text-sm leading-6 text-gray-500">
            <Html markup={props.caption} />
          </figcaption>
        ) : null}
      </figure>
    </ScrollPop>
  );
}
