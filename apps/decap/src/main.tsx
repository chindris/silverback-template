import {
  Locale,
  PreviewDecapPageQuery,
  registerExecutor,
  ViewPageQuery,
} from '@custom/schema';
import { Page } from '@custom/ui/routes/Page';
import styled from '@emotion/styled';
import CMS from 'decap-cms-app';
import { API, GitHubBackend } from 'decap-cms-backend-github';
import {
  AuthenticationPage,
  buttons,
  colors,
  colorsRaw,
  lengths,
  shadows,
  zIndex,
} from 'decap-cms-ui-default';
import { useEffect, useState } from 'react';

import css from '../node_modules/@custom/ui/build/styles.css?raw';
import { PageCollection, pageSchema } from './collections/page';
import { Translatables } from './collections/translatables';
import { createPreview } from './helpers/preview';
import { UuidWidget } from './helpers/uuid';

const LoginButton = styled.button`
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

function AuthComponent({ error, config, t, onLogin }: any) {
  const [state, setState] = useState<LoginState>('idle');
  const [email, setEmail] = useState('');

  const handleLogin = async () => {
    setState('progress');
    await fetch('http://localhost:8000/_decap/login', {
      method: 'POST',
      body: email,
    });
    setState('sent');
  };

  const handleValidate = async () => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (token) {
      setState('validating');
      const result = await fetch('http://localhost:8000/_decap/auth', {
        method: 'POST',
        body: token,
      });
      if (result.ok) {
        setState('idle');
        onLogin({ email: token.split(':')[0] });
      }
      setState('invalid');
    }
  };

  useEffect(() => {
    handleValidate();
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
              <AuthForm onSubmit={handleLogin}>
                <AuthInput
                  type="text"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {error ? <ErrorMessage>{error}</ErrorMessage> : null}
                <LoginButton disabled={state !== 'idle'}>
                  {state !== 'idle' ? t('auth.loggingIn') : t('auth.login')}
                </LoginButton>
              </AuthForm>
            </>
          )}
        </>
      )}
      t={t}
    />
  );
}

class SilverbackBackend extends GitHubBackend {
  authenticate() {
    console.log(this);
    this.api = new API({
      token: this.token,
      tokenKeyword: this.tokenKeyword,
      branch: this.branch,
      repo: this.repo,
      originRepo: this.originRepo,
      apiRoot: this.apiRoot,
      squashMerges: this.squashMerges,
      cmsLabelPrefix: this.cmsLabelPrefix,
      useOpenAuthoring: this.useOpenAuthoring,
      initialWorkflowStatus: this.options.initialWorkflowStatus,
      baseUrl: this.baseUrl,
      getUser: this.currentUser,
    });
    return Promise.resolve();
  }
  authComponent() {
    return AuthComponent;
  }
}

const locales = Object.values(Locale);
const default_locale = locales.includes('en') ? 'en' : locales[0];

CMS.registerPreviewStyle(css, { raw: true });
CMS.registerWidget('uuid', UuidWidget);
CMS.registerBackend('silverback', SilverbackBackend);

CMS.init({
  config: {
    publish_mode: 'simple',
    media_folder: 'apps/decap/media',
    backend: import.meta.env.DEV
      ? // In development, use the in-memory backend.
        {
          name: 'silverback',
          api_root: 'http://localhost:8000/_decap/api',
          repo: 'AmazeeLabs/silverback-template',
          branch: 'release',
        }
      : window.location.hostname === 'localhost'
        ? // On localhost, use the proxy backend.
          {
            name: 'github',
            api_root: 'http://localhost:8000',
            repo: 'amazeelabs/silverback-template',
            branch: 'release',
          }
        : // Otherwise, its production. Use the Git Gateway backend.
          {
            name: 'git-gateway',
            branch: 'release',
          },
    i18n: {
      structure: 'single_file',
      locales,
      default_locale,
    },
    collections: [
      {
        label: 'Settings',
        description: 'Global settings that might appear on every page.',
        name: 'settings',
        files: [
          {
            label: 'Site',
            name: 'site',
            file: 'apps/decap/data/site.yml',
            fields: [
              {
                label: 'Contact e-Mail',
                name: 'email',
                widget: 'string',
              },
            ],
          },
        ],
      },
      Translatables,
      PageCollection,
    ],
  },
});

CMS.registerPreviewTemplate(
  'page',
  createPreview(
    PreviewDecapPageQuery,
    pageSchema,
    (data) => {
      registerExecutor(ViewPageQuery, { page: data.preview });
      return <Page />;
    },
    'previewDecapPage',
  ),
);
