import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../src/lib/api";
import { toast } from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("/users/forgot-password", { email });
      setIsSubmitted(true);
      toast.success("Reset link sent!");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex w-full flex-1 items-center justify-center py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-neutral-800 text-center">
          <h2 className="mb-4 text-2xl font-bold text-neutral-800 dark:text-neutral-200">
            Check Your Email
          </h2>
          <p className="mb-6 text-neutral-600 dark:text-neutral-400">
            If an account exists for <strong>{email}</strong>, we have sent a password reset link.
          </p>
          <Link
            to="/login"
            className="inline-block w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-1 items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-neutral-800">
        <h2 className="mb-6 text-center text-2xl font-bold text-neutral-800 dark:text-neutral-200">
          Forgot Password
        </h2>
        <p className="mb-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Email Address
            </label>
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
              placeholder="you@example.com"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full rounded-md py-2 text-white ${
              isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/login" className="text-sm text-blue-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
