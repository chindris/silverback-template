import { FrameQuery, registerExecutor, Url } from '@custom/schema';
import { Decorator, Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Translations, TranslationsProvider } from '../../utils/translations';
import { Default } from '../Routes/Frame.stories';
import { LanguageSwitcher } from './LanguageSwitcher';

const TranslationsDecorator = ((Story, ctx) => {
  registerExecutor(FrameQuery, {
    ...Default.args,
    websiteSettings: {
      homePage: {
        translations: [
          { locale: 'en', path: '/en/home' as Url },
          { locale: 'de', path: '/de/home' as Url },
        ],
      },
    },
  });
  return (
    <TranslationsProvider defaultTranslations={ctx.args}>
      <Story />
    </TranslationsProvider>
  );
}) as Decorator<Translations>;

export default {
  component: LanguageSwitcher,
  decorators: [TranslationsDecorator],
  parameters: {
    location: new URL('local:/en/english-version'),
  },
} satisfies Meta<Translations>;

type Story = StoryObj<Translations>;

export const Empty = {} satisfies Story;

export const Partial = {
  args: {
    en: '/en/english-version' as Url,
  },
} satisfies Story;

export const Full = {
  args: {
    de: '/de/german-version' as Url,
    en: '/en/english-version' as Url,
  },
} satisfies Story;

export const Homepage = {
  args: {
    de: '/de/home' as Url,
    en: '/en/home' as Url,
  },
  parameters: {
    location: new URL('local:/de'),
  },
} satisfies Story;
