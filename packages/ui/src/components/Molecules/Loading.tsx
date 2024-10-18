import React from 'react';

export function Loading() {
  return (
    <div className="flex items-center justify-center">
      <div className="my-8 px-3 py-1 text-xs font-medium leading-none text-center text-red-800 bg-red-200 rounded-full animate-pulse dark:bg-red-900 dark:text-red-200">
        loading...
      </div>
    </div>
  );
}
