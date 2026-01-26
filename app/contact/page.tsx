"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import WhatsAppButton from "@/components/whatsapp-button";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    company: "", // 🐝 Honeypot
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed");

      setSuccess(true);
      setFormData({ name: "", email: "", message: "", company: "" });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-16">

        {/* HEADER */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">
            Contact <span className="text-green-600">Us</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions or want to place an order? We’d love to hear from you.
          </p>
        </div>

        {/* CONTENT */}
        <div className="grid md:grid-cols-2 gap-12">

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-2xl shadow space-y-5"
          >
            {/* Honeypot (hidden) */}
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <input
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full border p-3 rounded-lg"
            />

            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full border p-3 rounded-lg"
            />

            <textarea
              name="message"
              required
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              rows={5}
              className="w-full border p-3 rounded-lg"
            />

            <button
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>

            {/* SUCCESS ANIMATION */}
            {success && (
              <div className="animate-fade-in text-green-700 bg-green-50 border border-green-200 p-4 rounded-lg text-center">
                ✅ Message sent successfully! We’ll contact you soon.
              </div>
            )}

            {error && (
              <p className="text-red-600 text-center">{error}</p>
            )}
          </form>

          {/* INFO */}
          <div className="space-y-6">
            <Info icon={MapPin} title="Visit Us">
              Gopikishan Nagar, Jalna<br />Maharashtra 431203
            </Info>

            <Info icon={Phone} title="Call Us">
              +91 7020513097
            </Info>

            <Info icon={Mail} title="Email">
              info@activeproducts.in
            </Info>

            <Info icon={Clock} title="Working Hours">
              Mon–Sat: 9 AM – 7 PM
            </Info>
          </div>
        </div>

        {/* MAP */}
        <div className="rounded-2xl overflow-hidden shadow">
          <iframe
            src="https://www.google.com/maps?q=Gopikishan+Nagar+Jalna+Maharashtra&output=embed"
            className="w-full h-96"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <WhatsAppButton />
      </div>

      {/* Animation */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}

function Info({ icon: Icon, title, children }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow flex gap-4">
      <div className="bg-green-100 p-3 rounded-full">
        <Icon className="w-6 h-6 text-green-600" />
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-gray-600 text-sm">{children}</p>
      </div>
    </div>
  );
}
