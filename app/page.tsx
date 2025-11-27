"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Leaf, Heart, Award } from "lucide-react"
import { products } from "@/lib/products"
import WhatsAppButton from "@/components/whatsapp-button"

export default function HomePage() {
  const featuredProducts = products.slice(0, 3)

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
                  src="/6_in_1.jpg"
                  alt="Fresh Amla Candy"
                  width={600}
                  height={500}
                  className="object-cover"
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

      {/* Featured Products */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge className="mb-4">Featured Products</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Best Sellers</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most loved Amla products, each crafted with the finest ingredients and traditional methods
              for authentic taste and maximum health benefits.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <div className="relative overflow-hidden rounded-t-lg">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={400}
                    height={300}
                    className="object-cover h-64 w-full group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4 bg-green-600">Bestseller</Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-green-600">{product.price}</span>
                    <span className="text-sm text-gray-500">{product.weight}</span>
                  </div>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      const message = `Hi! I'm interested in ordering ${product.name} (${product.price}). Please provide more details.`
                      window.open(
                        `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
                        "_blank",
                      )
                    }}
                  >
                    Order on WhatsApp
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline">
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-50 to-yellow-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <Image
                src="/placeholder.svg?height=400&width=500"
                alt="Traditional Amla Processing"
                width={500}
                height={400}
                className="rounded-2xl shadow-lg"
              />
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
            <div className="space-y-6">
              <Badge className="bg-yellow-100 text-yellow-800">Our Story</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Three Generations of <span className="text-green-600">Amla Excellence</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Founded in 2010. Mrs. Sanjiwani Ashok Jadhav in the heart of Maharashtra, Active Amla Delights began as a
                small family venture with a simple mission: to share the incredible health benefits of Amla with
                everyone.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Today, we continue this legacy with the same dedication to quality and tradition. Our products are made
                using only the finest Amla sourced directly from local farmers, ensuring freshness and supporting our
                community.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">38+</div>
                  <div className="text-gray-600">Years of Excellence</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">500+</div>
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
