"use client";

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
      <h2 className="text-lg font-semibold">My Bills</h2>

      {bills.length === 0 && (
        <p className="text-gray-500">No bills available.</p>
      )}

      {bills.map((bill) => (
        <div
          key={bill.id}
          className="bg-white p-4 rounded shadow space-y-2"
        >
          <p className="font-semibold">
            Order #{bill.order.orderCode}
          </p>

          <div className="text-sm text-gray-700 space-y-1">
            <p>Base Amount: ₹{bill.baseAmount}</p>
            <p>Transport: ₹{bill.transportFee}</p>
            <p>Extra Charges: ₹{bill.extraCharges}</p>
            <p>Discount: ₹{bill.discount}</p>
            <p className="font-bold text-green-700">
              Total: ₹{bill.totalAmount}
            </p>
          </div>

          {bill.notes && (
            <p className="text-xs text-gray-500">
              Note: {bill.notes}
            </p>
          )}

          {/* PAYMENT ACTION */}
          {bill.status === "UNPAID" && (
            <button
              onClick={async () => {
                const res = await fetch(
                  `/api/traders/bills/${bill.id}/pay`,
                  {
                    method: "PATCH",
                    credentials: "include",
                  }
                );

                if (res.ok) {
                  fetchBills();
                } else {
                  alert("Failed to update payment status");
                }
              }}
              className="bg-green-600 text-white px-4 py-2 rounded text-sm"
            >
              Mark as Paid
            </button>
          )}

          {/* FOOTER */}
          <div className="flex justify-between items-center pt-2">
            <span
              className={`text-xs px-2 py-1 rounded ${
                bill.status === "PAID"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {bill.status === "PAID" ? "Paid" : "Pending"}
            </span>

            {bill.status === "UNPAID" && (
              <div className="text-sm text-right">
                <p>UPI: <b>adityajadhavtemp1@oksbi</b></p>
                <p>UPI NO.(Name :Aditya Jadhav): <b>7020513097</b></p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
