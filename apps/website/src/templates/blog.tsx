import { graphql } from '@amazeelabs/gatsby-plugin-operations';
import { OperationExecutor, useLocation, ViewPageQuery } from '@custom/schema';
import { Blog } from '@custom/ui/routes/Blog';
import { HeadProps, PageProps } from 'gatsby';
import React from 'react';

export const query = graphql(ViewPageQuery);

export function Head({ data }: HeadProps<typeof query>) {
  return data.page ? (
    <>
      <title>{data.page.title}</title>
      {data.page.metaTags?.map((metaTag, index) => {
        if (metaTag?.tag === 'meta') {
          return (
            <meta
              key={`meta-${index}`}
              name={metaTag.attributes?.name}
              property={metaTag.attributes?.property}
              content={metaTag.attributes?.content}
            />
          );
        } else if (metaTag?.tag === 'link') {
          return (
            <link
              key={`link-${index}`}
              rel={metaTag.attributes?.rel}
              href={metaTag.attributes?.href}
            />
          );
        }
        return null;
      }) || null}
    </>
  ) : null;
}

export default function BlogTemplate({ data }: PageProps<typeof query>) {
  // Retrieve the current location and prefill the
  // "ViewPageQuery" with these arguments.
  // That makes shure the `useOperation(ViewPageQuery, ...)` with this
  // path immediately returns this data.
  const [location] = useLocation();
  return (
    <OperationExecutor
      id={ViewPageQuery}
      executor={data}
      variables={{ pathname: location.pathname }}
    >
      <Blog />
    </OperationExecutor>
  );
}
