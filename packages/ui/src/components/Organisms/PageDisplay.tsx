'use client';
import { BlockConditionalFragment, PageFragment } from '@custom/schema';
import React from 'react';

import { isTruthy } from '../../utils/isTruthy';
import { UnreachableCaseError } from '../../utils/unreachable-case-error';
import { BreadCrumbs } from '../Molecules/Breadcrumbs';
import { PageTransition } from '../Molecules/PageTransition';
import { BlockAccordion } from './PageContent/BlockAccordion';
import { BlockConditional } from './PageContent/BlockConditional';
import { BlockCta } from './PageContent/BlockCta';
import { BlockForm } from './PageContent/BlockForm';
import { BlockHorizontalSeparator } from './PageContent/BlockHorizontalSeparator';
import { BlockImageTeasers } from './PageContent/BlockImageTeasers';
import { BlockImageWithText } from './PageContent/BlockImageWithText';
import { BlockInfoGrid } from './PageContent/BlockInfoGrid';
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
          if (block.__typename === 'BlockConditional') {
            return <BlockConditional key={index} {...block} />;
          } else {
            return <CommonContent key={index} {...block} />;
          }
        })}
      </div>
    </PageTransition>
  );
}

type CommonContentBlock = NonNullable<
  Required<BlockConditionalFragment>['content'][number]
>;

export function CommonContent(props: CommonContentBlock) {
  switch (props.__typename) {
    case 'BlockMedia':
      return <BlockMedia {...props} />;
    case 'BlockMarkup':
      return <BlockMarkup {...props} />;
    case 'BlockForm':
      return <BlockForm {...props} />;
    case 'BlockImageTeasers':
      return <BlockImageTeasers {...props} />;
    case 'BlockCta':
      return <BlockCta {...props} />;
    case 'BlockImageWithText':
      return <BlockImageWithText {...props} />;
    case 'BlockQuote':
      return <BlockQuote {...props} />;
    case 'BlockHorizontalSeparator':
      return <BlockHorizontalSeparator />;
    case 'BlockAccordion':
      return <BlockAccordion {...props} />;
    case 'BlockInfoGrid':
      return <BlockInfoGrid {...props} />;
    default:
      throw new UnreachableCaseError(props);
  }
}
