"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data?.error || "Login failed");
      setLoading(false);
      return;
    }

    if (data?.role === "ADMIN") window.location.href = "/admin/dashboard";
    else if (data?.role === "TRADER") window.location.href = "/trader/dashboard";
    else window.location.href = "/user";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">

     

      {/* 🔐 LOGIN FORM */}
      <div className="flex items-center justify-center px-6 py-10">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-5">

          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome Back 🌿
            </h1>
            <p className="text-sm text-gray-600">
              Login to continue to Active Products
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 text-white py-2 rounded-lg font-medium hover:bg-green-800 transition disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-600">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-green-700 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
