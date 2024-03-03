import { ContentHubQuery, Image, Link, Locale } from '@custom/schema';
import React from 'react';
import { useIntl } from 'react-intl';

import { isTruthy } from '../../utils/isTruthy';
import { useOperation } from '../../utils/operation';
import { Pagination, useCurrentPage } from '../Molecules/Pagination';
import { SearchForm, useSearchParameters } from '../Molecules/SearchForm';
import { Loading } from '../Routes/Loading';

export function ContentHub({ pageSize = 10 }: { pageSize: number }) {
  const intl = useIntl();
  const currentPage = useCurrentPage();
  const search = useSearchParameters();
  const { data, isLoading, error } = useOperation(ContentHubQuery, {
    query: search.keyword,
    pagination: {
      limit: pageSize,
      offset: currentPage * pageSize - pageSize,
    },
    locale: intl.locale as Locale,
  });
  return (
    <div className="mx-auto max-w-6xl">
      <SearchForm />
      {error ? (
        <p className="text-red-500 italic text-center my-8">{error}</p>
      ) : null}
      {isLoading ? <Loading /> : null}
      {data?.contentHub.total === 0 ? (
        <div className="my-8">
          {intl.formatMessage({ defaultMessage: 'No results', id: 'jHJmjf' })}
        </div>
      ) : null}
      {data?.contentHub.total ? (
        <>
          <ul className="my-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
            {data?.contentHub.items.filter(isTruthy).map((item) => (
              <li key={item.path}>
                <Link href={item.path}>
                  {item.teaserImage ? (
                    <Image {...item.teaserImage} className="w-full" />
                  ) : (
                    <div className="aspect-[4/3] bg-indigo-200" />
                  )}
                  <div className="mt-2 font-bold">{item.title}</div>
                </Link>
              </li>
            ))}
          </ul>
          <Pagination pageSize={pageSize} total={data.contentHub.total} />
        </>
      ) : null}
    </div>
  );
}
