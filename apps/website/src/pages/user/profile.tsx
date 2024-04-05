import { useSession } from 'next-auth/react';
import React from 'react';

// @todo make a profile page.
export default function Index() {
  //registerExecutor(NotFoundPageQuery, {}, data);
  const session = useSession();
  if (
    session.status !== 'authenticated' ||
    // @ts-ignore
    !session.data?.user?.tokens.access_token
  ) {
    return <div>Not authenticated</div>;
  } else {
    // @ts-ignore
    const accessToken = session.data.user.tokens.access_token;
    // @todo use proxy.
    const AUTH_DRUPAL_URL =
      process.env.AUTH_DRUPAL_URL || 'http://127.0.0.1:8888';
    const endpoint = `${AUTH_DRUPAL_URL}/graphql`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };
    const graphqlQuery = {
      //operationName: 'CurrentUser',
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
    fetch(endpoint, options)
      .then((res) => res.json())
      .then((result) => console.log(result))
      .catch((error) => console.error('Error:', error));

    return <div>Authenticated</div>;
  }
}
