import { GatsbySSR } from 'gatsby';
import React from 'react';

export const onRenderBody: GatsbySSR['onRenderBody'] = ({
  setHeadComponents,
}) => {
  if (process.env.CLOUDINARY_CLOUDNAME === 'demo') {
    setHeadComponents([
      <script key="cloudinary-worker" src="/mock-cloudinary-register.js" />,
    ]);
  }
};
