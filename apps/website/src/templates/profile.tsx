import { CurrentUserQuery, OperationExecutor } from '@custom/schema';
import { UserProfile } from '@custom/ui/routes/UserProfile';
import { useSession } from 'next-auth/react';
import React from 'react';

import { drupalExecutor } from '../utils/drupal-executor';

export default function ProfilePage() {
  const session = useSession();
  let accessToken: string | undefined = undefined;
  if (session && session.status === 'authenticated') {
    // @ts-ignore
    accessToken = session.data.user.tokens.access_token;
    const authenticatedExecutor = drupalExecutor(
      `${process.env.GATSBY_DRUPAL_URL}/graphql`,
      false,
    );
    return (
      <OperationExecutor
        executor={async () => {
          const data = await authenticatedExecutor(
            CurrentUserQuery,
            {},
            accessToken,
          );
          return {
            currentUser: data.currentUser,
          };
        }}
        id={CurrentUserQuery}
      >
        <UserProfile />
      </OperationExecutor>
    );
  } else {
    return <UserProfile />;
  }
}
