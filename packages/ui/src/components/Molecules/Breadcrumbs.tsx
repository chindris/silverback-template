import { Link } from '@custom/schema';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import React from 'react';

import { isTruthy } from '../../utils/isTruthy';
import { useBreadcrumbs } from '../Routes/Menu';

export function BreadCrumbs({ className }: { className?: string }) {
  const breadcrumbs = useBreadcrumbs();

  if (!breadcrumbs.length) {
    return null;
  }

  return (
    <nav className={clsx('pt-5', className)} aria-label="Breadcrumb">
      <ol className={'rounded-lg inline-block py-2.5'}>
        {breadcrumbs?.filter(isTruthy).map(({ title, target, id }, index) => (
          <li className="inline-flex items-center" key={id}>
            {index > 0 ? (
              <div aria-hidden="true">
                <ChevronRightIcon className={'w-4 h-4 text-gray-400 mr-4'} />
              </div>
            ) : null}
            <Link
              href={target}
              title={title}
              className={clsx(
                'inline-flex items-center text-sm font-medium hover:text-blue-600',
                index === breadcrumbs?.length - 1
                  ? 'pointer-events-none text-gray-500'
                  : 'text-gray-700',
              )}
            >
              {target === '/' && (
                <svg
                  className="w-4 h-4 mr-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                </svg>
              )}
              <span className="mr-4">{title}</span>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
