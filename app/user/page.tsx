// app/user/page.tsx
"use client";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

type Product = {
  id: number;
  name: string;
  imageUrl?: string;
  retailPrice: number;
};

export default function UserHomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchProducts() {
    try {
      const res = await fetch("/api/products", {
        credentials: "include",
      });
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
    } catch (err) {
      console.error("FETCH_PRODUCTS_ERROR:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <main className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      {/* ---------- HERO ---------- */}
      <section className="bg-gradient-to-r from-green-600 to-yellow-500 dark:from-emerald-700 dark:via-green-700 dark:to-teal-700 text-white py-14 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Fresh Amla Products, Straight from the Source 🌿
          </h1>
          <p className="text-lg opacity-90">
            Buy directly or connect with trusted traders near you
          </p>
        </div>
      </section>

      {/* ---------- TRADER CTA CARD ---------- */}
      <section className="max-w-6xl mx-auto px-4 -mt-10">
        <div className="bg-white dark:bg-gray-900 border border-transparent dark:border-gray-700 rounded-2xl shadow-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Traders in Your City
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Find nearby sellers and buy directly from local traders
            </p>
          </div>

          <Link
            href="/user/traders"
            className="bg-green-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-green-700 transition"
          >
            🔍 Find Traders Near Me
          </Link>
        </div>
      </section>

      {/* ---------- PRODUCTS ---------- */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Our Products
        </h2>

        {loading && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Loading products...
          </p>
        )}

        {!loading && products.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No products available right now
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-900 border border-transparent dark:border-gray-700 rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              {product.imageUrl && (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-44 w-full object-cover"
                />
              )}

              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {product.name}
                </h3>

                <p className="font-bold text-green-700 dark:text-green-400">
                  ₹{product.retailPrice}
                </p>

                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP}?text=${encodeURIComponent(
                    `I am interested in ${product.name}`
                  )}`}
                  target="_blank"
                  className="block text-center bg-green-600 text-white py-2 rounded-lg text-sm hover:bg-green-700"
                >
                  Order on WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>

  );
}
