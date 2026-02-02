"use client"

import dynamic from "next/dynamic"

// ❄️ Load snowfall only on client — no SSR
const Snowfall = dynamic(() => import("react-snowfall"), { ssr: false })

export default function SnowEffect() {
  return (
    <div className="pointer-events-none fixed inset-0 z-40">
      <Snowfall
        snowflakeCount={80}
        style={{ opacity: 0.8 }}
        color="#ffffff"
      />
    </div>
  )
}
