import React from "react";
import { useState } from "react";
import api from "../src/lib/api";
import { Link } from "react-router-dom";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      name: fullName,
      email: email,
      password: password,
      phone: phone,
    };
    
    try {
      // Call register API
      const response = await api.post("/users/register", formData);
      console.log("Registration successful:", response.data);
      // Optionally, redirect to login page or show success message
    } catch (error) {
      console.error("There was an error registering!", error);
    }
  };

  return (
    <div className="flex w-full flex-1 items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-neutral-800">
        <h2 className="mb-6 text-center text-2xl font-bold text-neutral-800 dark:text-neutral-200">
          Register
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Full Name
            </label>
            <input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              type="text"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Email
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
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Password
            </label>
            <input
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
              placeholder="********"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Phone Number
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="text"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
              placeholder="123-456-7890"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
          <p className="mt-2 text-sm">
            <Link to="/" className="text-gray-500 hover:underline">
              Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
