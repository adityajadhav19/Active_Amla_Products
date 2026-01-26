"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

// 🚫 Prevent SSR
const Confetti = dynamic(() => import("react-confetti"), { ssr: false })

export default function ConfettiEffect() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return <Confetti numberOfPieces={120} recycle={false} />
}
