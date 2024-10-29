import { useIntl } from '@amazeelabs/react-intl';
import { ContentHubQuery, Locale } from '@custom/schema';
import qs from 'query-string';
import React from 'react';

import { isTruthy } from '../../utils/isTruthy';
import { useOperation } from '../../utils/operation';
import { Pagination, useCurrentPage } from '../Molecules/Pagination';
import { SearchForm, useSearchParameters } from '../Molecules/SearchForm';
import { Loading } from '../Routes/Loading';
import { CardItem } from './Card';

export type ContentHubQueryArgs = {
  title: string | undefined;
  page: string | undefined;
  pageSize: string | undefined;
};

export function ContentHub({ pageSize = 10 }: { pageSize: number }) {
  const intl = useIntl();
  const page = useCurrentPage();
  const search = useSearchParameters();
  const { data, isLoading, error } = useOperation(ContentHubQuery, {
    locale: intl.locale as Locale,
    args: qs.stringify(
      {
        title: search.keyword,
        page: `${page}`,
        pageSize: `${pageSize}`,
      } satisfies ContentHubQueryArgs,
      { arrayFormat: 'bracket' },
    ),
  });
  return (
    <div className="bg-white py-12 px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SearchForm />
        {error ? (
          <div className="flex items-center justify-center">
            <div className="my-8 px-3 py-1 text-xs font-medium leading-none text-center text-red-500 bg-red-100 rounded-full">
              {error}
            </div>
          </div>
        ) : null}
        {isLoading ? <Loading /> : null}
        {data?.contentHub.total === 0 ? (
          <div className="my-8">
            {intl.formatMessage({ defaultMessage: 'No results', id: 'jHJmjf' })}
          </div>
        ) : null}
        {data?.contentHub.total ? (
          <>
            <ul className="my-8 grid gap-4 lg:gap-8 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr grid-rows-subgrid">
              {data?.contentHub.items.filter(isTruthy).map((item) => {
                return (
                  <li key={item.path} className="grid grid-rows-subgrid">
                    <CardItem {...item} />
                  </li>
                );
              })}
            </ul>
            <Pagination pageSize={pageSize} total={data.contentHub.total} />
          </>
        ) : null}
      </div>
    </div>
  );
}
