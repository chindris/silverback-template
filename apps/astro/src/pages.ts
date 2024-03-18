import { FrameQuery, registerExecutor, ViewPageQuery } from '@custom/schema';
import operations from '@custom/schema/operations';
import type { GetStaticPaths } from 'astro';

type Pages = Array<{
  translations: Array<{ path: string }>;
}>;

export const getStaticPaths: GetStaticPaths = async () => {
  // AXXX All fields are null at the moment. The resolvers are only implemented
  //  in Gatsby.
  registerExecutor(FrameQuery, await query(operations[FrameQuery]));

  let offset = 0;
  const limit = 100;
  const pages: Pages = [];

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const {
      data: { pages: fetchedPages },
    }: {
      data: { pages: Pages };
    } = await query(`
      {
        pages: _queryDrupalPages(offset: ${offset}, limit: ${limit}) {
          translations {
            ... on Page {
              locale
              path
              translations {
                locale
                path
              }
              title
              hero {
                headline
                lead
                image {
                  source(
                    width: 2000
                    sizes: [[800, 800], [1200, 200], [1600, 1600], [2000, 2000], [2800, 2800]]
                  )
                  alt
                }
              }
              content {
                __typename
                ... on BlockMarkup {
                  markup
                }
                ... on BlockMedia {
                  media {
                    __typename
                    ... on MediaImage {
                      source(width: 1536, sizes: [[768, 768], [1536, 1536]])
                      alt
                    }
                    ... on MediaVideo {
                      url
                    }
                  }
                  caption
                }
                ... on BlockForm {
                  url
                }
              }
              metaTags {
                tag
                attributes {
                  name
                  content
                  property
                  rel
                  href
                }
              }
            }
          }
        }
      }
    `);
    if (fetchedPages.length === 0) {
      break;
    }
    pages.push(...fetchedPages);
    offset += limit;
  }

  return pages.flatMap((page) =>
    page.translations.map((translation) => ({
      params: { path: translation.path },
      props: translation,
    })),
  );
};

export const storePageData = async (path: string, data: any) => {
  registerExecutor(ViewPageQuery, { pathname: path }, { page: data });
};

async function query(query: string, variables?: any): Promise<any> {
  return (
    await fetch('http://127.0.0.1:8888/graphql', {
      method: 'POST',
      headers: {
        'api-key': 'cfdb0555111c0f8924cecab028b53474',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })
  ).json();
}
