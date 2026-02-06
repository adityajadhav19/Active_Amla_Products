"use client";

import { useMemo, useState } from "react";
import { fetchWithCSRF } from "@/lib/fetchWithCSRF";
type Props = {
  orderId: number;
  onSuccess?: () => void;
};

export default function CreateBillButton({ orderId, onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [baseAmount, setBaseAmount] = useState("");
  const [transportFee, setTransportFee] = useState("");
  const [extraCharges, setExtraCharges] = useState("");
  const [discount, setDiscount] = useState("");
  const [notes, setNotes] = useState("");

  // ✅ Live total preview (UX only)
  const totalAmount = useMemo(() => {
    return (
      Number(baseAmount || 0) +
      Number(transportFee || 0) +
      Number(extraCharges || 0) -
      Number(discount || 0)
    );
  }, [baseAmount, transportFee, extraCharges, discount]);

  async function handleCreateBill() {
    if (!baseAmount) {
      alert("Base amount is required");
      return;
    }

    setLoading(true);

    const res = await fetchWithCSRF("/api/admin/bills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId,
        baseAmount: Number(baseAmount),
        transportFee: Number(transportFee || 0),
        extraCharges: Number(extraCharges || 0),
        discount: Number(discount || 0),
        notes,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.error || "Failed to create bill");
      return;
    }

    setOpen(false);
    onSuccess?.();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
      >
        Create Bill
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Create Bill
            </h3>

            <input
              placeholder="Base Amount *"
              value={baseAmount}
              onChange={(e) => setBaseAmount(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 rounded"
            />

            <input
              placeholder="Transport Charges"
              value={transportFee}
              onChange={(e) => setTransportFee(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 rounded"
            />

            <input
              placeholder="Extra Charges"
              value={extraCharges}
              onChange={(e) => setExtraCharges(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 rounded"
            />

            <input
              placeholder="Discount"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 rounded"
            />

            <div className="text-right text-sm font-semibold text-green-700 dark:text-green-400">
              Total Amount: ₹{totalAmount}
            </div>

            <textarea
              placeholder="Notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 rounded"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateBill}
                disabled={loading}
                className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded"
              >
                {loading ? "Creating..." : "Create Bill"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>

  );
}
