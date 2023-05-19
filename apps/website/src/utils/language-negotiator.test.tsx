/**
 * @vitest-environment happy-dom
 */
import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it } from 'vitest';

import {
  LanguageNegotiator,
  LanguageNegotiatorContent,
} from './language-negotiator';

beforeEach(cleanup);

describe('LanguageNegotiator', () => {
  it('falls back to the default language', () => {
    render(
      <LanguageNegotiator defaultLanguage={'de'}>
        <LanguageNegotiatorContent language="en">
          English
        </LanguageNegotiatorContent>
        <LanguageNegotiatorContent language="de">
          Deutsch
        </LanguageNegotiatorContent>
      </LanguageNegotiator>,
    );
    screen.getByText('Deutsch');
    expect(() => screen.getByText('English')).toThrow();
  });

  it('it uses the language of the prefix', () => {
    window.location = { pathname: '/en/test' } as any;
    render(
      <LanguageNegotiator defaultLanguage={'de'}>
        <LanguageNegotiatorContent language="en">
          English
        </LanguageNegotiatorContent>
        <LanguageNegotiatorContent language="de">
          Deutsch
        </LanguageNegotiatorContent>
      </LanguageNegotiator>,
    );
    screen.getByText('English');
    expect(() => screen.getByText('Deutsch')).toThrow();
  });

  it('it uses the default language on unknown prefix', () => {
    window.location = { pathname: '/foobar' } as any;
    render(
      <LanguageNegotiator defaultLanguage={'de'}>
        <LanguageNegotiatorContent language="en">
          English
        </LanguageNegotiatorContent>
        <LanguageNegotiatorContent language="de">
          Deutsch
        </LanguageNegotiatorContent>
      </LanguageNegotiator>,
    );
    screen.getByText('Deutsch');
    expect(() => screen.getByText('English')).toThrow();
  });
});
