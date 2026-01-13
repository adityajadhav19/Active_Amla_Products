//app/admin/dashboard/bills.tsx
"use client";

import { useEffect, useState } from "react";

type Bill = {
  id: number;
  baseAmount: number;
  transportFee: number;
  extraCharges: number;
  discount: number;
  totalAmount: number;
  status: "PENDING" | "PAID";
  createdAt: string;
  order: {
    orderCode: string;
    trader?: {
      name: string;
      email: string;
    };
  };
};

export default function AdminBills() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchBills() {
    try {
      const res = await fetch("/api/admin/bills", {
        credentials: "include",
      });

      if (!res.ok) {
        console.error("FETCH_BILLS_FAILED:", res.status);
        setBills([]);
        return;
      }

      const data = await res.json();
      if (Array.isArray(data)) setBills(data);
      else setBills([]);
    } catch (err) {
      console.error("FETCH_BILLS_ERROR:", err);
      setBills([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBills();
  }, []);

  async function markAsPaid(billId: number) {
    await fetch(`/api/admin/bills/${billId}/pay`, {
      method: "PATCH",
      credentials: "include",
    });

    fetchBills();
  }

  if (loading) {
    return <p className="text-center py-6">Loading bills...</p>;
  }

  if (bills.length === 0) {
    return (
      <p className="text-center text-gray-500 py-6">
        No bills created yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Bills</h2>

      {bills.map((bill) => (
        <div
          key={bill.id}
          className="bg-white p-4 rounded shadow space-y-2"
        >
          <div className="flex justify-between">
            <div>
              <p className="font-semibold">
                Order #{bill.order.orderCode}
              </p>
              <p className="text-sm text-gray-600">
                Trader: {bill.order.trader?.name ?? "—"}
              </p>
            </div>

            <span
              className={`text-xs px-2 py-1 rounded ${
                bill.status === "PAID"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {bill.status}
            </span>
          </div>

          <div className="text-sm text-gray-700">
            <p>Base: ₹{bill.baseAmount}</p>
            <p>Transport: ₹{bill.transportFee}</p>
            <p>Extra: ₹{bill.extraCharges}</p>
            <p>Discount: ₹{bill.discount}</p>
            <p className="font-semibold">
              Total: ₹{bill.totalAmount}
            </p>
          </div>

          {bill.status === "PENDING" && (
            <button
              onClick={() => markAsPaid(bill.id)}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm"
            >
              Mark as Paid
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
