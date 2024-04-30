import { ListPagesQuery } from '@custom/schema';

import { runOperation } from '../utils/runOperation';

export default async function Page({ path }: { path: string }) {
  return (
    <div>
      <title>{path}</title>
      <h1 className="text-4xl font-bold tracking-tight">{path}</h1>
    </div>
  );
}

function isDefined<T>(value: T | undefined): value is T {
  return !!value;
}

export async function getConfig() {
  const pages = await runOperation(ListPagesQuery, {});
  const paths =
    pages.allPages
      ?.filter(isDefined)
      .map((page) => page.path.substring(1).split('/')) || [];

  return {
    render: 'static',
    staticPaths: paths,
  };
}
