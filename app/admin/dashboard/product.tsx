"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchWithCSRF } from "@/lib/fetchWithCSRF";

type Product = {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  retailPrice: number;
  wholesalePrice: number;
  isActive: boolean;
  inStock: boolean;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [retailPrice, setRetailPrice] = useState("");
  const [wholesalePrice, setWholesalePrice] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  /* ---------------- FETCH ---------------- */
  async function fetchProducts() {
    try {
      const res = await fetch("/api/admin/product", {
        credentials: "include",
      });
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setProducts([]);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ---------------- CREATE ---------------- */
  async function handleCreateProduct(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let imageUrl: string | null = null;

      if (imageFile) {
        const fd = new FormData();
        fd.append("file", imageFile);

        const uploadRes = await fetchWithCSRF("/api/admin/product/upload", {
          method: "POST",
          body: fd,
          credentials: "include",
        });

        const uploadData = await uploadRes.json();
        imageUrl = uploadData.imageUrl;
      }

      await fetchWithCSRF("/api/admin/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name,
          slug: slugify(name),
          description,
          retailPrice: Number(retailPrice),
          wholesalePrice: Number(wholesalePrice),
          imageUrl,
        }),
      });

      resetForm();
      setShowForm(false);
      fetchProducts();
    } catch {
      setError("Failed to create product");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setName("");
    setDescription("");
    setRetailPrice("");
    setWholesalePrice("");
    setImageFile(null);
  }

  /* ---------------- UPDATE ---------------- */
  async function handleUpdateProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!editingProduct) return;

    let imageUrl = editingProduct.imageUrl;

    if (imageFile) {
      const fd = new FormData();
      fd.append("file", imageFile);

      const uploadRes = await fetchWithCSRF("/api/admin/product/upload", {
        method: "POST",
        body: fd,
        credentials: "include",
      });

      const uploadData = await uploadRes.json();
      imageUrl = uploadData.imageUrl;
    }

    await fetchWithCSRF(`/api/admin/product/${editingProduct.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name: editingProduct.name,
        slug: slugify(editingProduct.name),
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

  /* ---------------- STATUS ---------------- */
  async function toggleStatus(id: number, isActive: boolean) {
    await fetchWithCSRF(`/api/admin/product/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ isActive }),
    });

    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, isActive } : p))
    );
  }

  /* ---------------- STOCK ---------------- */
  async function toggleInStock(product: Product) {
    await fetchWithCSRF(`/api/admin/product/${product.id}/stock`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ inStock: !product.inStock }),
    });

    setProducts(prev =>
      prev.map(p =>
        p.id === product.id ? { ...p, inStock: !p.inStock } : p
      )
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Products
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
        >
          + Add Product
        </button>
      </div>

      {error && <p className="text-red-600 dark:text-red-400">{error}</p>}

      {/* CREATE FORM */}
      {showForm && (
        <form className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-4 shadow space-y-3 max-w-md rounded">
          <input
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2 rounded"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2 rounded"
          />
          <input type="file" />
          <input
            placeholder="Retail price"
            value={retailPrice}
            onChange={e => setRetailPrice(e.target.value)}
            required
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2 rounded"
          />
          <input
            placeholder="Wholesale price"
            value={wholesalePrice}
            onChange={e => setWholesalePrice(e.target.value)}
            required
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2 rounded"
          />
          <button className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800">
            {loading ? "Creating..." : "Create"}
          </button>
        </form>
      )}

      {/* EDIT FORM */}
      {editingProduct && (
        <form className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-4 shadow space-y-3 max-w-md rounded">
          <input
            value={editingProduct.name}
            onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2 rounded"
          />
          <textarea
            value={editingProduct.description || ""}
            onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2 rounded"
          />
          <input type="file" />
          <input
            type="number"
            value={editingProduct.retailPrice}
            onChange={e => setEditingProduct({ ...editingProduct, retailPrice: Number(e.target.value) })}
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2 rounded"
          />
          <input
            type="number"
            value={editingProduct.wholesalePrice}
            onChange={e => setEditingProduct({ ...editingProduct, wholesalePrice: Number(e.target.value) })}
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2 rounded"
          />
          <button className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800">
            Save
          </button>
        </form>
      )}

      {/* PRODUCTS GRID */}
      <div className="grid md:grid-cols-3 gap-4">
        {products.map(p => (
          <div
            key={p.id}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-4 rounded shadow space-y-2"
          >
            {p.imageUrl && (
              <Image
                src={p.imageUrl}
                alt={p.name}
                width={400}
                height={200}
                className="rounded object-cover"
              />
            )}

            <h3 className="font-semibold text-gray-900 dark:text-white">{p.name}</h3>
            <p className="text-gray-700 dark:text-gray-300">Retail ₹{p.retailPrice}</p>
            <p className="text-gray-700 dark:text-gray-300">Wholesale ₹{p.wholesalePrice}</p>

            <button
              onClick={() => toggleStatus(p.id, !p.isActive)}
              className="border border-gray-300 dark:border-gray-600 px-3 py-1 rounded text-sm text-gray-800 dark:text-gray-200"
            >
              {p.isActive ? "Disable" : "Enable"}
            </button>

            <button
              onClick={() => toggleInStock(p)}
              className="border border-gray-300 dark:border-gray-600 px-3 py-1 rounded text-sm text-gray-800 dark:text-gray-200"
            >
              {p.inStock ? "In Stock" : "Out of Stock"}
            </button>

            <button
              onClick={() => setEditingProduct(p)}
              className="border border-gray-300 dark:border-gray-600 px-3 py-1 rounded text-sm text-gray-800 dark:text-gray-200"
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>

  );
}
