import { useLocation, ViewPageQuery } from '@custom/schema';
import React from 'react';

import { isTruthy } from '../../utils/isTruthy';
import { useOperation } from '../../utils/operation';
import { UnreachableCaseError } from '../../utils/unreachable-case-error';
import { PageTransition } from '../Molecules/PageTransition';
import { BlockForm } from '../Organisms/PageContent/BlockForm';
import { BlockMarkup } from '../Organisms/PageContent/BlockMarkup';
import { BlockMedia } from '../Organisms/PageContent/BlockMedia';
import { PageHero } from '../Organisms/PageHero';

export function Page() {
  // Retrieve the current location and load the page
  // behind it.
  const [loc] = useLocation();
  const { data } = useOperation(ViewPageQuery, { pathname: loc.pathname });
  data?.page;
  return data?.page ? (
    <PageTransition>
      <div>
        {data.page.hero ? <PageHero {...data.page.hero} /> : null}
        <div className="bg-white py-12 px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
            <div className="mt-10">
              {data.page?.content?.filter(isTruthy).map((block, index) => {
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
  ) : (
    <div>No page found for {loc.pathname}</div>
  );
}
