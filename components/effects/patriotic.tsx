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
      duration: 6 + Math.random() * 6, // different speeds
    }))

    setParticles(generated)
  }, [])

  if (!particles) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full opacity-20 animate-float"
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
