"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, Sun, Moon } from "lucide-react"
import { fetchWithCSRF } from "@/lib/fetchWithCSRF"

type AuthUser = {
  name: string
  role: "ADMIN" | "TRADER" | "USER"
}

function getInitials(name?: string) {
  if (!name) return "U"
  return name.trim().split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [openProfile, setOpenProfile] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [dark, setDark] = useState(false)
  const router = useRouter()

  const whatsappNumber = process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Find Shop nearby", href: "/user/traders" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  async function fetchUser() {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" })
      if (!res.ok) return setUser(null)
      setUser(await res.json())
    } catch {
      setUser(null)
    }
  }

  useEffect(() => {
    fetchUser()
    const saved = localStorage.getItem("theme")
    if (saved === "dark") {
      document.documentElement.classList.add("dark")
      setDark(true)
    }
  }, [])

  function toggleTheme() {
    const isDark = document.documentElement.classList.toggle("dark")
    setDark(isDark)
    localStorage.setItem("theme", isDark ? "dark" : "light")
  }

  function handleNavClick(href: string) {
    setIsOpen(false)
    router.push(href)
  }

  function openWhatsApp() {
    if (!whatsappNumber) return
    const msg = "Hi! I'm interested in your Amla products."
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`)
  }

  async function handleLogout() {
    await fetchWithCSRF("/api/auth/logout", { method: "POST" })
    setUser(null)
    setIsOpen(false)
    router.push("/")
  }

  return (
    <nav className="bg-gradient-to-r from-green-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex justify-between items-center h-16">

          <Link href="/" className="flex items-center space-x-3">
            <img src="/1.png" alt="logo" className="w-36 rounded" />
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map(item => (
              <Link key={item.name} href={item.href} className="text-gray-700 dark:text-gray-200 hover:text-green-600 font-medium">
                {item.name}
              </Link>
            ))}

            {(user?.role === "ADMIN" || user?.role === "TRADER") && (
              <Link href="/trader/products" className="text-green-700 font-semibold">Wholesale Products</Link>
            )}
            {user?.role === "ADMIN" && (
              <Link href="/admin/dashboard" className="text-green-700 font-semibold">Admin</Link>
            )}
            {user?.role === "TRADER" && (
              <Link href="/trader/dashboard" className="text-green-700 font-semibold">Trader</Link>
            )}

            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            <Button className="bg-green-600 hover:bg-green-700" onClick={openWhatsApp}>
              Order Now
            </Button>

            {!user ? (
              <Button className="bg-green-600 hover:bg-green-700">
                <Link href="/login">Login</Link>
              </Button>
            ) : (
              <div className="relative">
                <button onClick={() => setOpenProfile(!openProfile)} className="w-9 h-9 rounded-full bg-green-700 text-white flex items-center justify-center">
                  {getInitials(user.name)}
                </button>
                {openProfile && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg border text-sm">
                    <div className="px-4 py-2">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.role}</p>
                    </div>
                    <hr />
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* MOBILE BUTTON */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* MOBILE NAV */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[70vh]" : "max-h-0 overflow-hidden"}`}>
          <div className="border-t bg-white dark:bg-gray-900 px-2 pt-2 pb-3 space-y-1 overflow-y-auto">

            {navigation.map(item => (
              <button key={item.name} onClick={() => handleNavClick(item.href)} className="block w-full text-left px-3 py-2">
                {item.name}
              </button>
            ))}

            {(user?.role === "ADMIN" || user?.role === "TRADER") && (
              <button onClick={() => handleNavClick("/trader/products")} className="block px-3 py-2">Wholesale Products</button>
            )}
            {user?.role === "ADMIN" && (
              <button onClick={() => handleNavClick("/admin/dashboard")} className="block px-3 py-2">Admin</button>
            )}
            {user?.role === "TRADER" && (
              <button onClick={() => handleNavClick("/trader/dashboard")} className="block px-3 py-2">Trader</button>
            )}

            <Button variant="ghost" size="sm" onClick={toggleTheme} className="w-full justify-start">
              {dark ? "Light Mode" : "Dark Mode"}
            </Button>

            {!user ? (
              <button onClick={() => handleNavClick("/login")} className="block px-3 py-2 text-green-700">Login</button>
            ) : (
              <button onClick={handleLogout} className="block px-3 py-2 text-red-600">Logout</button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
