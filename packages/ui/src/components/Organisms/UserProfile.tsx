import React from 'react';
import { useIntl } from 'react-intl';

import { UserButton } from '../Molecules/UserButton';

export function UserProfile(props: any) {
  const intl = useIntl();
  return (
    <div className="bg-white py-12 px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
        <div className="mt-10">
          {props.error && <p className="text-red-500">{props.error}</p>}
          {!props.user && !props.error && <UserButton />}
          {props.user && (
            <>
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                {props.user.name}
              </h1>
              <p className="mt-6 text-lg">
                {intl.formatMessage(
                  { defaultMessage: 'Email: {email}', id: 'uPNlBw' },
                  {
                    email: props.user.email,
                  },
                )}
              </p>
              <p className="mt-6 text-lg">
                {intl.formatMessage(
                  { defaultMessage: 'Member for {member_for}', id: 'OZlBcy' },
                  {
                    member_for: props.user.memberFor,
                  },
                )}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
