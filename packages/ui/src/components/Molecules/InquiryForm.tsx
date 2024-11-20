import { useIntl } from '@amazeelabs/react-intl';
import { CreateSubmissionMutation } from '@custom/schema';
import React from 'react';
import { useForm } from 'react-hook-form';

import { useMutation } from '../../utils/operation';
import { Messages } from './Messages';

type FormValue = {
  name: string;
  email: string;
  subject?: string;
  question: string;
};

export function InquiryForm() {
  const intl = useIntl();

  const { register, handleSubmit } = useForm<FormValue>();

  const { data, trigger, isMutating } = useMutation(CreateSubmissionMutation);
  const errorMessages =
    !isMutating &&
    data &&
    data.createWebformSubmission?.errors &&
    data.createWebformSubmission.errors.length > 0
      ? data.createWebformSubmission.errors.map((error) => {
          return error?.message || '';
        })
      : null;
  const successMessages =
    !isMutating && data && data.createWebformSubmission?.submission
      ? [
          intl.formatMessage({
            defaultMessage: 'The inquiry has been submitted.',
            id: 'SEJ9ng',
          }),
        ]
      : null;

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        {errorMessages ? <Messages messages={errorMessages} /> : null}
        {successMessages ? <Messages messages={successMessages} /> : null}
        <form
          className="mt-5 sm:items-center"
          onSubmit={handleSubmit((values) => {
            trigger({
              webformId: 'inquiry',
              submittedData: JSON.stringify(values),
            });
          })}
        >
          <div className="w-full sm:max-w-sm">
            <label htmlFor="name" className="sr-only">
              {intl.formatMessage({
                defaultMessage: 'Name',
                id: 'HAlOn1',
              })}
            </label>
            <input
              {...register('name', { required: true })}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder={intl.formatMessage({
                defaultMessage: 'Name',
                id: 'HAlOn1',
              })}
            />
          </div>
          <div className="w-full sm:max-w-sm pt-2">
            <label htmlFor="email" className="sr-only">
              {intl.formatMessage({
                defaultMessage: 'Email',
                id: 'sy+pv5',
              })}
            </label>
            <input
              {...register('email', { required: true })}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder={intl.formatMessage({
                defaultMessage: 'Email',
                id: 'sy+pv5',
              })}
            />
          </div>
          <div className="w-full sm:max-w-sm pt-2">
            <label htmlFor="subject" className="sr-only">
              {intl.formatMessage({
                defaultMessage: 'Subject',
                id: 'LLtKhp',
              })}
            </label>
            <input
              {...register('subject')}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder={intl.formatMessage({
                defaultMessage: 'Subject',
                id: 'LLtKhp',
              })}
            />
          </div>
          <div className="w-full sm:max-w-sm pt-2">
            <label htmlFor="question" className="sr-only">
              {intl.formatMessage({
                defaultMessage: 'Message',
                id: 'T7Ry38',
              })}
            </label>
            <textarea
              {...register('question', { required: true })}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder={intl.formatMessage({
                defaultMessage: 'Question',
                id: 'kgOBET',
              })}
            />
          </div>
          <div className="w-full pt-2">
            <button
              type="submit"
              disabled={isMutating}
              className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3 sm:mt-0 sm:w-auto"
            >
              {isMutating
                ? intl.formatMessage({
                    defaultMessage: 'Sending...',
                    id: '82Y7Sa',
                  })
                : intl.formatMessage({
                    defaultMessage: 'Submit',
                    id: 'wSZR47',
                  })}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
