"use client";

import { useEffect, useState } from "react";



export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
   const [form, setForm] = useState({
    addressLine1: "",
    addressLine2: "",
    mapLink:"",
    city: "",
    state: "",
    pincode: "",
  });
  async function saveProfile() {
    await fetch("/api/traders/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });

    alert("Profile updated");
  }

async function fetchProfile() {
  try {
    const res = await fetch("/api/traders/profile", {
      credentials: "include",
    });

    if (!res.ok) {
      console.error("FETCH_PROFILE_FAILED:", res.status);
      return;
    }

    const text = await res.text();

    if (!text) {
      console.warn("Empty profile response");
      return;
    }

    const data = JSON.parse(text);
    setProfile(data);
  } catch (err) {
    console.error("FETCH_PROFILE_ERROR:", err);
  }
}


  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/traders/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldPassword, newPassword }),
      credentials: "include",
    });

    if (res.ok) {
      alert("Password changed. Please login again.");
      window.location.href = "/login";
    } else {
      alert("Failed to change password");
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="space-y-8">

      {/* ACCOUNT INFO */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Account Info</h3>
        <p>Name: {profile.name}</p>
        <p>Email: {profile.email}</p>
        <p>Role: {profile.role}</p>
      </div>

      {/* CHANGE PASSWORD */}
      <form
        onSubmit={changePassword}
        className="bg-white p-4 rounded shadow space-y-3 max-w-md"
      >
        <h3 className="font-semibold">Change Password</h3>

        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />

        <button
          disabled={loading}
          className="bg-green-700 text-white px-4 py-2 rounded"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
        <h2 className="text-lg font-semibold">Shop Address</h2>

      {Object.keys(form).map((key) => (
        <input
          key={key}
          placeholder={key}
          value={(form as any)[key]}
          onChange={(e) =>
            setForm({ ...form, [key]: e.target.value })
          }
          className="w-full border px-3 py-2 rounded"
        />
      ))}

      <button
        onClick={saveProfile}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Save
      </button>
      </form>
        

      {/* ORDER HISTORY */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Order History</h3>



       
      </div>

    </div>
  );
}
