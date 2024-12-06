import React from 'react';

export function Loading() {
  return (
    <div className="flex items-center justify-center">
      <div className="my-8 animate-pulse rounded-full bg-blue-200 px-3 py-1 text-center text-xs font-medium leading-none text-blue-800 dark:bg-blue-900 dark:text-blue-200">
        loading...
      </div>
    </div>
  );
}
