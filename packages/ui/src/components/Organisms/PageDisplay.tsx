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
import { BlockImageWithText } from './PageContent/BlockImageWithText';
import { BlockMarkup } from './PageContent/BlockMarkup';
import { BlockMedia } from './PageContent/BlockMedia';
import { BlockQuote } from './PageContent/BlockQuote';
import { PageHero } from './PageHero';

export function PageDisplay(page: PageFragment) {
  return (
    <PageTransition>
      <div>
        {!page.hero && <BreadCrumbs className="pt-5 mx-auto px-3.5" />}
        {page.hero && <PageHero {...page.hero} />}
        <div className="bg-white pt-5 pb-12 px-6 lg:px-8">
          {page.hero && <BreadCrumbs className="mx-auto max-w-3xl" />}
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
                  return <BlockImageWithText key={index} {...block} />;
                case 'BlockQuote':
                  return <BlockQuote key={index} {...block} />;
                case 'BlockHorizontalSeparator':
                  return <BlockHorizontalSeparator key={index} {...block} />;
                case 'BlockAccordion':
                  return <BlockAccordion key={index} {...block} />;
                case 'BlockInfoGrid':
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
                      BlockInfoGrid goes here
                      <br />
                      ---
                      <br />
                      {block.gridItems.map((item, index) => {
                        return (
                          <>
                            <div key={index}>
                              <p>Icon: {item?.icon}</p>
                              <p>Markup: {item?.textContent?.markup}</p>
                              <p>CTA Url: {item?.cta?.url}</p>
                              <p>CTA Icon: {item?.cta?.icon}</p>
                              <p>
                                CTA Icon Position: {item?.cta?.iconPosition}
                              </p>
                              <p>CTA Text: {item?.cta?.text}</p>
                              <p>
                                CTA Open in New Tab: {item?.cta?.openInNewTab}
                              </p>
                            </div>
                            <br />
                          </>
                        );
                      })}
                    </div>
                  );
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
