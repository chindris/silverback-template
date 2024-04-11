import { CurrentUserQuery } from '@custom/schema';
import { useSession } from 'next-auth/react';
import React from 'react';
import { useIntl } from 'react-intl';

import { useOperation } from '../../utils/operation';
import { Loading } from '../Molecules/Loading';
import { UserButton } from '../Molecules/UserButton';

export function UserProfile() {
  const intl = useIntl();
  const session = useSession();
  let accessToken = null;
  if (session && session.status === 'authenticated') {
    // @ts-ignore
    accessToken = session.data.user.tokens.access_token;
  }
  const { data, isLoading, error } = useOperation(
    CurrentUserQuery,
    {},
    accessToken,
  );
  return (
    <div className="bg-white py-12 px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
        <div className="mt-10">
          {error ? (
            <div className="flex items-center justify-center">
              <div className="my-8 px-3 py-1 text-xs font-medium leading-none text-center text-red-500 bg-red-100 rounded-full">
                {error}
              </div>
            </div>
          ) : null}
          {isLoading ? <Loading /> : null}
          {!isLoading && !data?.currentUser && !error && <UserButton />}
          {data?.currentUser && (
            <>
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                {data?.currentUser.name}
              </h1>
              <p className="mt-6 text-lg">
                {intl.formatMessage(
                  { defaultMessage: 'Email: {email}', id: 'uPNlBw' },
                  {
                    email: data?.currentUser.email,
                  },
                )}
              </p>
              <p className="mt-6 text-lg">
                {intl.formatMessage(
                  { defaultMessage: 'Member for {member_for}', id: 'OZlBcy' },
                  {
                    member_for: data.currentUser.memberFor,
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
