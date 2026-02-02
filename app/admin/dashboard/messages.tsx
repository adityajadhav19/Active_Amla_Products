"use client";

import { useEffect, useState } from "react";


type Message = {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchMessages() {
    try {
      const res = await fetch("/api/admin/messages", {
        credentials: "include",
      });

      if (!res.ok) {
        console.error("FETCH_MESSAGES_FAILED:", res.status);
        setMessages([]);
        return;
      }

      const data = await res.json();
      if (Array.isArray(data)) setMessages(data);
    } catch (err) {
      console.error("FETCH_MESSAGES_ERROR:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMessages();
  }, []);

  if (loading) {
    return <p className="text-center py-6">Loading messages...</p>;
  }

  if (messages.length === 0) {
    return (
      <p className="text-center text-gray-500 py-6">
        No contact messages yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        Contact Messages
      </h2>

      {messages.map((msg) => (
        <div
          key={msg.id}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm space-y-2"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {msg.name}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {msg.email}
              </p>
            </div>

            <span className="text-xs text-gray-400 dark:text-gray-500">
              {new Date(msg.createdAt).toLocaleString()}
            </span>
          </div>

          <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-line">
            {msg.message}
          </p>

          <a
            href={`mailto:${msg.email}`}
            className="inline-block text-sm text-green-700 dark:text-green-400 hover:underline"
          >
            Reply via Email
          </a>
        </div>
      ))}
    </div>

  );
}
