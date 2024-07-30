import { useIntl } from '@amazeelabs/react-intl';
import {
  BlockTeaserListFragment,
  Locale,
  TeaserListQuery,
} from '@custom/schema';
import queryString from 'query-string';
import React from 'react';

import { useOperation } from '../../../utils/operation';
import { TeaserItem } from '../../Molecules/TeaserItem';

export type TeaserListQueryArgs = {
  title: string | undefined;
  pageSize: string | undefined;
  excludeIds: string | undefined;
};

function getUUIDFromId(id: string) {
  const words = id.split(':');
  if (words.length === 1) {
    return id;
  }
  return words[1];
}

export function BlockTeaserList(props: BlockTeaserListFragment) {
  const staticIds: Array<string | undefined> = [];
  return (
    <div>
      {props.staticContent?.map((teaserItem) => {
        staticIds.push(getUUIDFromId(teaserItem?.content?.id || ''));
        return teaserItem?.content ? (
          <TeaserItem
            key={teaserItem?.content?.title}
            readMoreText={props.buttonText}
            {...teaserItem?.content}
          />
        ) : null;
      })}
      {props.contentHubEnabled && (
        <DynamicTeaserList excludeIds={staticIds} {...props} />
      )}
    </div>
  );
}

export function DynamicTeaserList(
  props: BlockTeaserListFragment & { excludeIds: Array<string | undefined> },
) {
  const intl = useIntl();
  const { data, isLoading } = useOperation(TeaserListQuery, {
    locale: intl.locale as Locale,
    args: queryString.stringify(
      {
        title: props.filters?.title,
        pageSize: (props.filters?.limit || '0') as string,
        // The excludeIds field should contain a regular expreession value, so
        // the final value would be something like: (^id1$|^id2$|^id3$), meaning
        // that the results with the id1, id2 and id3 should be excluded, as
        // they were already present in the static content.
        excludeIds: props.excludeIds
          ? `(^${props.excludeIds.join('$|^')}$)`
          : '',
      } satisfies TeaserListQueryArgs,
      { arrayFormat: 'bracket' },
    ),
  });
  if (!isLoading && data?.teaserList.items) {
    return (
      <>
        {data.teaserList.items.map((teaserItem) => {
          return teaserItem ? (
            <TeaserItem
              key={teaserItem.id}
              readMoreText={props.buttonText}
              {...teaserItem}
            />
          ) : null;
        })}
      </>
    );
  }
  return null;
}
