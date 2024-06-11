import { BlockMediaFragment, Html, Image } from '@custom/schema';
import React from 'react';

import { UnreachableCaseError } from '../../../utils/unreachable-case-error';

export function BlockMedia(props: BlockMediaFragment) {
  if (!props.media) {
    return null;
  }
  return (
    <div className="container-page">
      <div className="container-content">
        <figure className="mt-16 container-text">
          <Media {...props.media} />
          {props.caption ? (
            <figcaption className="mt-3 flex justify-center gap-x-2 text-sm leading-6 text-gray-500">
              <Html markup={props.caption} />
            </figcaption>
          ) : null}
        </figure>
      </div>
    </div>
  );
}

function Media(props: Required<BlockMediaFragment>['media']) {
  switch (props.__typename) {
    case 'MediaImage':
      return (
        <Image
          className="max-w-full mx-auto"
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
