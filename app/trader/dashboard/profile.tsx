"use client";

import { useEffect, useState } from "react";
import { fetchWithCSRF } from "@/lib/fetchWithCSRF";

/* ---------- TYPES ---------- */

type TraderProfile = {
  name: string;
  email: string;
  role: "TRADER" | "ADMIN" | "USER";
};

type Order = {
  id: number;
  orderCode: string;
  status: string;
  totalAmount?: number;
};

type AddressForm = {
  addressLine1: string;
  addressLine2: string;
  mapLink: string;
  city: string;
  state: string;
  pincode: string;
};

export default function Profile() {
  const [profile, setProfile] = useState<TraderProfile | null>(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);

  const [form, setForm] = useState<AddressForm>({
    addressLine1: "",
    addressLine2: "",
    mapLink: "",
    city: "",
    state: "",
    pincode: "",
  });


  /* ---------- FETCH ORDERS ---------- */
  async function fetchOrders() {
    try {
      const res = await fetch("/api/traders/orders", {
        credentials: "include",
      });

      if (!res.ok) {
        console.error("FETCH_ORDERS_FAILED:", res.status);
        setOrders([]);
        return;
      }

      const text = await res.text();
      if (!text) {
        setOrders([]);
        return;
      }

      const data = JSON.parse(text);
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("FETCH_ORDERS_ERROR:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <p className="text-center py-6">Loading orders…</p>;
  }

  if (orders.length === 0) {
    return (
      <p className="text-center text-gray-500">
        No orders found.
      </p>
    );
  }


  /* ---------- FETCH PROFILE ---------- */

  async function fetchProfile() {
    try {
      const res = await fetch("/api/traders/profile", {
        credentials: "include",
      });

      if (!res.ok) {
        console.error("FETCH_PROFILE_FAILED:", res.status);
        return;
      }

      const data: TraderProfile = await res.json();
      setProfile(data);
    } catch (err) {
      console.error("FETCH_PROFILE_ERROR:", err);
    }
  }

  /* ---------- SAVE ADDRESS ---------- */

  async function saveProfile() {
    await fetchWithCSRF("/api/traders/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });

    alert("Profile updated");
  }

  /* ---------- CHANGE PASSWORD ---------- */
  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    const res = await fetchWithCSRF("/api/traders/change-password", {
      method: "POST",
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Failed to change password");
      setLoading(false);
      return;
    }

    alert("Password changed. Please login again.");
    window.location.href = "/login";
  }


  useEffect(() => {
    fetchProfile();
  }, []);

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="space-y-8">

      {/* ACCOUNT INFO */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded shadow border border-gray-200 dark:border-gray-800">
        <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Account Info</h3>
        <p className="text-gray-700 dark:text-gray-300">Name: {profile.name}</p>
        <p className="text-gray-700 dark:text-gray-300">Email: {profile.email}</p>
        <p className="text-gray-700 dark:text-gray-300">Role: {profile.role}</p>
      </div>

      {/* CHANGE PASSWORD */}
      <form
        onSubmit={changePassword}
        className="bg-white dark:bg-gray-900 p-4 rounded shadow space-y-3 max-w-md border border-gray-200 dark:border-gray-800"
      >
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Change Password</h3>

        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
          className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}


        <button
          disabled={loading}
          className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>

      {/* SHOP ADDRESS */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded shadow space-y-3 max-w-md border border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Shop Address</h2>

        {(Object.keys(form) as (keyof AddressForm)[]).map((key) => (
          <input
            key={key}
            placeholder={key}
            value={form[key]}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, [key]: e.target.value }))
            }
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        ))}

        <button
          onClick={saveProfile}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </div>

      {/* ORDER HISTORY */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded shadow border border-gray-200 dark:border-gray-800">
        <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Order History</h3>
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white dark:bg-gray-900 p-4 rounded shadow border border-gray-200 dark:border-gray-800"
          >
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              Order #{order.orderCode}
            </p>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              Status: {order.status}
            </p>

            {order.totalAmount && (
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                Amount: ₹{order.totalAmount}
              </p>
            )}
          </div>
        ))}

      </div>

    </div>

  );
}
