"use client"

export default function GudiPadwaEffect() {
  return (
    <div className="pointer-events-none fixed inset-0 z-10">
      {/* Toran (top decoration) */}
      <div className="absolute top-0 left-0 w-full h-10 bg-gradient-to-r from-green-700 via-yellow-500 to-green-700 opacity-80" />

      {/* Auspicious glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,215,0,0.12),transparent_60%)]" />
    </div>
  )
}
