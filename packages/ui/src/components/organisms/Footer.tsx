import { Link } from '@amazeelabs/scalars';
import { FooterFragment } from '@custom/schema';
import React from 'react';

export function Footer(props: Pick<FooterFragment, 'footerNavigation'>) {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl overflow-hidden py-20 px-6 sm:py-24 lg:px-8">
        <nav
          className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12"
          aria-label="Footer"
        >
          {props.footerNavigation.map((item) => (
            <div key={item.title} className="pb-6">
              <Link
                href={item.target}
                className="text-sm leading-6 text-gray-600 hover:text-gray-900"
              >
                {item.title}
              </Link>
            </div>
          ))}
        </nav>
        <p className="mt-10 text-center text-xs leading-5 text-gray-500">
          &copy; 2020 Your Company, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
