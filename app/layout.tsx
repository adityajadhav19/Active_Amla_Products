import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Active Amla Delights - Premium Traditional Amla Products | Maharashtra",
  description:
    "Discover authentic Amla products from Maharashtra. Premium Amla Candy, Juice, and Churna made with traditional recipes since 1985. 100% natural and healthy.",
  keywords:
    "Amla candy, Amla juice, Amla churna, Maharashtra Amla products, traditional Amla, natural health products, Jadhav Amla",
  authors: [{ name: "Active Amla Delights" }],
  creator: "Active Amla Delights",
  publisher: "Active Amla Delights",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://jadhavamla.com",
    siteName: "Active Amla Delights",
    title: "Active Amla Delights - Premium Traditional Amla Products",
    description: "Authentic Amla products from Maharashtra. Made with traditional recipes since 1985.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Active Amla Delights - Premium Amla Products",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Active Amla Delights - Premium Traditional Amla Products",
    description: "Authentic Amla products from Maharashtra. Made with traditional recipes since 1985.",
    images: ["/og-image.jpg"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
