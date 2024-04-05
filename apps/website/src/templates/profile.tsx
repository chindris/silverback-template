import { UserProfile } from '@custom/ui/routes/UserProfile';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

export async function getCurrentUser(accessToken: string): Promise<any> {
  const host = process.env.GATSBY_DRUPAL_URL || 'http://127.0.0.1:8888';
  const endpoint = `${host}/graphql`;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };
  const graphqlQuery = {
    query: `
      query CurrentUser {
        currentUser {
          id
          name
          email
          memberFor
        }
      }
    `,
    variables: {},
  };
  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify(graphqlQuery),
  };
  return await fetch(endpoint, options);
}

export default function ProfilePage() {
  const session = useSession();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (session && session.status === 'authenticated') {
      // @ts-ignore
      const accessToken = session.data.user.tokens.access_token;
      getCurrentUser(accessToken)
        .then((response) => response.json())
        .then((result) => {
          setUser(result.data.currentUser);
          return result;
        })
        .catch((error) => setError(error));
    }
  }, [session]);
  return <UserProfile user={user} error={error} />;
}
