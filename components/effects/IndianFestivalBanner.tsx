"use client"

export default function IndiaFestivalBanner() {
  const today = new Date()
  const day = today.getDate()
  const month = today.getMonth()

  let text = ""

  if (day === 26 && month === 0) {
    text = " Happy Republic Day — Proudly Made in India"
  }

  if (day === 15 && month === 7) {
    text = " Happy Independence Day — Celebrating India's Spirit"
  }

  if (!text) return null

  return (
    <div className="w-full bg-gradient-to-r from-orange-500 via-white to-green-600 text-center py-2 text-sm font-medium text-gray-900 shadow-sm">
      {text}
    </div>
  )
}
