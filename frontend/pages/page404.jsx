import React from 'react';
import { Link } from 'react-router-dom';
import { IconError404 } from '@tabler/icons-react';

export default function Page404() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <IconError404 className="mx-auto h-32 w-32 text-blue-600 dark:text-blue-500 opacity-80" />
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-4 text-lg text-neutral-500 dark:text-neutral-400">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}
