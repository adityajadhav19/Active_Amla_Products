"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

const Confetti = dynamic(() => import("react-confetti"), { ssr: false })

export default function ConfettiEffect() {
  const [mounted, setMounted] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setMounted(true)

    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"))
    }

    checkTheme()

    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, { attributes: true })

    return () => observer.disconnect()
  }, [])

  if (!mounted) return null

  return (
    <Confetti
      numberOfPieces={isDark ? 70 : 120} // 🎯 softer in dark mode
      recycle={false}
      colors={
        isDark
          ? ["#22c55e", "#10b981", "#facc15", "#38bdf8"] // soft emerald/yellow/blue
          : ["#16a34a", "#facc15", "#ef4444", "#3b82f6"]
      }
      gravity={0.2}
    />
  )
}
