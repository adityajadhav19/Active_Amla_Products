"use client";

import { useEffect, useState } from "react";

type Bill = {
  id: number;
  baseAmount: number;
  transportFee: number;
  extraCharges: number;
  discount: number;
  totalAmount: number;
  isPaid: boolean;
  notes?: string;
  order: {
    orderCode: string;
  };
};

export default function Bills() {
  const [bills, setBills] = useState<Bill[]>([]);

  async function fetchBills() {
    const res = await fetch("/api/traders/bills", {
      credentials: "include",
    });
    const data = await res.json();
    if (Array.isArray(data)) setBills(data);
  }

  useEffect(() => {
    fetchBills();
  }, []);

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

          <div className="flex justify-between items-center pt-2">
            <span
              className={`text-xs px-2 py-1 rounded ${
                bill.isPaid
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {bill.isPaid ? "Paid" : "Pending"}
            </span>

            {!bill.isPaid && (
              <div className="text-sm text-right">
                <p>UPI: <b>activeamla@upi</b></p>
                <p>Account: <b>XXXX-1234</b></p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
