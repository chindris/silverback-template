import { PageFragment } from '@custom/schema';
import React from 'react';

import { BlockImage } from '../Organisms/PageContent/BlockImage';
import { BlockText } from '../Organisms/PageContent/BlockText';
import { PageHero } from '../Organisms/PageHero';

export function Page(props: { page: PageFragment }) {
  return (
    <div>
      {props.page.hero ? <PageHero {...props.page.hero} /> : null}
      <div className="bg-white py-12 px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
          <div className="mt-10">
            {props.page?.content?.map((block, index) => {
              switch (block?.__typename) {
                case 'BlockImage':
                  return <BlockImage key={index} {...block} />;
                case 'BlockText':
                  return <BlockText key={index} {...block} />;
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
