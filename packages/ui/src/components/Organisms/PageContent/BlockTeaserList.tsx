import { BlockTeaserListFragment } from '@custom/schema';
import React from 'react';

export function BlockTeaserList(props: BlockTeaserListFragment) {
  console.log(props);
  return (
    <div>
      {props.staticContent?.map((teaserItem) => {
        return (
          <BlockTeaserItemContent
            key={teaserItem?.content?.title}
            {...teaserItem?.content}
          />
        );
      })}
    </div>
  );
}

export function BlockTeaserItemContent({ title, hero }: any) {
  return (
    <>
      <h2>{title}</h2>
      <h3>{hero?.headline}</h3>
      <div>{hero?.lead}</div>
    </>
  );
}
