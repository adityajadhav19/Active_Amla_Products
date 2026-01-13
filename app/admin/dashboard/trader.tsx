"use client";

import { useEffect, useState } from "react";

type Trader = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  isActive: boolean;
};

export default function Trader() {
  const [showForm, setShowForm] = useState(false);
  const [traders, setTraders] = useState<Trader[]>([]);
  const [loading, setLoading] = useState(false);

  // create form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // edit state ✅
  const [editingTrader, setEditingTrader] = useState<Trader | null>(null);

  /* ---------------- FETCH TRADERS ---------------- */

  async function fetchTraders() {
    const res = await fetch("/api/admin/trader");
    const data = await res.json();
    setTraders(data);
  }

  useEffect(() => {
    fetchTraders();
  }, []);

  /* ---------------- CREATE TRADER ---------------- */

  async function handleCreateTrader(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await fetch("/api/admin/trader/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, password }),
    });

    setLoading(false);
    setShowForm(false);
    setName("");
    setEmail("");
    setPhone("");
    setPassword("");

    fetchTraders();
  }

  /* ---------------- UPDATE TRADER ---------------- */

  async function handleUpdateTrader(e: React.FormEvent) {
    e.preventDefault();
    if (!editingTrader) return;

    await fetch(`/api/admin/trader/${editingTrader.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editingTrader.name,
        email: editingTrader.email,
        phone: editingTrader.phone,
      }),
    });

    setEditingTrader(null);
    fetchTraders();
  }

  /* ---------------- ENABLE / DISABLE ---------------- */

  async function toggleStatus(id: number, isActive: boolean) {
    await fetch(`/api/admin/trader/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    });

    fetchTraders();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Traders</h2>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-700 text-white px-4 py-2 rounded"
        >
          + Add Trader
        </button>
      </div>

      {/* Add Trader Form */}
      {showForm && (
        <form
          onSubmit={handleCreateTrader}
          className="bg-white p-4 rounded-lg shadow space-y-3 max-w-md"
        >
          <input
            placeholder="Trader Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />

          <input
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />

          <input
            placeholder="Temporary Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-700 text-white px-4 py-2 rounded"
            >
              {loading ? "Creating..." : "Create"}
            </button>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Trader Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {traders.map((trader) => (
          <div
            key={trader.id}
            className="bg-white p-4 rounded-lg shadow space-y-2"
          >
            <h3 className="font-semibold">{trader.name}</h3>
            <p className="text-sm text-gray-600">{trader.email}</p>
            {trader.phone && (
              <p className="text-sm text-gray-600">{trader.phone}</p>
            )}

            <span
              className={`inline-block text-xs px-2 py-1 rounded ${
                trader.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {trader.isActive ? "Active" : "Disabled"}
            </span>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setEditingTrader(trader)}
                className="border px-3 py-1 rounded text-sm"
              >
                Edit
              </button>

              <button
                onClick={() =>
                  toggleStatus(trader.id, !trader.isActive)
                }
                className="border px-3 py-1 rounded text-sm"
              >
                {trader.isActive ? "Disable" : "Enable"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Trader Form */}
      {editingTrader && (
        <form
          onSubmit={handleUpdateTrader}
          className="bg-white p-4 rounded-lg shadow space-y-3 max-w-md border"
        >
          <h3 className="font-semibold">Edit Trader</h3>

          <input
            value={editingTrader.name}
            onChange={(e) =>
              setEditingTrader({ ...editingTrader, name: e.target.value })
            }
            className="w-full border px-3 py-2 rounded"
            required
            placeholder="name"
          />

          <input
            value={editingTrader.email}
            onChange={(e) =>
              setEditingTrader({ ...editingTrader, email: e.target.value })
            }
            className="w-full border px-3 py-2 rounded"
            required
            placeholder="email"
          />

          <input
            value={editingTrader.phone || ""}
            onChange={(e) =>
              setEditingTrader({ ...editingTrader, phone: e.target.value })
            }
            className="w-full border px-3 py-2 rounded"
            placeholder="phone"
          />

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-700 text-white px-4 py-2 rounded"
            >
              Save
            </button>

            <button
              type="button"
              onClick={() => setEditingTrader(null)}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
