"use client"

import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function WhatsAppButton() {
  const handleWhatsAppClick = () => {
    const message = "Hi! I'm interested in your Amla products. Please share more details."// Replace with actual number
    window.open(
  `https://wa.me/${process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP}?text=${encodeURIComponent(message)}`
)

  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleWhatsAppClick}
        className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
        size="lg"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="sr-only">Contact us on WhatsApp</span>
      </Button>
    </div>
  )
}
