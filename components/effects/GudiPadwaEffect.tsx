"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
export default function GudiPadwaEffect() {
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
    <>
      {/* 🌿 TORAN FULL WIDTH RESPONSIVE */}
      <div className="pointer-events-none fixed left-0 w-full z-50 top-[60px] md:top-[48px]">
        <Image
          src="/toran.png"
          alt="Toran"
          width={2000}
          height={150}
          className="w-full h-auto object-cover"
          priority
        />
      </div>

      {/* 🪔 GUDHI PLACEHOLDER (LEFT SIDE) */}
   

      {/* ✨ Soft festive glow */}
      <div className="pointer-events-none fixed inset-0 z-30 bg-[radial-gradient(circle,rgba(255,215,0,0.08),transparent_65%)]" />
    </>

  )
}
