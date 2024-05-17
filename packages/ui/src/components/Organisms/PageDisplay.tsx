import { PageFragment } from '@custom/schema';
import React from 'react';

import { isTruthy } from '../../utils/isTruthy';
import { BreadCrumbs } from '../Molecules/Breadcrumbs';
import { PageTransition } from '../Molecules/PageTransition';
import {
  BlockConditional,
  CommonContent,
} from './PageContent/BlockConditional';
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
