// app/admin/layout.tsx
"use client";

import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="min-h-screen flex">
    
      
      <main className="flex-1 p-6 bg-gray-100">
        {children}
      </main>
    </div>
  );
}
