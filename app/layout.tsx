// app/layout.tsx
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import IndiaFestivalBanner from "@/components/effects/IndianFestivalBanner"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import SeasonalEffects from "@/components/effects/SeasonalEffect" // ✅ ADD

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Active Products | Natural Amla Candy, Juice & Churna from Maharashtra",
    template: "%s | Active Products",
  },
  description:
    "Active Products offers natural Amla Candy, Amla Juice, and Amla Churna made using traditional Maharashtra recipes. Healthy, Vitamin C rich, and preservative-free Amla products.",
  keywords: [
    "Amla candy",
    "Amla juice",
    "Amla churna",
    "Amla products",
    "Buy amla products online",
    "Natural amla products",
    "Indian gooseberry products",
    "Healthy traditional snacks",
    "Maharashtra amla products",
  ],
  authors: [{ name: "Active Products" }],
  creator: "Active Products",
  publisher: "Active Products",
  metadataBase: new URL("https://activeproducts.in"),
  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://activeproducts.in",
    siteName: "Active Products",
    title: "Natural Amla Products from Maharashtra | Active Products",
    description:
      "Shop traditional Amla Candy, Juice, and Churna made naturally in Maharashtra.",
    images: [
      {
        url: "/1.png",
        width: 1200,
        height: 630,
        alt: "Active Products Amla Range",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Active Products | Natural Amla Candy, Juice & Churna",
    description:
      "Healthy traditional Amla products made in Maharashtra.",
    images: ["/1.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        
        {/* 🌟 Seasonal / Festival Effects */}
        <SeasonalEffects />
        <IndiaFestivalBanner/>
        <Navbar />

        {/* Page content grows to push footer */}
        <main className="flex-1">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  )
}
