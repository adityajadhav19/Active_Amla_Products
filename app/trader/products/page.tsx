"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { fetchWithCSRF } from "@/lib/fetchWithCSRF";

type Product = {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  wholesalePrice: number;
};

type CartItem = {
  productId: number;
  name: string;
  quantity: number;
  price: number; // wholesale price
};

export default function TraderProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const router = useRouter();

  /* ---------- AUTH CHECK ---------- */
  useEffect(() => {
    async function checkAuth() {
      const res = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (!res.ok) {
        router.replace("/login");
        return;
      }

      const data = await res.json();
      if (data.role !== "TRADER" && data.role !== "ADMIN") {
        router.replace("/");
      }
    }

    checkAuth();
  }, [router]);

  /* ---------- FETCH PRODUCTS ---------- */
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products", {
          credentials: "include",
        });
        const data = await res.json();
        if (Array.isArray(data)) setProducts(data);
      } catch (error) {
        console.error("FETCH_PRODUCTS_ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  /* ---------- ADD TO CART ---------- */
  function addToCart(product: Product, quantity: number) {
    if (quantity <= 0) return;

    setCart((prev) => {
      const existing = prev.find(
        (item) => item.productId === product.id
      );

      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          quantity,
          price: product.wholesalePrice,
        },
      ];
    });
  }

  /* ---------- PLACE ORDER ---------- */
  async function placeBulkOrder() {
    if (cart.length === 0) return;
    setPlacingOrder(true);

    try {
      const res = await fetchWithCSRF("/api/traders/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
      });

      if (!res.ok) {
        alert("Failed to place order");
        return;
      }

      alert("Bulk order placed successfully!");
      setCart([]);
    } catch (error) {
      console.error("ORDER_ERROR:", error);
      alert("Something went wrong");
    } finally {
      setPlacingOrder(false);
    }
  }

  if (loading) {
    return <p className="text-center py-10">Loading products...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      <h1 className="text-3xl font-semibold text-center text-gray-900 dark:text-gray-100">
        Wholesale Products
      </h1>

      {/* PRODUCTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAdd={addToCart}
          />
        ))}
      </div>

      {/* CART */}
      {cart.length > 0 && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded shadow space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Bulk Order Summary
          </h2>

          {cart.map((item) => (
            <div
              key={item.productId}
              className="flex justify-between items-center text-sm border-b border-gray-200 dark:border-gray-700 pb-2"
            >
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{item.name}</p>

                <div className="flex items-center gap-2 mt-1">
                  <button className="px-2 bg-gray-200 dark:bg-gray-700 rounded text-gray-900 dark:text-gray-100">−</button>
                  <span className="text-gray-900 dark:text-gray-100">{item.quantity}</span>
                  <button className="px-2 bg-gray-200 dark:bg-gray-700 rounded text-gray-900 dark:text-gray-100">+</button>
                  <button className="ml-3 text-red-600 text-xs">Remove</button>
                </div>
              </div>

              <span className="font-medium text-gray-900 dark:text-gray-100">
                ₹{item.quantity * item.price}
              </span>
            </div>
          ))}

          {/* TOTAL */}
          <div className="flex justify-between font-semibold pt-2 text-gray-900 dark:text-gray-100">
            <span>Total</span>
            <span>
              ₹{cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}
            </span>
          </div>

          <button
            onClick={placeBulkOrder}
            disabled={placingOrder}
            className="w-full bg-green-700 hover:bg-green-800 text-white py-2 rounded"
          >
            {placingOrder ? "Placing Order..." : "Place Bulk Order"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- PRODUCT CARD ---------- */

function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (product: Product, quantity: number) => void;
}) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow hover:shadow-lg transition overflow-hidden">
      {product.imageUrl && (
        <Image
        width={400}
        height={200}
          src={product.imageUrl}
          alt={product.name}
          className="h-48 w-full object-cover"
        />
      )}

      <div className="p-4 space-y-2">
        <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
          {product.name}
        </h2>

        {product.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {product.description}
          </p>
        )}

        <p className="font-bold text-green-700 dark:text-green-400">
          ₹{product.wholesalePrice}
        </p>

        <div className="flex gap-2">
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (val > 0) setQuantity(val);
            }}
            className="w-20 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-2 py-1 rounded"
          />

          <button
            onClick={() => onAdd(product, quantity)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
