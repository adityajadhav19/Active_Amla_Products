"use client";

import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  retailPrice: number;
  wholesalePrice: number;
  isActive: boolean;
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  // form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [retailPrice, setRetailPrice] = useState("");
  const [wholesalePrice, setWholesalePrice] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  /* ---------------- FETCH PRODUCTS ---------------- */

  async function fetchProducts() {
    try {
      const res = await fetch("/api/admin/product", {
        credentials: "include", // 🔴 REQUIRED for admin auth
      });

      const data = await res.json();

      // 🔒 SAFETY: prevent products.map crash
      if (!Array.isArray(data)) {
        console.error("Products API error:", data);
        setProducts([]);
        return;
      }

      setProducts(data);
    } catch (error) {
      console.error("Fetch products failed:", error);
      setProducts([]);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ---------------- CREATE PRODUCT ---------------- */

  async function handleCreateProduct(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    let imageUrl: string | null = null;

    // Upload image
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);

      const uploadRes = await fetch("/api/admin/product/upload", {
        method: "POST",
        body: formData,
        credentials: "include", // 🔴 REQUIRED
      });

      const uploadData = await uploadRes.json();
      imageUrl = uploadData.imageUrl;
    }

    await fetch("/api/admin/product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // 🔴 REQUIRED
      body: JSON.stringify({
        name,
        description,
        retailPrice: Number(retailPrice),
        wholesalePrice: Number(wholesalePrice),
        imageUrl,
      }),
    });

    // reset
    setLoading(false);
    setShowForm(false);
    setName("");
    setDescription("");
    setRetailPrice("");
    setWholesalePrice("");
    setImageFile(null);

    fetchProducts();
  }

  /* ---------------- UPDATE PRODUCT ---------------- */

  async function handleUpdateProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!editingProduct) return;

    let imageUrl = editingProduct.imageUrl;

    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);

      const uploadRes = await fetch("/api/admin/product/upload", {
        method: "POST",
        body: formData,
        credentials: "include", // 🔴 REQUIRED
      });

      const uploadData = await uploadRes.json();
      imageUrl = uploadData.imageUrl;
    }

    await fetch(`/api/admin/product/${editingProduct.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // 🔴 REQUIRED
      body: JSON.stringify({
        name: editingProduct.name,
        description: editingProduct.description,
        retailPrice: editingProduct.retailPrice,
        wholesalePrice: editingProduct.wholesalePrice,
        imageUrl,
      }),
    });

    setEditingProduct(null);
    setImageFile(null);
    fetchProducts();
  }

  /* ---------------- ENABLE / DISABLE ---------------- */

  async function toggleStatus(id: number, isActive: boolean) {
    await fetch(`/api/admin/product/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // 🔴 REQUIRED
      body: JSON.stringify({ isActive }),
    });

    fetchProducts();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Products</h2>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-700 text-white px-4 py-2 rounded"
        >
          + Add Product
        </button>
      </div>

      {/* Create Product Form */}
      {showForm && (
        <form
          onSubmit={handleCreateProduct}
          className="bg-white p-4 rounded-lg shadow space-y-3 max-w-md"
        >
          <input
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="w-full"
          />

          <input
            placeholder="Retail Price"
            value={retailPrice}
            onChange={(e) => setRetailPrice(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />

          <input
            placeholder="Wholesale Price"
            value={wholesalePrice}
            onChange={(e) => setWholesalePrice(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-700 text-white px-4 py-2 rounded"
            >
              {loading ? "Creating..." : "Create"}
            </button>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Product Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white p-4 rounded-lg shadow space-y-2"
          >
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-40 object-cover rounded"
              />
            )}

            <h3 className="font-semibold">{product.name}</h3>

            <p className="text-sm text-gray-600">
              Retail: ₹{product.retailPrice}
            </p>
            <p className="text-sm text-gray-600">
              Wholesale: ₹{product.wholesalePrice}
            </p>

            <span
              className={`inline-block text-xs px-2 py-1 rounded ${
                product.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {product.isActive ? "Active" : "Disabled"}
            </span>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setEditingProduct(product)}
                className="border px-3 py-1 rounded text-sm"
              >
                Edit
              </button>

              <button
                onClick={() =>
                  toggleStatus(product.id, !product.isActive)
                }
                className="border px-3 py-1 rounded text-sm"
              >
                {product.isActive ? "Disable" : "Enable"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Product Form */}
      {editingProduct && (
        <form
          onSubmit={handleUpdateProduct}
          className="bg-white p-4 rounded-lg shadow space-y-3 max-w-md border"
        >
          <h3 className="font-semibold">Edit Product</h3>

          <input
            value={editingProduct.name}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, name: e.target.value })
            }
            className="w-full border px-3 py-2 rounded"
            required
          />

          <textarea
            value={editingProduct.description || ""}
            onChange={(e) =>
              setEditingProduct({
                ...editingProduct,
                description: e.target.value,
              })
            }
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="w-full"
          />

          <input
            value={editingProduct.retailPrice}
            onChange={(e) =>
              setEditingProduct({
                ...editingProduct,
                retailPrice: Number(e.target.value),
              })
            }
            className="w-full border px-3 py-2 rounded"
          />

          <input
            value={editingProduct.wholesalePrice}
            onChange={(e) =>
              setEditingProduct({
                ...editingProduct,
                wholesalePrice: Number(e.target.value),
              })
            }
            className="w-full border px-3 py-2 rounded"
          />

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-700 text-white px-4 py-2 rounded"
            >
              Save
            </button>

            <button
              type="button"
              onClick={() => setEditingProduct(null)}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
