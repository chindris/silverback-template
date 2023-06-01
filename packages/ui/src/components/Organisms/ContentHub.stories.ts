import {
  ContentHubQuery,
  ContentHubResultItemFragment,
  Url,
} from '@custom/schema';
import { Meta, StoryObj } from '@storybook/react';
import { rest } from 'msw';

import { image } from '../../helpers/image';
import { ContentHub } from './ContentHub';

export default {
  component: ContentHub,
} satisfies Meta<typeof ContentHub>;

export const Empty = {
  parameters: {
    msw: {
      handlers: {
        contentHub: [
          rest.get('/graphql', (req, res, ctx) => {
            const result: ContentHubQuery = {
              contentHub: {
                total: 0,
                items: [],
              },
            };
            return res(ctx.json({ data: result }));
          }),
        ],
      },
    },
  },
} satisfies StoryObj<typeof ContentHub>;

export const WithResults = {
  args: {
    pageSize: 6,
  },
  parameters: {
    msw: {
      handlers: {
        contentHub: [
          rest.get('/graphql', (req, res, ctx) => {
            const items = [...Array(82).keys()].map(
              (i) =>
                ({
                  path: `/item/${i + 1}` as Url,
                  title: `${i % 3 === 2 ? 'Article' : 'Story'} #${i + 1}`,
                  teaserImage:
                    i % 3 === 1
                      ? undefined
                      : {
                          alt: `Image for item #${i + 1}`,
                          source: image(
                            {
                              src:
                                i % 2 === 0
                                  ? '/landscape.jpg'
                                  : '/portrait.jpg',
                              width: 1000,
                              height: 1000,
                            },
                            {
                              width: 400,
                              height: 300,
                            },
                          ),
                        },
                } satisfies ContentHubResultItemFragment),
            );
            const vars = JSON.parse(
              req.url.searchParams.get('variables') || '{}',
            );
            const filtered = items.filter(
              (item) => !vars.query || item.title.includes(vars.query),
            );
            const result: ContentHubQuery = {
              contentHub: {
                total: filtered.length,
                items: filtered.slice(
                  vars.pagination.offset,
                  vars.pagination.offset + vars.pagination.limit,
                ),
              },
            };
            return res(ctx.json({ data: result }));
          }),
        ],
      },
    },
  },
} satisfies StoryObj<typeof ContentHub>;
