import React from "react";
import { Link } from "react-router-dom";

export default function VerificationSent() {
  return (
    <div className="flex w-full flex-1 items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-neutral-800 text-center">
        <h2 className="mb-4 text-2xl font-bold text-neutral-800 dark:text-neutral-200">
          Check Your Email
        </h2>
        <p className="mb-6 text-neutral-600 dark:text-neutral-400">
          A verification email has been sent to your email address. Please check your inbox and click the link to verify your account.
        </p>
        <Link
          to="/login"
          className="inline-block w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}
