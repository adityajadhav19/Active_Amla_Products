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

  );
}
