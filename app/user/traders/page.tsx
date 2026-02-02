"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";

type Trader = {
  id: number;
  name: string;
  phone?: string;
  city?: string;
  addressLine1?: string;
  mapLink?: string;
};

function normalizeMapLink(link?: string) {
  if (!link) return null;
  const trimmed = link.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  return `https://${trimmed}`;
}

export default function TraderListPage() {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [traders, setTraders] = useState<Trader[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchSuggestions(value: string) {
    setCity(value);
    if (value.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(`/api/user/trader-cities?q=${encodeURIComponent(value)}`);
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data)) setSuggestions(data);
    } catch {
      setSuggestions([]);
    }
  }

  async function fetchTraders(selectedCity?: string) {
    const finalCity = (selectedCity ?? city).trim();
    if (!finalCity) return;

    setLoading(true);
    setError("");
    setTraders([]);
    setSuggestions([]);

    try {
      const res = await fetch(`/api/user/traders?city=${encodeURIComponent(finalCity)}`);
      if (!res.ok) throw new Error("Failed to fetch traders");
      const data = await res.json();
      if (Array.isArray(data)) setTraders(data);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-6">

        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          Find Traders Near You
        </h1>

        <div className="relative">
          <div className="flex gap-2">
            <input
              value={city}
              onChange={(e) => fetchSuggestions(e.target.value)}
              placeholder="Enter your city (e.g. Jalna)"
              className="flex-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <button
              onClick={() => fetchTraders()}
              disabled={!city.trim()}
              className="bg-green-600 hover:bg-green-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Search
            </button>
          </div>

          {suggestions.length > 0 && (
            <div className="absolute z-20 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg mt-1 shadow">
              {suggestions.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setCity(c);
                    fetchTraders(c);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading && <p className="text-center text-sm text-gray-500 dark:text-gray-400">Loading traders...</p>}
        {error && <p className="text-center text-sm text-red-500 dark:text-red-400">{error}</p>}
        {!loading && !error && traders.length === 0 && city && (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">No traders found in this city.</p>
        )}

        <div className="space-y-4">
          {traders.map((trader) => {
            const mapUrl = normalizeMapLink(trader.mapLink);
            return (
              <div key={trader.id} className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 space-y-3">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">🏪 {trader.name}</p>

                  {trader.city && (
                    <span className="inline-block mt-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">
                      {trader.city}
                    </span>
                  )}
                </div>

                {(trader.addressLine1 || trader.city) && (
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    📍 {trader.addressLine1}
                    {trader.addressLine1 && trader.city ? ", " : ""}
                    {trader.city}
                  </p>
                )}

                <div className="flex gap-3 pt-2">
                  {trader.phone && (
                    <a
                      href={`https://wa.me/91${trader.phone}?text=${encodeURIComponent(
                        "Hello, I found your shop on activeproducts.in"
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center bg-green-600 hover:bg-green-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white py-2 rounded-lg text-sm font-medium"
                    >
                      WhatsApp
                    </a>
                  )}

                  {mapUrl ? (
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      📍 Visit Shop
                    </a>
                  ) : (
                    <button
                      disabled
                      className="flex-1 text-center border border-gray-200 dark:border-gray-700 text-gray-400 py-2 rounded-xl text-sm cursor-not-allowed"
                    >
                      📍 Location not available
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
