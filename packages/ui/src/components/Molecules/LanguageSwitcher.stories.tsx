import { Url } from '@custom/schema';
import { Decorator, Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Translations, TranslationsProvider } from '../../utils/translations';
import { LanguageSwitcher } from './LanguageSwitcher';

const TranslationsDecorator = ((Story, ctx) => (
  <TranslationsProvider defaultTranslations={ctx.args}>
    <Story />
  </TranslationsProvider>
)) as Decorator<Translations>;

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
