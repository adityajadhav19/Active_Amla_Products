"use client";

import { useEffect, useState } from "react";
import { LucideIcon, ShoppingBag, Receipt, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Orders from "./order";
import Bills from "./bills";
import Profile from "./profile";

type TraderTab = "orders" | "bills" | "profile";

type AuthUser = {
  name: string;
  role: "TRADER";
};

export default function TraderDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) router.replace("/login");
    }
    checkAuth();
  }, [router]);

  const [activeTab, setActiveTab] = useState<TraderTab>("orders");
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        setUser(data);
      } catch {
        setUser(null);
      }
    }
    fetchUser();
  }, []);

  function renderActiveTab() {
    switch (activeTab) {
      case "orders": return <Orders />;
      case "bills": return <Bills />;
      case "profile": return <Profile />;
      default: return <Orders />;
    }
  }

  return (
    <div className="space-y-6 min-h-screen bg-gray-50 dark:bg-gray-950 p-6 rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
        Welcome{user ? `, ${user.name}` : ""} 👋
      </h2>

      {/* TABS */}
      <div className="flex gap-2 flex-wrap">
        <TabButton icon={ShoppingBag} label="My Orders" tab="orders" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton icon={Receipt} label="Bills" tab="bills" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton icon={UserIcon} label="Profile" tab="profile" activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* CONTENT */}
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-800">
        {renderActiveTab()}
      </div>
    </div>
  );
}

/* ------------ TAB BUTTON ------------ */

function TabButton({
  icon: Icon,
  label,
  tab,
  activeTab,
  setActiveTab,
}: {
  icon: LucideIcon;
  label: string;
  tab: TraderTab;
  activeTab: TraderTab;
  setActiveTab: (tab: TraderTab) => void;
}) {
  const isActive = activeTab === tab;

  return (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition
        ${
          isActive
            ? "bg-green-700 text-white"
            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}
