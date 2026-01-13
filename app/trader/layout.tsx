"use client";

export default function TraderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b px-6 py-4">
        <h1 className="text-lg font-semibold text-gray-800">
          Trader Dashboard
        </h1>
      </header>

      <main className="p-6">{children}</main>
    </div>
  );
}
