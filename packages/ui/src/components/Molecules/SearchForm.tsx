import { useLocation } from '@custom/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useIntl } from '../../utils/intl';

const formValueSchema = z.object({
  keyword: z.string().optional(),
});

export function useSearchParameters() {
  const [location] = useLocation();
  return formValueSchema.parse(
    Object.fromEntries(location.searchParams.entries() ?? ([] as any)),
  );
}

export function SearchForm() {
  const intl = useIntl();
  type FormValues = z.infer<typeof formValueSchema>;
  const { register, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(formValueSchema),
    values: useSearchParameters(),
  });
  const [location, navigate] = useLocation();
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <form
          className="mt-5 sm:flex sm:items-center"
          onSubmit={handleSubmit((values) => {
            navigate(location, { ...values, page: 1 });
          })}
        >
          <div className="w-full sm:max-w-xs">
            <label htmlFor="keyword" className="sr-only">
              {intl.formatMessage({
                defaultMessage: 'Keyword',
                id: 'fe0rMF',
              })}
            </label>
            <input
              {...register('keyword')}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder={intl.formatMessage({
                defaultMessage: 'Keyword',
                id: 'fe0rMF',
              })}
            />
          </div>
          <button
            type="submit"
            className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3 sm:mt-0 sm:w-auto"
          >
            {intl.formatMessage({ defaultMessage: 'Search', id: 'xmcVZ0' })}
          </button>
        </form>
      </div>
    </div>
  );
}
