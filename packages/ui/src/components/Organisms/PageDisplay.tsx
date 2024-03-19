import { PageFragment } from '@custom/schema';
import React from 'react';

import { isTruthy } from '../../utils/isTruthy.js';
import { UnreachableCaseError } from '../../utils/unreachable-case-error.js';
import { PageTransition } from '../Molecules/PageTransition.js';
import { BlockForm } from './PageContent/BlockForm.js';
import { BlockMarkup } from './PageContent/BlockMarkup.js';
import { BlockMedia } from './PageContent/BlockMedia.js';
import { PageHero } from './PageHero.js';

export function PageDisplay(page: PageFragment) {
  return (
    <PageTransition>
      <div>
        {page.hero ? <PageHero {...page.hero} /> : null}
        <div className="bg-white py-12 px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
            <div className="mt-10">
              {page?.content?.filter(isTruthy).map((block, index) => {
                switch (block.__typename) {
                  case 'BlockMedia':
                    return <BlockMedia key={index} {...block} />;
                  case 'BlockMarkup':
                    return <BlockMarkup key={index} {...block} />;
                  case 'BlockForm':
                    return <BlockForm key={index} {...block} />;
                  default:
                    throw new UnreachableCaseError(block);
                }
              })}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
