"use client"

export default function DiwaliEffect() {
  return (
    <div className="pointer-events-none fixed inset-0 z-10">
      <div className="absolute inset-0 animate-pulse bg-[radial-gradient(circle,rgba(255,215,0,0.15),transparent_60%)]" />
    </div>
  )
}
