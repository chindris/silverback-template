import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { UserProfile } from './UserProfile';

export default {
  component: UserProfile,
} satisfies Meta<typeof UserProfile>;

export const AuthenticatedUser = {
  render: (args) => {
    return <UserProfile user={args.user} error={args.error} />;
  },
  args: {
    user: {
      id: '1',
      email: 'test@example.com',
      name: 'Jane Doe',
      memberFor: '1 year',
    },
    error: null,
  },
} satisfies StoryObj<typeof UserProfile>;

export const AnonymousUser = {
  render: (args) => {
    return <UserProfile user={args.user} error={args.error} />;
  },
  args: {
    user: null,
    error: null,
  },
} satisfies StoryObj<typeof UserProfile>;

export const AuthenticationError = {
  render: (args) => {
    return <UserProfile user={args.user} error={args.error} />;
  },
  args: {
    user: null,
    error: 'Authentication error',
  },
} satisfies StoryObj<typeof UserProfile>;
