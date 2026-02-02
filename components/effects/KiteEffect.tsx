"use client"

export default function KiteEffect() {
  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden opacity-90 dark:opacity-70">
      
      {/* Bottom Left Kites */}
      <div className="absolute bottom-0 left-0 animate-kite-left text-4xl drop-shadow-md dark:drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]">
        🪁
      </div>

      <div className="absolute bottom-10 left-16 animate-kite-left-slow text-3xl drop-shadow-md dark:drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]">
        🪁
      </div>

      {/* Bottom Right Kites */}
      <div className="absolute bottom-0 right-0 animate-kite-right text-4xl drop-shadow-md dark:drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]">
        🪁
      </div>

      <div className="absolute bottom-12 right-20 animate-kite-right-slow text-3xl drop-shadow-md dark:drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]">
        🪁
      </div>

    </div>
  )
}

