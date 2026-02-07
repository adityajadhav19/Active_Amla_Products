"use client";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    alert("If email exists, reset link sent.");
  }

  return (
    <form onSubmit={submit} className="max-w-md mx-auto p-6 space-y-4">
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border px-3 py-2 rounded"
        required
      />
      <button className="bg-green-600 text-white px-4 py-2 rounded">
        Send Reset Link
      </button>
    </form>
  );
}
