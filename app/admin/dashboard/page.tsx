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

/* ---------------- TYPES ---------------- */

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

type AuthUser = {
  id: number;
  name: string;
  role: "ADMIN";
};

/* ---------------- PAGE ---------------- */

export default function AdminDashboardPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<AdminTab>("orders");
  const [admin, setAdmin] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- AUTH CHECK ---------------- */

  useEffect(() => {
    async function checkAdmin() {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
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

        setAdmin(data);
      } catch {
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    }

    checkAdmin();
  }, [router]);

  /* ---------------- TAB RENDER ---------------- */

  const renderActiveTab = useCallback(() => {
    switch (activeTab) {
      case "orders":
        return <Orders />;
      case "products":
        return <Products />;
      case "traders":
        return <Traders />;
      case "users":
        return <Users />;
      case "bills":
        return <Bills />;
      case "logistics":
        return <Logistics />;
      case "production":
        return <Production />;
      case "rawmaterial":
        return <RawMaterial />;
      case "messages":
        return <Messages/>;
      default:
        return <Orders />;
    }
  }, [activeTab]);

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading admin dashboard…</p>
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <h1 className="text-2xl font-semibold text-gray-800">
        Welcome, {admin?.name} 👋
      </h1>

      {/* TABS */}
      <div className="flex flex-wrap gap-2">
        <TabButton icon={ShoppingCart} label="Orders" tab="orders" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton icon={Package} label="Products" tab="products" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton icon={Store} label="Traders" tab="traders" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton icon={UserRound} label="Users" tab="users" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton icon={Receipt} label="Bills" tab="bills" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton icon={MessageSquare} label="Messages" tab="messages" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton icon={Truck} label="Logistics" tab="logistics" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton icon={Factory} label="Production" tab="production" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton icon={Boxes} label="Raw Material" tab="rawmaterial" activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* CONTENT */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
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
