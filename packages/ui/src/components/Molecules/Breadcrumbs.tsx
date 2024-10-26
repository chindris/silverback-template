'use client';
import { Link, Locale } from '@custom/schema';
import {
  ChevronRightIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

import { isTruthy } from '../../utils/isTruthy';
import { truncateString } from '../../utils/stringTruncation';
import { useBreadcrumbs } from '../Routes/Menu';

// Paths that lead to the home page and should display the home icon.
const home_paths = Object.values(Locale).map((locale) => `/${locale}`);

export function BreadCrumbs() {
  const breadcrumbs = useBreadcrumbs();
  const [hideInnerBreadcrumbs, setHideInnerBreadcrumbs] = useState(false);
  const [toggleMoreBreadcrumbs, setToggleMoreBreadcrumbs] = useState(false);

  useEffect(() => {
    breadcrumbs.length > 5 &&
      toggleMoreBreadcrumbs === false &&
      setHideInnerBreadcrumbs(true);
  }, [hideInnerBreadcrumbs, breadcrumbs, toggleMoreBreadcrumbs]);

  if (!breadcrumbs.length) {
    return null;
  }

  return (
    <div className="container-page">
      <nav className="pt-5 container-content" aria-label="Breadcrumb">
        <ol
          className={
            'rounded-lg items-center overflow-x-scroll flex py-2.5 container'
          }
        >
          {breadcrumbs?.filter(isTruthy).map(({ title, target, id }, index) => (
            <>
              {hideInnerBreadcrumbs === true && index === 1 && (
                <>
                  <div aria-hidden="true">
                    <ChevronRightIcon
                      className={
                        'hidden xl:flex rotate-180 xl:rotate-0 w-4 h-4 text-gray-400 mr-4'
                      }
                    />
                  </div>
                  <button
                    className="mr-4 hidden xl:flex items-center rounded-sm px-1 py-2 bg-gray-100 hover:bg-gray-200 h-2"
                    onClick={() => {
                      setHideInnerBreadcrumbs(false);
                      setToggleMoreBreadcrumbs(true);
                    }}
                  >
                    <EllipsisHorizontalIcon className="w-4 text-gray-900" />
                  </button>
                </>
              )}
              <li
                className={clsx(
                  '',
                  index < breadcrumbs.length - 1
                    ? 'hidden xl:inline-flex xl:items-center'
                    : 'inline-flex items-center',
                )}
                key={id}
              >
                {index > 0 ? (
                  <div
                    aria-hidden="true"
                    className={clsx(
                      hideInnerBreadcrumbs === true &&
                        index > 0 &&
                        index < breadcrumbs.length - 1 &&
                        'hidden',
                    )}
                  >
                    <ChevronRightIcon
                      className={
                        'rotate-180 xl:rotate-0 w-4 h-4 text-gray-400 mr-4'
                      }
                    />
                  </div>
                ) : null}
                <Link
                  href={target}
                  title={title}
                  className={clsx(
                    'inline-flex items-center text-sm font-medium hover:text-blue-600 whitespace-nowrap',
                    index < breadcrumbs.length - 1 &&
                      hideInnerBreadcrumbs !== true
                      ? 'hidden xl:inline-flex xl:items-center'
                      : 'inline-flex items-center',
                    hideInnerBreadcrumbs === true &&
                      index > 0 &&
                      index < breadcrumbs.length - 1 &&
                      'hidden',
                  )}
                >
                  {home_paths.includes(target) && (
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
                  <span className="mr-4">
                    {truncateString({ value: title, maxChar: 25 })}
                  </span>
                </Link>
              </li>
            </>
          ))}
        </ol>
      </nav>
    </div>
  );
}
