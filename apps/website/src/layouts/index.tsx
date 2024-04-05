import { graphql, useStaticQuery } from '@amazeelabs/gatsby-plugin-operations';
import { FrameQuery, registerExecutor } from '@custom/schema';
import { Frame } from '@custom/ui/routes/Frame';
import { signIn, signOut, useSession } from 'next-auth/react';
import React, { PropsWithChildren } from 'react';

import { authConfig } from '../../nextauth.config';

export default function Layout({
  children,
}: PropsWithChildren<{
  locale: string;
}>) {
  const session = useSession();
  const data = useStaticQuery(graphql(FrameQuery));
  registerExecutor(FrameQuery, data);

  console.log('session', session);

  // @todo move signin/signout to a specific component.
  return (
    <>
      {authConfig.providers && (
        <header>
          <div>
            <p>
              {session?.status !== 'authenticated' && (
                <>
                  <span>You are not signed in</span>
                  <a
                    href="/api/auth/signin"
                    onClick={(e) => {
                      e.preventDefault();
                      signIn();
                    }}
                  >
                    Sign in
                  </a>
                </>
              )}
              {session?.status === 'authenticated' && session.data.user && (
                <>
                  <span>
                    <small>Signed in as</small>
                    <br />
                    <strong>{session.data.user.email} </strong>
                    {session.data.user.name
                      ? `(${session.data.user.name})`
                      : null}
                  </span>
                  <a
                    href="/api/auth/signout"
                    onClick={(e) => {
                      e.preventDefault();
                      signOut();
                    }}
                  >
                    Sign out
                  </a>
                </>
              )}
            </p>
          </div>
        </header>
      )}
      <Frame>{children}</Frame>
    </>
  );
}
