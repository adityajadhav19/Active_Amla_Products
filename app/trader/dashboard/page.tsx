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
    const res = await fetch("/api/auth/me", {
      credentials: "include",
    });

    if (!res.ok) {
      router.replace("/login"); // ✅ now works
    }
  }

  checkAuth();
}, [router]);

  const [activeTab, setActiveTab] = useState<TraderTab>("orders");
  const [user, setUser] = useState<AuthUser | null>(null);

  /* -------- FETCH LOGGED-IN TRADER -------- */
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

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
      case "orders":
        return <Orders />;
      case "bills":
        return <Bills />;
      case "profile":
        return <Profile />;
      default:
        return <Orders />;
    }

  }





  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">
        Welcome{user ? `, ${user.name}` : ""} 👋
      </h2>

      {/* TOP TABS */}
      <div className="flex gap-2">
        <TabButton
          icon={ShoppingBag}
          label="My Orders"
          tab="orders"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <TabButton
          icon={Receipt}
          label="Bills"
          tab="bills"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <TabButton
          icon={UserIcon}
          label="Profile"
          tab="profile"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      {/* CONTENT */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
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
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}
