import { Link } from '@custom/schema';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import React from 'react';

import { isTruthy } from '../../utils/isTruthy';
import { useBreadcrumbs } from '../Routes/Menu';

export default function BreadCrumbs({
  bgCol = 'gray-50',
  className,
}: {
  bgCol?: string;
  className?: string;
}) {
  const breadcrumbs = useBreadcrumbs();

  console.log('breadcrumbs:', breadcrumbs);

  if (!breadcrumbs.length) {
    console.log('breadcrumbs null:');
    return null;
  }

  return (
    <nav
      className={clsx('pt-5 max-w-screen-xl mx-auto', className)}
      aria-label="Breadcrumb"
    >
      <ol className={clsx('rounded-lg inline-block p-2.5', `bg-${bgCol}`)}>
        {breadcrumbs?.filter(isTruthy).map(({ title, target, id }, index) => (
          <li className="inline-flex items-center" key={id}>
            {index > 0 ? (
              <div aria-hidden="true">
                <ChevronRightIcon className={'w-3 h-3 text-gray-400 mx-1'} />
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
                  className="w-3 h-3 mx-1 mr-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                </svg>
              )}
              {title}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
