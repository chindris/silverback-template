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
          path
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
    })),
  );
};

export const fetchPageData = async (path: string) => {
  const res = await query(operations[ViewPageQuery], { pathname: path });
  console.log('axxx res', res); // AXXX
  registerExecutor(ViewPageQuery, { pathname: path }, res.data);
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
