"use client";

import { useEffect, useState } from "react";

type Order = {
  id: number;
  orderCode: string;
  status: string;
  createdAt: string;
};

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchProfile() {
    const res = await fetch("/api/traders/profile", {
      credentials: "include",
    });
    const data = await res.json();
    setProfile(data);
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/traders/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldPassword, newPassword }),
      credentials: "include",
    });

    if (res.ok) {
      alert("Password changed. Please login again.");
      window.location.href = "/login";
    } else {
      alert("Failed to change password");
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="space-y-8">

      {/* ACCOUNT INFO */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Account Info</h3>
        <p>Name: {profile.name}</p>
        <p>Email: {profile.email}</p>
        <p>Role: {profile.role}</p>
      </div>

      {/* CHANGE PASSWORD */}
      <form
        onSubmit={changePassword}
        className="bg-white p-4 rounded shadow space-y-3 max-w-md"
      >
        <h3 className="font-semibold">Change Password</h3>

        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />

        <button
          disabled={loading}
          className="bg-green-700 text-white px-4 py-2 rounded"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>

      {/* ORDER HISTORY */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Order History</h3>

        {profile.traderOrders.length === 0 && (
          <p className="text-sm text-gray-500">
            No orders yet.
          </p>
        )}

        <ul className="space-y-2">
          {profile.traderOrders.map((order: Order) => (
            <li
              key={order.id}
              className="border p-2 rounded text-sm"
            >
              <div className="flex justify-between">
                <span>#{order.orderCode}</span>
                <span>{order.status}</span>
              </div>
              <p className="text-xs text-gray-500">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
