import React from 'react';
import { Link } from 'react-router-dom';

export default function Pricing() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-4xl font-extrabold text-neutral-900 dark:text-white sm:text-5xl mb-4">
        Coming Soon
      </h1>
      <p className="text-xl text-neutral-500 dark:text-neutral-400 max-w-2xl mb-8">
        We are working hard to bring you the best pricing plans. Stay tuned!
      </p>
      <Link
        to="/"
        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
