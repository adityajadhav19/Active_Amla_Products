"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* 🔐 AUTO REDIRECT IF ALREADY LOGGED IN */
  useEffect(() => {
    async function checkAuth() {
      const res = await fetch("/", {
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) return;

      const user = await res.json();

      if (user.role === "ADMIN") window.location.href = "/admin/dashboard";
      else if (user.role === "TRADER") window.location.href = "/trader/dashboard";
      else window.location.href = "/user";
    }

    checkAuth();
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    // full reload so cookies are available everywhere
    window.location.href =
      data.role === "ADMIN"
        ? "/admin/dashboard"
        : data.role === "TRADER"
          ? "/trader/dashboard"
          : "/user";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 dark:from-[#0f2027] dark:via-[#203a43] dark:to-[#2c5364]">
      <div className="flex items-center justify-center px-6 py-10">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md space-y-5 border border-transparent dark:border-gray-700">

          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome Back 🌿
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Login to continue to Active Products
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-400 text-sm p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
            />
            <Link
              href="/forgot-password"
              className="text-sm text-green-600 hover:underline text-right block"
            >
              Forgot Password?
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 text-white py-2 rounded-lg font-medium hover:bg-green-800 disabled:opacity-60 transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            Don’t have an account?{" "}
            <Link
              href="/signup"
              className="text-green-700 dark:text-green-400 font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>

  );
}
