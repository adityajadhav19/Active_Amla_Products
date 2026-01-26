//app/products/page.tsx

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Product = {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  retailPrice: number;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchProducts() {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();

      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (error) {
      console.error("FETCH_PRODUCTS_ERROR:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return <p className="text-center py-10">Loading products...</p>;
  }

  return (
    <main>
   
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-8 text-center">
        Our Products
      </h1>

      {products.length === 0 && (
        <p className="text-center text-gray-500">
          No products available at the moment.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
          >
            {product.imageUrl && (
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={400}
                height={300}
                className="h-48 w-full object-cover"
              />
            )}

            <div className="p-4 space-y-2">
              <h2 className="font-semibold text-lg">
                {product.name}
              </h2>

              {product.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {product.description}
                </p>
              )}

              <p className="font-bold text-green-700">
                ₹{product.retailPrice}
              </p>

              <a
                
                href={`https://wa.me/${process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP}?text=${encodeURIComponent(
                  `I am interested in ${product.name}`
                )}`}
                target="_blank"
                className="block text-center bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                Order on WhatsApp
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
    </main>
  );
}
