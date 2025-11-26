import React from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
        email,
        password,
      };
    // Add your form submission logic here
    try {
      const response = await axios.post("http://localhost:5000/api/users/login", formData);
      console.log("Login successful:", response.data);
      localStorage.setItem("token", response.data.token);
      // Optionally, redirect to dashboard or show success message
      navigate("/profile");
    } catch (error) {
      console.error("There was an error logging in!", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-neutral-900">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-neutral-800">
        <h2 className="mb-6 text-center text-2xl font-bold text-neutral-800 dark:text-neutral-200">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700"
          >
            Sign In
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register
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
