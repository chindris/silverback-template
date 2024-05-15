import { PageFragment } from '@custom/schema';
import React from 'react';

import { isTruthy } from '../../utils/isTruthy';
import { UnreachableCaseError } from '../../utils/unreachable-case-error';
import { BreadCrumbs } from '../Molecules/Breadcrumbs';
import { PageTransition } from '../Molecules/PageTransition';
import { BlockAccordion } from './PageContent/BlockAccordion';
import { BlockCta } from './PageContent/BlockCta';
import { BlockForm } from './PageContent/BlockForm';
import { BlockHorizontalSeparator } from './PageContent/BlockHorizontalSeparator';
import { BlockMarkup } from './PageContent/BlockMarkup';
import { BlockMedia } from './PageContent/BlockMedia';
import { BlockQuote } from './PageContent/BlockQuote';
import { PageHero } from './PageHero';

export function PageDisplay(page: PageFragment) {
  return (
    <PageTransition>
      <div>
        {!page.hero && <BreadCrumbs />}
        {page.hero && <PageHero {...page.hero} />}
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
            case 'BlockHorizontalSeparator':
              return <BlockHorizontalSeparator key={index} {...block} />;
            case 'BlockAccordion':
              return <BlockAccordion key={index} {...block} />;
            default:
              throw new UnreachableCaseError(block);
          }
        })}
      </div>
    </PageTransition>
  );
}
