"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordClient() {
  const token = useSearchParams().get("token");
  const [password, setPassword] = useState("");

  async function reset() {
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    if (res.ok) {
      alert("Password updated!");
      window.location.href = "/login";
    } else {
      alert("Invalid or expired link");
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />
      <button onClick={reset} className="bg-green-600 text-white px-4 py-2 rounded">
        Reset Password
      </button>
    </div>
  );
}
