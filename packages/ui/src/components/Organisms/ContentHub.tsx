import { useIntl } from '@amazeelabs/react-intl';
import {
  ContentHubQuery,
  ContentHubResultItemFragment,
  Image,
  Link,
  Locale,
} from '@custom/schema';
import qs from 'query-string';
import React from 'react';

import { isTruthy } from '../../utils/isTruthy';
import { useOperation } from '../../utils/operation';
import { Pagination, useCurrentPage } from '../Molecules/Pagination';
import { SearchForm, useSearchParameters } from '../Molecules/SearchForm';
import { Loading } from '../Routes/Loading';

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
            <ul className="my-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
              {data?.contentHub.items.filter(isTruthy).map((item, index) => {
                return (
                  <li key={item.path}>
                    <Card item={item} id={index} />
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

const Card = ({
  item,
  id,
}: {
  item: ContentHubResultItemFragment;
  id: number;
}) => {
  const formattedID = 'heading-' + id;

  return (
    <article
      aria-labelledby={formattedID}
      className="focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600 relative max-w-sm bg-white rounded-lg hover:shadow overflow-hidden flex flex-col-reverse"
    >
      <div className="p-5">
        <h5
          id={formattedID}
          className="mb-2 text-2xl font-bold tracking-tight text-gray-900"
        >
          {item.title}
        </h5>
        <Link
          href={item.path}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-blue-700 border border-blue-700 rounded-lg hover:bg-blue-800 hover:text-white focus:outline-offset-4 after:content-[''] after:absolute after:inset-0"
        >
          <span className="sr-only w-0 h-0 overflow-hidden">{item.title}</span>
          Read more
          <svg
            className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </Link>
      </div>
      <div className="rounded-t-lg">
        {item.teaserImage ? (
          <Image {...item.teaserImage} className="w-full" />
        ) : (
          <div className="aspect-[4/3] bg-indigo-200" />
        )}
      </div>
    </article>
  );
};
