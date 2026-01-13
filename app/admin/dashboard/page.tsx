//admin/dashboard
"use client";

import { useEffect,useState} from "react";
import Orders from "./orders";
import Products from "./product";
import Traders from "./trader";
import Users from "./users";
import Bills from "./bills";
import Logistics from "./logistics";
import Production from "./production";
import RawMaterial from "./rawmaterial";
import {LucideIcon} from "lucide-react";
import {
  ShoppingCart,
  Package,
  Store,
  UserRound,
  Receipt,
  Truck,
  Factory,
  Boxes,
} from "lucide-react";


type AdminTab =
  | "orders"
  | "products"
  | "traders"
  | "users"
  | "bills"
  | "logistics"
  | "production"
  | "rawmaterial";


export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("orders");

  function renderActiveTab() {
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
      default:
        return <Orders />;
    }
  }
const [userName, setUserName] = useState("");

useEffect(() => {
  const name = localStorage.getItem("userName");
  if (name) setUserName(name);
}, []);


  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-semibold text-gray-800">
      Welcome{userName ? `, ${userName}` : ""} 👋
      </h1>


      {/* TOP TABS */}
      <div className="flex flex-wrap gap-2">
        <TabButton icon={ShoppingCart} label="Orders" tab="orders" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton icon={Package} label="Products" tab="products" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton icon={Store} label="Traders" tab="traders" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton icon={UserRound} label="Users" tab="users" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton icon={Receipt} label="Bills" tab="bills" activeTab={activeTab} setActiveTab={setActiveTab} />
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
      <span>{label}</span>
    </button>
  );
}
