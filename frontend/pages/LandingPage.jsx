import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-4xl font-bold text-neutral-800 dark:text-neutral-200">Welcome to Quick Bill</h1>
      <div className="flex gap-4">
        <Link to="/login" className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Login
        </Link>
        <Link to="/register" className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700">
          Register
        </Link>
      </div>
    </div>
  );
}
