import { BlockMediaFragment, Html, Image } from '@custom/schema';
import React from 'react';

import { UnreachableCaseError } from '../../../utils/unreachable-case-error';

export function BlockMedia(props: BlockMediaFragment) {
  if (!props.media) {
    return null;
  }
  return (
    <figure className="mt-16 mx-auto max-w-3xl">
      <Media {...props.media} />
      {props.caption ? (
        <figcaption className="mt-4 flex gap-x-2 text-sm leading-6 text-gray-500">
          <Html markup={props.caption} />
        </figcaption>
      ) : null}
    </figure>
  );
}

function Media(props: Required<BlockMediaFragment>['media']) {
  switch (props.__typename) {
    case 'MediaImage':
      return (
        <Image
          className="rounded-xl max-w-full mx-auto"
          source={props.source}
          alt={props.alt}
        />
      );
    case 'MediaVideo':
      return <video src={props.url} controls />;
    default:
      throw new UnreachableCaseError(props);
  }
}
