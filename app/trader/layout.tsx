"use client";

export default function TraderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors">
      <main className="p-6 text-gray-900 dark:text-gray-100">
        {children}
      </main>
    </div>
  );
}
