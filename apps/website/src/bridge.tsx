import { Link as GatsbyLink, navigate as gatsbyNavigate } from 'gatsby';
import React, { AnchorHTMLAttributes, DetailedHTMLProps } from 'react';

export function Link({
  href,
  ...props
}: DetailedHTMLProps<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>) {
  // @ts-ignore
  return <GatsbyLink to={href || '/'} {...props} />;
}

export function navigate(to: string) {
  return gatsbyNavigate(to);
}
