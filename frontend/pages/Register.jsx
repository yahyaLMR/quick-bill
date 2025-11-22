import React from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-neutral-900">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-neutral-800">
        <h2 className="mb-6 text-center text-2xl font-bold text-neutral-800 dark:text-neutral-200">Register</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Full Name</label>
            <input type="text" className="mt-1 block w-full rounded-md border border-gray-300 p-2 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Email</label>
            <input type="email" className="mt-1 block w-full rounded-md border border-gray-300 p-2 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Password</label>
            <input type="password" className="mt-1 block w-full rounded-md border border-gray-300 p-2 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white" placeholder="********" />
          </div>
          <button type="submit" className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700">
            Sign Up
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
           <p className="mt-2 text-sm">
             <Link to="/" className="text-gray-500 hover:underline">Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
