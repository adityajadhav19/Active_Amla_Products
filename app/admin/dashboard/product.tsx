"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchWithCSRF } from "@/lib/fetchWithCSRF";

type Product = {
  id: number;
  name: string;
  description?: string;
  slug: string;
  imageUrl?: string;
  retailPrice: number;
  wholesalePrice: number;
  isActive: boolean;
  inStock: boolean;
};

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

  async function fetchProducts() {
    const res = await fetch("/api/admin/product", { credentials: "include" });
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
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
        <h2 className="text-lg font-semibold">Products</h2>
        <button onClick={() => setShowForm(true)} className="bg-green-700 text-white px-4 py-2 rounded">
          + Add Product
        </button>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {/* CREATE FORM */}
      {showForm && (
        <form onSubmit={handleCreateProduct} className="bg-white p-4 shadow space-y-3 max-w-md rounded">
          <input value={name} placeholder="Name of Product" onChange={e => setName(e.target.value)} required className="w-full border p-2 rounded" />
          <textarea value={description} placeholder="Description of Product" onChange={e => setDescription(e.target.value)} className="w-full border p-2 rounded" />
          <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} />
          <input value={retailPrice} placeholder="Retail Price" onChange={e => setRetailPrice(e.target.value)} required className="w-full border p-2 rounded" />
          <input value={wholesalePrice} placeholder="Wholesale Price" onChange={e => setWholesalePrice(e.target.value)} required className="w-full border p-2 rounded" />
          <button className="bg-green-700 text-white px-4 py-2 rounded">{loading ? "Creating..." : "Create"}</button>
        </form>
      )}

      {/* EDIT FORM */}
      {editingProduct && (
        <form onSubmit={handleUpdateProduct} className="bg-white p-4 shadow space-y-3 max-w-md rounded">
          <input value={editingProduct.name} placeholder="Name of Product" onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} />
          <textarea value={editingProduct.description || ""} placeholder="Description of Product" onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })} />
          <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} />
          <input type="number" value={editingProduct.retailPrice} placeholder="Retail Price" onChange={e => setEditingProduct({ ...editingProduct, retailPrice: Number(e.target.value) })} />
          <input type="number" value={editingProduct.wholesalePrice} placeholder="Wholesale Price" onChange={e => setEditingProduct({ ...editingProduct, wholesalePrice: Number(e.target.value) })} />
          <button className="bg-green-700 text-white px-4 py-2 rounded">Save</button>
        </form>
      )}

      {/* PRODUCTS GRID unchanged */}
        <div className="grid md:grid-cols-3 gap-4">
        {products.map(p => (
          <div key={p.id} className="bg-white border p-4 rounded shadow space-y-2">
            {p.imageUrl && (
              <Image src={p.imageUrl} alt={p.name} width={400} height={200} className="rounded object-cover" />
            )}
            <h3 className="font-semibold">{p.name}</h3>
            <p>Retail ₹{p.retailPrice}</p>
            <p>Wholesale ₹{p.wholesalePrice}</p>

            <button onClick={() => toggleStatus(p.id, !p.isActive)} className="border px-3 py-1 rounded text-sm">
              {p.isActive ? "Disable" : "Enable"}
            </button>

            <button onClick={() => toggleInStock(p)} className="border px-3 py-1 rounded text-sm">
              {p.inStock ? "In Stock" : "Out of Stock"}
            </button>

            <button onClick={() => setEditingProduct(p)} className="border px-3 py-1 rounded text-sm">
              Edit
            </button>
          </div>
        ))}
      </div>
   
    </div>
  );
}
