"use client"

export default function KiteEffect() {
  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      
      {/* Bottom Left Kites */}
      <div className="absolute bottom-0 left-0 animate-kite-left text-4xl">
        🪁
      </div>
      <div className="absolute bottom-10 left-16 animate-kite-left-slow text-3xl">
        🪁
      </div>

      {/* Bottom Right Kites */}
      <div className="absolute bottom-0 right-0 animate-kite-right text-4xl">
        🪁
      </div>
      <div className="absolute bottom-12 right-20 animate-kite-right-slow text-3xl">
        🪁
      </div>

    </div>
  )
}
