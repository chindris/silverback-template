import { PageFragment } from '@custom/schema';
import React from 'react';

import { isTruthy } from '../../utils/isTruthy';
import { UnreachableCaseError } from '../../utils/unreachable-case-error';
import { PageTransition } from '../Molecules/PageTransition';
import { BlockCta } from './PageContent/BlockCta';
import { BlockForm } from './PageContent/BlockForm';
import { BlockMarkup } from './PageContent/BlockMarkup';
import { BlockMedia } from './PageContent/BlockMedia';
import { BlockQuote } from './PageContent/BlockQuote';
import { PageHero } from './PageHero';

export function PageDisplay(page: PageFragment) {
  return (
    <PageTransition>
      <div>
        {page.hero ? <PageHero {...page.hero} /> : null}
        <div className="bg-white pt-5 pb-12 lg:px-8">
          <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
            {page?.content?.filter(isTruthy).map((block, index) => {
              switch (block.__typename) {
                case 'BlockMedia':
                  return <BlockMedia key={index} {...block} />;
                case 'BlockMarkup':
                  return <BlockMarkup key={index} {...block} />;
                case 'BlockForm':
                  return <BlockForm key={index} {...block} />;
                case 'BlockImageTeasers':
                  return (
                    // TODO: Implement BlockImageTeasers
                    <div
                      style={{
                        color: 'red',
                        border: 'solid 3px red',
                        padding: '3px',
                        margin: '5px 0',
                      }}
                      // eslint-disable-next-line react/jsx-no-literals
                    >
                      BlockImageTeasers goes here
                    </div>
                  );
                case 'BlockCta':
                  return <BlockCta key={index} {...block} />;
                case 'BlockImageWithText':
                  return (
                    // TODO: Implement BlockImageWithText
                    <div
                      style={{
                        color: 'red',
                        border: 'solid 3px red',
                        padding: '3px',
                        margin: '5px 0',
                      }}
                      // eslint-disable-next-line react/jsx-no-literals
                    >
                      BlockImageWithText goes here
                    </div>
                  );
                case 'BlockQuote':
                  return <BlockQuote key={index} {...block} />;
                default:
                  throw new UnreachableCaseError(block);
              }
            })}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
