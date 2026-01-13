"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, Leaf } from "lucide-react"

type AuthUser = {
  name: string
  role: "ADMIN" | "TRADER" | "USER"
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)
  const router = useRouter()

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  /* ---------------- FETCH LOGGED IN USER ---------------- */
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

  /* ---------------- LOGOUT ---------------- */
  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    })

    setUser(null)
    router.push("/login")
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex justify-between items-center h-16">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="bg-green-600 p-2 rounded-full">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                Active Amla Delights
              </div>
              <div className="text-xs text-gray-600">Since 2010</div>
            </div>
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
                  wholesale Products
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

            {/* AUTH ACTIONS */}
            {!user ? (
              <Button className="bg-green-600 hover:bg-green-700">
                <Link href="/login">Login</Link>
              </Button>
            ) : (
              <div className="flex items-center gap-3">
                <div className="text-right text-sm">
                  <p className="font-medium">{user.name}</p>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {user.role}
                  </span>
                </div>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
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
                className="block px-3 py-2 font-medium text-grey-700"
                onClick={()=>setIsOpen(false)}
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
                className="block px-3 py-2 font-medium text-grey-700"
                onClick={()=>setIsOpen(false)}
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
