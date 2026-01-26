"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Leaf, Heart, Award } from "lucide-react"
import { useEffect, useState } from "react"
import WhatsAppButton from "@/components/whatsapp-button"

type Product = {
  id: number
  name: string
  imageUrl?: string
  retailPrice: number
}



export default function HomePage() {
const [featured, setFeatured] = useState<Product[]>([])
const [loading, setLoading] = useState(true);
const [showGif, setShowGif] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch("/api/products/featured");
        const data = await res.json();
        if (Array.isArray(data)) setFeatured(data)
        }catch (error) {
        console.error("FETCH_FEATURED_PRODUCTS_ERROR:", error);
      }finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  } , []);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGif(false);
    }, 3000); // match GIF duration

    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-50 to-yellow-50 py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                <Leaf className="w-4 h-4 mr-2" />
                100% Natural & Traditional
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Naturally Healthy, <span className="text-green-600">Traditionally Made</span> Amla Candy
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Experience the authentic taste of Maharashtra's finest Amla products, crafted with love using
                time-honored family recipes passed down through generations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  <Link href="/products">Shop Now</Link>
                </Button>
                <Button size="lg" variant="outline">
                  <Link href="/about">Our Story</Link>
                </Button>
              </div>
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-2 text-gray-600">500+ Happy Customers</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/heropage.jpg"
                  alt="Fresh Amla Candy"
                  width={600}
                  height={500}
                  className="object-cover "
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Heart className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Health Benefits</p>
                    <p className="text-sm text-gray-600">Rich in Vitamin C</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*Testimonials*/ }
      <section className="bg-green-50 py-16 px-4">
  <div className="max-w-6xl mx-auto text-center">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">
      What People Tell Us About Our Products 🌿
    </h2>

    <p className="text-sm text-gray-500 mb-10">
      Feedback shared by customers through our contact and order channels.
    </p>

    <div className="grid md:grid-cols-3 gap-6">

      <div className="bg-white p-6 rounded-xl shadow">
        <p className="text-gray-600 text-sm">
          "Tastes very natural and not like market candy."
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <p className="text-gray-600 text-sm">
          "Feels homemade and good for daily snacking."
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <p className="text-gray-600 text-sm">
          "Loved the traditional taste and freshness."
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <p className="text-gray-600 text-sm">
          "Perfect balance of sweet and tangy, reminds me of childhood."
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <p className="text-gray-600 text-sm">
          "Good quality and nicely packed. Will order again."
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <p className="text-gray-600 text-sm">
          "Feels like a healthier option compared to regular sweets."
        </p>
      </div>

    </div>

    {/* CTA */}
    <div className="mt-10">
      <a
        href="/contact"
        className="inline-block bg-green-700 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-green-800 transition"
      >
        Share Your Feedback
      </a>
      <p className="text-xs text-gray-500 mt-2">
        We love hearing from our customers 💬
      </p>
    </div>
  </div>
</section>



      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            🌟 Featured Products
          </h2>

          <Link
            href="/products"
            className="text-green-700 text-sm font-medium"
          >
            View all →
          </Link>
        </div>

        {loading && (
          <p className="text-gray-500">Loading featured products...</p>
        )}

        {!loading && featured.length === 0 && (
          <p className="text-gray-500">
            No featured products right now
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {featured.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              {product.imageUrl && (
                <div className="relative h-48">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-gray-900">
                  {product.name}
                </h3>

                <p className="font-bold text-green-700">
                  ₹{product.retailPrice}
                </p>

                <Link
                  href="/products"
                  className="block text-center bg-green-600 text-white py-2 rounded-lg text-sm hover:bg-green-700"
                >
                  View Product
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

     {/* Our Story Section */}
<section className="py-20 px-4 bg-gradient-to-r from-green-50 to-yellow-50">
  <div className="container mx-auto max-w-6xl">
    <div className="grid md:grid-cols-2 gap-12 items-center">
      
      {/* Video Column */}
      <div className="relative">
        <video
          autoPlay
          muted
          playsInline
          className="w-full max-w-md rounded-2xl shadow-lg"
          src="/logo1.mp4"
        />

        {/* Badge */}
        <div className="absolute -top-6 -right-6 bg-white rounded-xl p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-2 rounded-full">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Since 2010</p>
              <p className="text-sm text-gray-600">Family Tradition</p>
            </div>
          </div>
        </div>
      </div>

      {/* Text Column */}
      <div className="space-y-6">
        <Badge className="bg-yellow-100 text-yellow-800">Our Story</Badge>

        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Three Generations of{" "}
          <span className="text-green-600">Amla Excellence</span>
        </h2>

        <p className="text-lg text-gray-600 leading-relaxed">
          Founded in 2010 by Mr. and Mrs. Jadhav in the heart of
          Maharashtra, Active Products began as a small family venture
          with a simple mission: to share the incredible health benefits of
          Amla with everyone.
        </p>

        <p className="text-lg text-gray-600 leading-relaxed">
          Today, we continue this legacy with the same dedication to quality
          and tradition. Our products are made using only the finest Amla
          sourced directly from local farmers.
        </p>

        <div className="grid grid-cols-2 gap-6 pt-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">16+</div>
            <div className="text-gray-600">Years of Excellence</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">1000+</div>
            <div className="text-gray-600">Happy Families</div>
          </div>
        </div>

        <Button size="lg" className="bg-green-600 hover:bg-green-700">
          <Link href="/about">Read Our Full Story</Link>
        </Button>
      </div>
    </div>
  </div>
</section>


      <WhatsAppButton />
    </div>
  )
}
