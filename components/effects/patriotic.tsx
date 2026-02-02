"use client"

import { useEffect, useState } from "react"

type Particle = {
  size: number
  left: number
  top: number
  color: string
  duration: number
}

export default function PatrioticEffect() {
  const [particles, setParticles] = useState<Particle[] | null>(null)

  useEffect(() => {
    const generated = [...Array(15)].map((_, i) => ({
      size: 6 + Math.random() * 6,
      left: Math.random() * 100,
      top: Math.random() * 100,
      color: i % 3 === 0 ? "#FF9933" : i % 3 === 1 ? "#FFFFFF" : "#138808",
      duration: 6 + Math.random() * 6,
    }))

    setParticles(generated)
  }, [])

  if (!particles) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden opacity-70 dark:opacity-50">
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full animate-float shadow-sm dark:shadow-[0_0_8px_rgba(255,255,255,0.3)]"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.left}%`,
            top: `${p.top}%`,
            backgroundColor: p.color,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

