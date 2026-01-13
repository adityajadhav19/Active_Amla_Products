"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


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
  price: number;
};

export default function TraderProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const router = useRouter();

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

  useEffect(() => {
    fetchProducts();
  }, []);

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

  async function placeBulkOrder() {
    if (cart.length === 0) return;

    setPlacingOrder(true);

    try {
      const res = await fetch("/api/traders/orders", {
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
      <h1 className="text-3xl font-semibold text-center">
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
        <div className="bg-white p-6 rounded shadow space-y-4">
          <h2 className="text-xl font-semibold">Bulk Order Summary</h2>

          {cart.map((item) => (
            <div
              key={item.productId}
              className="flex justify-between text-sm"
            >
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>
                ₹{item.quantity * item.price}
              </span>
            </div>
          ))}

          <button
            onClick={placeBulkOrder}
            disabled={placingOrder}
            className="w-full bg-green-700 text-white py-2 rounded"
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
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-48 w-full object-cover"
        />
      )}

      <div className="p-4 space-y-2">
        <h2 className="font-semibold text-lg">{product.name}</h2>

        {product.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>
        )}

        <p className="font-bold text-green-700">
          ₹{product.wholesalePrice}
        </p>

        <div className="flex gap-2">
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-20 border px-2 py-1 rounded"
          />

          <button
            onClick={() => onAdd(product, quantity)}
            className="flex-1 bg-green-600 text-white rounded"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
