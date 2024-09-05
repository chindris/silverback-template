import { Image } from '@amazeelabs/image';
import { BlockImageWithTextFragment, ImagePosition } from '@custom/schema';
import clsx from 'clsx';
import React from 'react';

import { FadeUp } from '../../Molecules/FadeUp';
import { BlockMarkup } from './BlockMarkup';

export function BlockImageWithText(props: BlockImageWithTextFragment) {
  return (
    <FadeUp yGap={50}>
      <div className="container-page">
        <div className="container-content my-12 lg:my-16">
          <div
            className={clsx(
              'flex flex-col lg:flex-row gap-8 lg:gap-16 items-start lg:items-center',
              {
                'lg:flex-row-reverse':
                  props.imagePosition === ImagePosition.Left,
              },
            )}
          >
            <div className={'lg:w-1/2 nested-container prose-li:text-base'}>
              {props.textContent?.markup && (
                <BlockMarkup {...props.textContent} />
              )}
            </div>
            {!!props.image?.url && (
              <div className={'lg:w-1/2 self-start'}>
                <Image
                  className="object-cover w-full"
                  src={props.image.url}
                  width={608}
                  alt={props.image.alt || ''}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </FadeUp>
  );
}
