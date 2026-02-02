// app/admin/layout.tsx
"use client";

import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="min-h-screen flex dark:bg-gray-950">
      <main className="flex-1 p-6 bg-gray-100 dark:bg-gray-700">
        {children}
      </main>
    </div>
  );
}
