"use client";

import { fetchWithCSRF } from "@/lib/fetchWithCSRF";
import { useEffect, useState } from "react";


type Bill = {
  id: number;
  baseAmount: number;
  transportFee: number;
  extraCharges: number;
  discount: number;
  totalAmount: number;
  notes?: string;
  status: "PAID" | "UNPAID";
  order: {
    orderCode: string;
  };
};

export default function Bills() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchBills() {
    try {
      const res = await fetch("/api/traders/bills", {
        credentials: "include",
      });

      if (!res.ok) {
        console.error("FETCH_BILLS_FAILED:", res.status);
        setBills([]);
        return;
      }

      const data = await res.json();
      if (Array.isArray(data)) setBills(data);
    } catch (err) {
      console.error("FETCH_BILLS_ERROR:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBills();
  }, []);

  if (loading) {
    return <p className="text-center py-6">Loading bills...</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        My Bills
      </h2>

      {bills.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">
          No bills available.
        </p>
      )}

      {bills.map((bill) => (
        <div
          key={bill.id}
          className="bg-white dark:bg-gray-900 p-4 rounded shadow space-y-2 border border-gray-200 dark:border-gray-800"
        >
          <p className="font-semibold text-gray-900 dark:text-gray-100">
            Order #{bill.order.orderCode}
          </p>

          <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <p>Base Amount: ₹{bill.baseAmount}</p>
            <p>Transport: ₹{bill.transportFee}</p>
            <p>Extra Charges: ₹{bill.extraCharges}</p>
            <p>Discount: ₹{bill.discount}</p>
            <p className="font-bold text-green-700 dark:text-green-400">
              Total: ₹{bill.totalAmount}
            </p>
          </div>

          {bill.notes && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Note: {bill.notes}
            </p>
          )}

          {/* PAYMENT ACTION */}
          {bill.status === "UNPAID" && (
            <button
              onClick={async () => {
                const res = await fetchWithCSRF(
                  `/api/traders/bills/${bill.id}/pay`,
                  { method: "PATCH" }
                );

                if (res.ok) {
                  fetchBills();
                } else {
                  alert("Failed to update payment status");
                }
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition"
            >
              Mark as Paid
            </button>

          )}

          {/* FOOTER */}
          <div className="flex justify-between items-center pt-2">
            <span
              className={`text-xs px-2 py-1 rounded ${bill.status === "PAID"
                ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                }`}
            >
              {bill.status === "PAID" ? "Paid" : "Pending"}
            </span>

            {bill.status === "UNPAID" && (
              <div className="text-sm text-right text-gray-800 dark:text-gray-200">
                <p>
                  UPI: <b>adityajadhavtemp1@oksbi</b>
                </p>
                <p>
                  UPI NO.(Name :Aditya Jadhav): <b>7020513097</b>
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>

  );
}
