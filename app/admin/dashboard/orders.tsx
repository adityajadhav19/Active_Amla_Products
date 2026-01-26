"use client";

import { useEffect, useState } from "react";
import CreateBillButton from "@/components/admin/CreateBillButton";

type OrderItem = {
  quantity: number;
  price: number;
  product: {
    name: string;
    wholesalePrice: number;
  };
};

type Order = {
  id: number;
  orderCode: string;
  status: "REQUESTED" | "APPROVED" | "PROCESSING" | "DISPATCHED" | "DELIVERED" | "CANCELLED";
  trader?: {
    name: string;
    city?: string;
  };
  items: OrderItem[];
  bill?: {
    id: number;
    status: "UNPAID" | "PAID";
    totalAmount: number;
  } | null;
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchOrders() {
    try {
      const res = await fetch("/api/admin/orders", { credentials: "include" });
      if (!res.ok) return setOrders([]);
      const data = await res.json();
      if (Array.isArray(data)) setOrders(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  async function approveOrder(orderId: number) {
    await fetch(`/api/admin/orders/${orderId}/approve`, {
      method: "PATCH",
      credentials: "include",
    });
    fetchOrders();
  }

  async function markDispatched(orderId: number) {
    await fetch(`/api/admin/orders/${orderId}/send`, {
      method: "PATCH",
      credentials: "include",
    });
    fetchOrders();
  }

  if (loading) return <p className="text-center py-6">Loading orders...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Orders</h2>

      {orders.length === 0 && <p className="text-gray-500">No orders found.</p>}

      {orders.map((order) => (
        <div key={order.id} className="bg-white p-5 rounded-lg shadow space-y-3 border">
          {/* HEADER */}
          <div>
            <p className="font-semibold text-base">Order #{order.orderCode}</p>
            <p className="text-sm text-gray-600">
              Trader: {order.trader?.name ?? "—"} {order.trader?.city && `(${order.trader.city})`}
            </p>
            <p className="text-xs text-gray-500">Status: {order.status}</p>
          </div>

          {/* ITEMS */}
          <div className="bg-gray-50 rounded p-3 space-y-1">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>{item.quantity} × {item.product.name}</span>
                <span className="text-gray-600">₹{item.price}</span>
              </div>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2 pt-2">

            {/* APPROVE */}
            {order.status === "REQUESTED" && (
              <button
                onClick={() => approveOrder(order.id)}
                className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm"
              >
                Approve Order
              </button>
            )}

            {/* CREATE BILL */}
            {order.status === "APPROVED" && !order.bill && (
              <CreateBillButton orderId={order.id} onSuccess={fetchOrders} />
            )}

            {/* WAITING PAYMENT */}
            {order.bill && order.bill.status === "UNPAID" && (
              <div className="text-sm text-yellow-700 text-right">
                Waiting for payment
                <div className="font-medium">₹ {order.bill.totalAmount}</div>
              </div>
            )}

            {/* READY FOR DISPATCH */}
            {order.bill?.status === "PAID" && order.status === "PROCESSING" && (
              <button
                onClick={() => markDispatched(order.id)}
                className="bg-green-600 text-white px-4 py-1.5 rounded text-sm"
              >
                Mark as Dispatched
              </button>
            )}

            {/* DISPATCHED */}
            {order.status === "DISPATCHED" && (
              <span className="text-xs text-gray-500">Dispatched</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
