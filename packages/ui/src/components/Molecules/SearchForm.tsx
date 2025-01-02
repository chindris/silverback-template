import { useIntl } from '@amazeelabs/react-intl';
import { useLocation } from '@custom/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formValueSchema = z.object({
  keyword: z.string().optional(),
  terms: z.string().optional(),
});

export function useSearchParameters() {
  const [location] = useLocation();
  return formValueSchema.parse(
    Object.fromEntries(location.searchParams.entries() ?? []),
  );
}

/** Create a key for a term. */
export function createKeyForTerm(term: string) {
  return term.toLowerCase().replace(/[^a-z0-9]/g, '_');
}

export function SearchForm(props: { termOptions?: string[] }) {
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
          {props.termOptions && props.termOptions.length > 0 ? (
            <div className="mb-2 mr-2 w-full sm:max-w-xs">
              <label htmlFor="terms" className="sr-only">
                {intl.formatMessage({
                  defaultMessage: 'Filter by terms',
                  id: 'EqfeAF',
                })}
              </label>
              <select
                id="terms"
                {...register('terms')}
                defaultValue={'default'}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              >
                <option key="default" value="">
                  {intl.formatMessage({
                    defaultMessage: 'Filter by terms',
                    id: 'EqfeAF',
                  })}
                </option>
                {props.termOptions.map((term) => (
                  <option key={term} value={createKeyForTerm(term)}>
                    {term}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          <div className="mb-2 mr-2 w-full sm:max-w-xs">
            <label htmlFor="keyword" className="sr-only">
              {intl.formatMessage({
                defaultMessage: 'Keyword',
                id: 'fe0rMF',
              })}
            </label>
            <input
              {...register('keyword')}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 shadow-sm focus-within:border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder={intl.formatMessage({
                defaultMessage: 'Keyword',
                id: 'fe0rMF',
              })}
            />
          </div>
          <button
            type="submit"
            className="mb-2 rounded-lg bg-indigo-600 px-5 py-3 text-center text-sm font-medium text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:w-fit dark:bg-indigo-600 dark:hover:bg-indigo-600 dark:focus:ring-indigo-600"
          >
            {intl.formatMessage({ defaultMessage: 'Search', id: 'xmcVZ0' })}
          </button>
        </form>
      </div>
    </div>
  );
}
