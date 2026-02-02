"use client"

import { useEffect, useState } from "react"

export default function DiwaliEffect() {
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
    <div className="pointer-events-none fixed inset-0 z-10">
      <div
        className={`absolute inset-0 animate-pulse ${
          isDark
            ? "bg-[radial-gradient(circle,rgba(255,200,0,0.12),transparent_65%)]"
            : "bg-[radial-gradient(circle,rgba(255,215,0,0.20),transparent_60%)]"
        }`}
      />
    </div>
  )
}
