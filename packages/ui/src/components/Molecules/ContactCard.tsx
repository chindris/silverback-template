import { ContactFragment, Image } from '@custom/schema';
import { EnvelopeIcon, PhoneIcon, UserIcon } from '@heroicons/react/20/solid';
import React from 'react';

import { useIntl } from '../../utils/intl';

export function ContactCard(contact: ContactFragment) {
  const intl = useIntl();
  return (
    <li
      key={contact.email}
      className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
    >
      <div className="flex flex-1 flex-col p-8">
        {contact.portrait ? (
          <Image
            className="mx-auto h-32 w-32 flex-shrink-0 rounded-full"
            source={contact.portrait}
            alt={contact.name}
          />
        ) : (
          <UserIcon className="mx-auto h-32 w-32 flex-shrink-0 rounded-full bg-gray-200 text-gray-600" />
        )}
        <h3 className="mt-6 text-sm font-medium text-gray-900">
          {contact.name}
        </h3>
        <dl className="mt-1 flex flex-grow flex-col justify-between">
          <dt className="sr-only">
            {intl.formatMessage({ defaultMessage: 'Role', id: '1ZgrhW' })}
          </dt>
          <dd className="mt-3">
            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              {contact.role}
            </span>
          </dd>
        </dl>
      </div>
      <div>
        <div className="-mt-px flex divide-x divide-gray-200">
          <div className="flex w-0 flex-1">
            <a
              href={`mailto:${contact.email}`}
              className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
            >
              <EnvelopeIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              {intl.formatMessage({ defaultMessage: 'E-Mail', id: 'HEfhYI' })}
            </a>
          </div>
          <div className="-ml-px flex w-0 flex-1">
            {contact.phone ? (
              <a
                href={`tel:${contact.phone}`}
                className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
              >
                <PhoneIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                {intl.formatMessage({ defaultMessage: 'Call', id: 'f+GKc4' })}
              </a>
            ) : (
              <span className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold  text-gray-200">
                <PhoneIcon className="h-5 w-5" aria-hidden="true" />

                {intl.formatMessage({ defaultMessage: 'Call', id: 'f+GKc4' })}
              </span>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
