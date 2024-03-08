import styled from '@emotion/styled';
import { Credentials } from 'decap-cms-lib-util';
import {
  AuthenticationPage,
  buttons,
  colors,
  colorsRaw,
  lengths,
  shadows,
  zIndex,
} from 'decap-cms-ui-default';
import { FormEvent, useEffect, useState } from 'react';

const LoginButton = styled.button`
  white-space: nowrap;
  ${buttons.button};
  ${shadows.dropDeep};
  ${buttons.default};
  ${buttons.gray};
`;

const AuthForm = styled.form`
  display: flex;
`;

const AuthInput = styled.input`
  background-color: ${colorsRaw.white};
  border-radius: ${lengths.borderRadius};
  font-size: 14px;
  padding: 10px;
  margin-right: 15px;
  width: 100%;
  position: relative;
  z-index: ${zIndex.zIndex1};

  &:focus {
    outline: none;
    box-shadow: inset 0 0 0 2px ${colors.active};
  }
`;

const ErrorMessage = styled.p`
  color: ${colors.errorText};
`;

const SuccessMessage = styled.p`
  color: ${colors.statusReadyText};
`;

type LoginState = 'idle' | 'progress' | 'sent' | 'validating' | 'invalid';

type AuthComponentProps = {
  onLogin: (credentials: Credentials) => void;
  inProgress?: boolean;
  config: any;
  t: (key: string) => string;
};

export const AuthComponent = ({
  config,
  t,
  onLogin,
  inProgress,
}: AuthComponentProps) => {
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<LoginState>('idle');
  const [email, setEmail] = useState('');

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setState('progress');
    const result = await fetch('/_decap/login', {
      method: 'POST',
      body: email,
    });
    if (!result.ok) {
      setError(await result.text());
      setState('idle');
      return;
    }
    setState('sent');
  };

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (token) {
      const [email] = token?.split(':') || [];
      setEmail(email);
      onLogin({ token });
      window.history.replaceState({}, document.title, '/admin/');
    }
  }, [state]);

  return (
    <AuthenticationPage
      logoUrl={config.logo_url}
      siteUrl={config.site_url}
      renderPageContent={() => (
        <>
          {state === 'sent' ? (
            <SuccessMessage>
              An email has been sent to {email}. Please check your inbox and
              click the link to log in.
            </SuccessMessage>
          ) : (
            <>
              {state === 'invalid' ? (
                <ErrorMessage>
                  The token is invalid. Please try again or request a new login.
                </ErrorMessage>
              ) : null}
              {error ? <ErrorMessage>{error}</ErrorMessage> : null}
              <AuthForm onSubmit={handleLogin}>
                <AuthInput
                  type="text"
                  name="email"
                  placeholder="Email"
                  value={email}
                  disabled={inProgress || state !== 'idle'}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <LoginButton disabled={state !== 'idle'}>
                  {state !== 'idle' || inProgress
                    ? t('auth.loggingIn')
                    : t('auth.login')}
                </LoginButton>
              </AuthForm>
            </>
          )}
        </>
      )}
      t={t}
    />
  );
};
