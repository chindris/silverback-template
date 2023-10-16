import { PageFragment } from '@custom/schema';
import React from 'react';

import { isTruthy } from '../../utils/isTruthy';
import { UnreachableCaseError } from '../../utils/unreachable-case-error';
import { PageTransition } from '../Molecules/PageTransition';
import { BlockForm } from '../Organisms/PageContent/BlockForm';
import { BlockMarkup } from '../Organisms/PageContent/BlockMarkup';
import { BlockMedia } from '../Organisms/PageContent/BlockMedia';
import { PageHero } from '../Organisms/PageHero';

export function Page(props: { page: PageFragment }) {
  return (
    <PageTransition>
      <div>
        {props.page.hero ? <PageHero {...props.page.hero} /> : null}
        <div className="bg-white py-12 px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
            <div className="mt-10">
              {props.page?.content?.filter(isTruthy).map((block, index) => {
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
