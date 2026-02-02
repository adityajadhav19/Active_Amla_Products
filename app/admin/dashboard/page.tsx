"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

import Orders from "./orders";
import Products from "./product";
import Traders from "./trader";
import Users from "./users";
import Bills from "./bills";
import Logistics from "./logistics";
import Production from "./production";
import RawMaterial from "./rawmaterial";
import Messages from "./messages";

import { LucideIcon } from "lucide-react";
import {
  ShoppingCart,
  Package,
  Store,
  UserRound,
  Receipt,
  Truck,
  Factory,
  Boxes,
  MessageSquare,
} from "lucide-react";

type AuthUser = {
  name: string;
  role: "ADMIN";
};
type AdminTab =
  | "orders"
  | "products"
  | "traders"
  | "users"
  | "bills"
  | "logistics"
  | "production"
  | "rawmaterial"
  | "messages";

export default function AdminDashboardPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>("orders");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifyAdmin() {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          router.replace("/login");
          return;
        }

        const data = await res.json();
        if (data.role !== "ADMIN") {
          router.replace("/login");
          return;
        }

        setLoading(false);
      } catch {
        router.replace("/login");
      }
    }

    verifyAdmin();
  }, [router]);

  const renderActiveTab = useCallback(() => {
    switch (activeTab) {
      case "orders": return <Orders />;
      case "products": return <Products />;
      case "traders": return <Traders />;
      case "users": return <Users />;
      case "bills": return <Bills />;
      case "logistics": return <Logistics />;
      case "production": return <Production />;
      case "rawmaterial": return <RawMaterial />;
      case "messages": return <Messages />;
      default: return <Orders />;
    }
  }, [activeTab]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Loading admin dashboard…
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 bg-white dark:bg-gray-950 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
        Welcome,{user ? `, ${user.name}` : ""}  👋
      </h1>

      <div className="flex flex-wrap gap-2">
        <TabButton icon={Truck} label="Logistics" tab="logistics" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton icon={ShoppingCart} label="Orders" tab="orders" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton icon={Package} label="Products" tab="products" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton icon={Store} label="Traders" tab="traders" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton icon={UserRound} label="Users" tab="users" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton icon={Receipt} label="Bills" tab="bills" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton icon={MessageSquare} label="Messages" tab="messages" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton icon={Factory} label="Production" tab="production" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton icon={Boxes} label="Raw Material" tab="rawmaterial" activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <div className="bg-white dark:bg-gray-900 border border-transparent dark:border-gray-700 rounded-lg p-6 shadow-sm">
        {renderActiveTab()}
      </div>
    </div>
  );
}

/* ---------------- TAB BUTTON ---------------- */

function TabButton({
  icon: Icon,
  label,
  tab,
  activeTab,
  setActiveTab,
}: {
  icon: LucideIcon;
  label: string;
  tab: AdminTab;
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
}) {
  const isActive = activeTab === tab;

  return (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
        isActive
          ? "bg-green-700 text-white"
          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}
