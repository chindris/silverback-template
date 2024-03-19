import { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/test';

import { Pagination as Component } from './Pagination.js';

export default {
  component: Component,
} satisfies Meta<typeof Component>;

export const Initial: StoryObj<typeof Component> = {
  args: {
    total: 82,
    pageSize: 10,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByText('1 of 9');
  },
};

export const Preselected: StoryObj<typeof Component> = {
  args: {
    total: 82,
    pageSize: 10,
  },
  parameters: {
    location: new URL('http://localhost/?page=2'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByText('2 of 9');
  },
};

export const Interactive: StoryObj<typeof Component> = {
  args: {
    total: 82,
    pageSize: 10,
  },
  parameters: {
    location: new URL('http://localhost/?page=1'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText('Next'));
    await canvas.findByText('2 of 9');
    await userEvent.click(canvas.getByText('Next'));
    await canvas.findByText('3 of 9');
    await userEvent.click(canvas.getByText('Previous'));
    await canvas.findByText('2 of 9');
  },
};
