"use client";

import { useEffect, useState } from "react";

export default function UserPage() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("userName");
    if (name) setUserName(name);
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold text-gray-800">
        Welcome{userName ? `, ${userName}` : ""} 👋
      </h1>

      <p className="text-gray-600">
        Browse our products and place orders via WhatsApp.
      </p>

      {/* Future user features */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <p className="text-sm text-gray-500">
          Your orders and profile features will appear here.
        </p>
      </div>
    </div>
  );
}
