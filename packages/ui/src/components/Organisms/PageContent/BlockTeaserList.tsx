import { useIntl } from '@amazeelabs/react-intl';
import {
  BlockTeaserListFragment,
  Locale,
  TeaserListQuery,
} from '@custom/schema';
import queryString from 'query-string';
import React from 'react';

import { useOperation } from '../../../utils/operation';

export type TeaserListQueryArgs = {
  title: string | undefined;
  pageSize: string | undefined;
};

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
      {props.contentHubEnabled && <BlockDynamicTeaserList {...props} />}
    </div>
  );
}

export function BlockDynamicTeaserList(props: BlockTeaserListFragment) {
  const intl = useIntl();
  const { data, isLoading, error } = useOperation(TeaserListQuery, {
    locale: intl.locale as Locale,
    args: queryString.stringify(
      {
        title: props.filters?.title,
        pageSize: (props.filters?.limit || '0') as string,
      } satisfies TeaserListQueryArgs,
      { arrayFormat: 'bracket' },
    ),
  });
  console.log({
    data,
    isLoading,
    error,
  });
  return <>Placeholder for dynamic content!</>;
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
