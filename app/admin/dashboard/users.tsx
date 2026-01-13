"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  isActive: boolean;
};

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);

  async function fetchUsers() {
    const res = await fetch("/api/admin/users", {
      credentials: "include",
    });
    const data = await res.json();
    if (Array.isArray(data)) setUsers(data);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function toggleStatus(id: number, isActive: boolean) {
    await fetch(`/api/admin/users/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ isActive }),
    });

    fetchUsers();
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Users</h2>

      {users.map((user) => (
        <div
          key={user.id}
          className="bg-white p-4 rounded shadow flex justify-between items-center"
        >
          <div>
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
            {user.phone && (
              <p className="text-xs text-gray-500">{user.phone}</p>
            )}
          </div>

          <button
            onClick={() => toggleStatus(user.id, !user.isActive)}
            className={`px-4 py-2 rounded text-white ${
              user.isActive ? "bg-red-600" : "bg-green-600"
            }`}
          >
            {user.isActive ? "Disable" : "Enable"}
          </button>
        </div>
      ))}
    </div>
  );
}
