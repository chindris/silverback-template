import { MetaTag } from '@custom/schema';
import React from 'react';

export function Head({ meta }: {meta?: Array<MetaTag | undefined>}) {
  return meta ? (
    <>
      {meta.map((metaTag, index) => {
        if (metaTag?.tag === 'meta') {
          return (
            <React.Fragment key={`meta-${index}`}>
              <meta
                name={metaTag.attributes?.name}
                property={metaTag.attributes?.property}
                content={metaTag.attributes?.content}
              />
              {metaTag.attributes?.name === 'title' ? <title>{metaTag.attributes?.content}</title> : null}
            </React.Fragment>
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
