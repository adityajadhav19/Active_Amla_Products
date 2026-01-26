"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Product = {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  retailPrice: number;
  wholesalePrice: number;
  isActive: boolean;
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

  // form state
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

      if (!res.ok) throw new Error("Fetch failed");

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

        const uploadRes = await fetch("/api/admin/product/upload", {
          method: "POST",
          body: fd,
          credentials: "include",
        });

        if (!uploadRes.ok) throw new Error("Image upload failed");

        const uploadData = await uploadRes.json();
        imageUrl = uploadData.imageUrl;
      }

      const res = await fetch("/api/admin/product", {
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

      if (!res.ok) throw new Error("Create failed");

      setShowForm(false);
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error(err);
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

  /* ---------------- STATUS ---------------- */

  async function toggleStatus(id: number, isActive: boolean) {
    await fetch(`/api/admin/product/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ isActive }),
    });
    fetchProducts();
  }

/* handle update */

  async function handleUpdateProduct(e: React.FormEvent) {
  e.preventDefault();
  if (!editingProduct) return;

  let imageUrl = editingProduct.imageUrl;

  // upload new image if selected
  if (imageFile) {
    const formData = new FormData();
    formData.append("file", imageFile);

    const uploadRes = await fetch("/api/admin/product/upload", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const uploadData = await uploadRes.json();
    imageUrl = uploadData.imageUrl;
  }

  const res = await fetch(`/api/admin/product/${editingProduct.id}`, {
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

  if (!res.ok) {
    alert("Failed to update product");
    return;
  }

  setEditingProduct(null);
  setImageFile(null);
  fetchProducts();
}


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Products</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-700 text-white px-4 py-2 rounded"
        >
          + Add Product
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </p>
      )}

      {/* Create Form */}
      {showForm && (
        <form
          onSubmit={handleCreateProduct}
          className="bg-white p-4 rounded-lg shadow max-w-md space-y-3"
        >
          <input
            placeholder="Product name"
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
          />

          <input
            placeholder="Retail price"
            value={retailPrice}
            onChange={(e) => setRetailPrice(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />

          <input
            placeholder="Wholesale price"
            value={wholesalePrice}
            onChange={(e) => setWholesalePrice(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />

          <div className="flex gap-2">
            <button
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
      required
      className="w-full border px-3 py-2 rounded"
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
    />

    <input
      type="number"
      value={editingProduct.retailPrice}
      onChange={(e) =>
        setEditingProduct({
          ...editingProduct,
          retailPrice: Number(e.target.value),
        })
      }
      required
      className="w-full border px-3 py-2 rounded"
    />

    <input
      type="number"
      value={editingProduct.wholesalePrice}
      onChange={(e) =>
        setEditingProduct({
          ...editingProduct,
          wholesalePrice: Number(e.target.value),
        })
      }
      required
      className="w-full border px-3 py-2 rounded"
    />

    <div className="flex gap-2">
      <button
        type="submit"
        className="bg-green-700 text-white px-4 py-2 rounded"
      >
        Save Changes
      </button>

      <button
        type="button"
        onClick={() => {
          setEditingProduct(null);
          setImageFile(null);
        }}
        className="border px-4 py-2 rounded"
      >
        Cancel
      </button>
    </div>
  </form>
)}


      {/* Products */}
      <div className="grid md:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="bg-white p-4 rounded shadow space-y-2">
            {p.imageUrl && (
              <img
                src={p.imageUrl}
                alt={p.name}
                width={400}
                height={200}
                className="rounded object-cover"
              />
            )}

            <h3 className="font-semibold">{p.name}</h3>
            <p className="text-sm">Retail ₹{p.retailPrice}</p>
            <p className="text-sm">Wholesale ₹{p.wholesalePrice}</p>

            <span
              className={`text-xs px-2 py-1 rounded ${
                p.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {p.isActive ? "Active" : "Disabled"}
            </span>

            <button
              onClick={() => toggleStatus(p.id, !p.isActive)}
              className="block text-sm border px-3 py-1 rounded"
            >
              {p.isActive ? "Disable" : "Enable"}
            </button>
            <button
            onClick={async()=>
            {
              await fetch(`/api/admin/products/${products.id}`)
            }
            }></button>
            
            {editingProduct?.id === p.id && (
  <span className="text-xs text-blue-600">Editing…</span>
)}
            <button
  onClick={() => {
    setEditingProduct(p);
    setShowForm(false);
  }}
  className="border px-3 py-1 rounded text-sm"
>
  Edit
</button>
          </div>
        ))}
      </div>
    </div>
  );
}
