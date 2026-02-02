"use client"

import { useEffect, useState } from "react"

export default function IndiaFestivalBanner() {
  const today = new Date()
  const day = today.getDate()
  const month = today.getMonth()

  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"))
    }

    checkTheme()
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, { attributes: true })

    return () => observer.disconnect()
  }, [])

  let text = ""

  if (day === 26 && month === 0) {
    text = " Happy Republic Day — Proudly Made in India"
  }

  if (day === 15 && month === 7) {
    text = " Happy Independence Day — Celebrating India's Spirit"
  }

  if (!text) return null

  return (
    <div
      className={`w-full text-center py-2 text-sm font-medium shadow-sm ${
        isDark
          ? "bg-gradient-to-r from-orange-600 via-gray-900 to-green-700 text-white"
          : "bg-gradient-to-r from-orange-500 via-white to-green-600 text-gray-900"
      }`}
    >
      {text}
    </div>
  )
}

