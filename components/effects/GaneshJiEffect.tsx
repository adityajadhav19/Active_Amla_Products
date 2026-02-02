"use client"

import { useEffect, useState } from "react"

export default function GaneshJiEffect() {
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

  return (
    <div className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center">
      <div
        className={`w-96 h-96 rounded-full animate-pulse ${
          isDark
            ? "bg-orange-400 opacity-10"
            : "bg-orange-300 opacity-20"
        }`}
      />
    </div>
  )
}
