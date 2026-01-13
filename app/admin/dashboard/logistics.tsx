//app/admin/dahsboard/logistics.tsx

"use client";

import { useEffect, useState } from "react";

type Order = {
  id: number;
  orderId: string;
  status: "REQUESTED" | "APPROVED" | "SENT" | "COMPLETED";
  user: {
    name: string;
    email: string;
  };
};

export default function Logistics() {
  const [orders, setOrders] = useState<Order[]>([]);

  async function fetchOrders() {
    const res = await fetch("/api/admin/logistics", {
      credentials: "include",
    });

    const data = await res.json();
    if (Array.isArray(data)) setOrders(data);
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  async function markAsSent(id: number) {
  const trackingId = prompt("Enter tracking ID (optional)");

  await fetch(`/api/admin/orders/${id}/send`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ trackingId }),
  });

  fetchOrders();
}


  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Logistics</h2>

      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white p-4 rounded shadow flex justify-between items-center"
        >
          <div>
            <p className="font-semibold">Order #{order.orderId}</p>
            <p className="text-sm text-gray-600">
              Trader: {order.user.name}
            </p>
            <p className="text-xs text-gray-500">Status: {order.status}</p>
          </div>

          {order.status === "APPROVED" && (
            <button
              onClick={() => markAsSent(order.id)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Mark as Sent
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
