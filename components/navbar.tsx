"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

type AuthUser = {
  name: string
  role: "ADMIN" | "TRADER" | "USER"
}

/* ---------- HELPER ---------- */
function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [openProfile, setOpenProfile] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)
  const router = useRouter()

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Find Shop nearby", href: "/user/traders" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  /* ---------- FETCH LOGGED IN USER ---------- */
  async function fetchUser() {
    try {
      const res = await fetch("/api/auth/me", {
        credentials: "include",
      })

      if (!res.ok) {
        setUser(null)
        return
      }

      const data = await res.json()
      setUser(data)
    } catch {
      setUser(null)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  /* ---------- LOGOUT ---------- */
  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    })

    setUser(null)
    setOpenProfile(false)
    router.push("/login")
  }

  return (
    <nav className="bg-gradient-to-r from-green-50 to-yellow-50 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex justify-between items-center h-16">

          {/* LOGO */}
          <Link href="/" className="flex items-center space-x-3">
            <img
              src="/1.png"
              alt="logo"
              className="w-36 rounded"
            />
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-green-600 font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}

            {/* ROLE LINKS */}
            {user?.role === "ADMIN" && (
              <>
                <Link
                  href="/trader/products"
                  className="text-green-700 font-semibold"
                >
                  Wholesale Products
                </Link>
                <Link
                  href="/admin/dashboard"
                  className="text-green-700 font-semibold"
                >
                  Admin
                </Link>
              </>
            )}

            {user?.role === "TRADER" && (
              <>
                <Link
                  href="/trader/products"
                  className="text-gray-700 hover:text-green-600 font-medium"
                >
                  Wholesale Products
                </Link>
                <Link
                  href="/trader/dashboard"
                  className="text-green-700 font-semibold"
                >
                  Trader
                </Link>
              </>
            )}

            {/* ORDER NOW */}
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                const message =
                  "Hi! I'm interested in your Amla products. Please share more details."
                window.open(
                  `https://wa.me/917020513097?text=${encodeURIComponent(message)}`,
                  "_blank"
                )
              }}
            >
              Order Now
            </Button>

            {/* AUTH SECTION */}
            {!user ? (
              <Button className="bg-green-600 hover:bg-green-700">
                <Link href="/login">Login</Link>
              </Button>
            ) : (
              <div className="relative">
                {/* Avatar */}
                <button
                  onClick={() => setOpenProfile(!openProfile)}
                  className="w-9 h-9 rounded-full bg-green-700 text-white flex items-center justify-center font-semibold"
                >
                  {getInitials(user.name)}
                </button>

                {/* Dropdown */}
                {openProfile && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border text-sm">
                    <div className="px-4 py-2">
                      <p className="font-medium text-gray-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user.role}
                      </p>
                    </div>

                    <hr />

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* MOBILE NAV */}
        {isOpen && (
          <div className="md:hidden border-t bg-white px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-gray-700 hover:text-green-600 font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {user?.role === "ADMIN" && (
              <>
                <Link
                  href="/trader/products"
                  className="block px-3 py-2 font-medium text-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  Wholesale Products
                </Link>
                <Link
                  href="/admin/dashboard"
                  className="block px-3 py-2 font-semibold text-green-700"
                  onClick={() => setIsOpen(false)}
                >
                  Admin Dashboard
                </Link>
              </>
            )}

            {user?.role === "TRADER" && (
              <>
                <Link
                  href="/trader/products"
                  className="block px-3 py-2 font-medium text-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  Wholesale Products
                </Link>
                <Link
                  href="/trader/dashboard"
                  className="block px-3 py-2 font-semibold text-green-700"
                  onClick={() => setIsOpen(false)}
                >
                  Trader Dashboard
                </Link>
              </>
            )}

            {!user ? (
              <Link
                href="/login"
                className="block px-3 py-2 font-medium text-green-700"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-red-600 font-medium"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
