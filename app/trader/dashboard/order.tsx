//app/trader/dahsboard/order.tsx

"use client";

import { useEffect, useState } from "react";

type Order = {
  id: number;
  orderCode: string;
  status: string;
  totalAmount?: number;
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white p-4 rounded shadow"
        >
          <p className="font-semibold">
            Order #{order.orderCode}
          </p>
          <p className="text-sm text-gray-600">
            Status: {order.status}
          </p>
          {order.totalAmount && (
            <p className="text-sm font-medium">
              Amount: ₹{order.totalAmount}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
