"use client";

import { useEffect, useState } from "react";
import CreateBillButton from "@/components/admin/CreateBillButton";

type Order = {
  id: number;
  orderCode: string;
  status: "REQUESTED" | "APPROVED" | "PROCESSING" | "DISPATCHED";
  user?: { name: string };
  bill?: {
    id: number;
    totalAmount: number;
    status: string;
  } | null;
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);

  async function fetchOrders() {
    const res = await fetch("/api/admin/orders", {
      credentials: "include",
    });

    const data = await res.json();
    if (Array.isArray(data)) setOrders(data);
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ---------- APPROVE ORDER ---------- */
  async function approveOrder(orderId: number) {
    await fetch(`/api/admin/orders/${orderId}/approve`, {
      method: "PATCH",
    });
    fetchOrders();
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Orders</h2>

      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white p-4 rounded shadow flex justify-between items-center"
        >
          {/* ORDER INFO */}
          <div>
            <p className="font-semibold">
              Order #{order.orderCode}
            </p>
            <p className="text-sm text-gray-600">
              Trader: {order.user?.name || "—"}
            </p>
            <p className="text-xs text-gray-500">
              Status: {order.status}
            </p>
          </div>

          {/* ACTIONS */}
          <div className="text-right space-y-2">
            {/* BILL EXISTS */}
            {order.bill && (
              <div className="text-sm">
                <p className="font-semibold">
                  ₹ {order.bill.totalAmount}
                </p>
                <span className="text-xs bg-yellow-100 px-2 py-1 rounded">
                  {order.bill.status}
                </span>
              </div>
            )}

            {/* APPROVE */}
            {!order.bill && order.status === "REQUESTED" && (
              <button
                onClick={() => approveOrder(order.id)}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                Approve Order
              </button>
            )}

            {/* CREATE BILL */}
            {!order.bill && order.status === "APPROVED" && (
              <CreateBillButton
                orderId={order.id}
                onSuccess={fetchOrders}
              />
            )}

            {/* NO ACTION */}
            {!order.bill &&
              order.status !== "REQUESTED" &&
              order.status !== "APPROVED" && (
                <span className="text-xs text-gray-400">
                  No actions available
                </span>
              )}
          </div>
        </div>
      ))}
    </div>
  );
}
