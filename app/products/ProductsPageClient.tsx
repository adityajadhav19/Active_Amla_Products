"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, Star } from "lucide-react"
import { products } from "@/lib/products"
import WhatsAppButton from "@/components/whatsapp-button"

export default function ProductsPageClient() {
  const handleWhatsAppOrder = (product: any) => {
    const message = `Hi! I'm interested in ordering ${product.name} (${product.price}). Please provide more details about availability and delivery.`
    window.open(
      `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank",
    )
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-green-100 text-green-800">
            <Leaf className="w-4 h-4 mr-2" />
            Our Products
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Premium <span className="text-green-600">Amla Products</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our complete range of authentic Amla products, each carefully crafted using traditional methods and
            the finest ingredients for maximum health benefits and taste.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {products.map((product) => (
            <Card
              key={product.id}
              className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden"
            >
              <div className="relative">
                <Image
                  src={product.image || "/Candy.jpg"}
                  alt={product.name}
                  width={600}
                  height={400}
                  className="object-cover h-80 w-full group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-4 left-4 bg-green-600">{product.category}</Badge>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">4.8</span>
                  </div>
                </div>
              </div>

              <CardContent className="p-8">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Key Ingredients:</h4>
                  <p className="text-sm text-gray-600">{product.ingredients}</p>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Health Benefits:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {product.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Leaf className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between mb-6 p-4 bg-green-50 rounded-lg">
                  <div>
                    <span className="text-3xl font-bold text-green-600">{product.price}</span>
                    <span className="text-gray-600 ml-2">per {product.weight}</span>
                  </div>
                  <Badge variant="outline" className="text-green-700 border-green-300">
                    In Stock
                  </Badge>
                </div>

                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
                  onClick={() => handleWhatsAppOrder(product)}
                >
                  Order on WhatsApp
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20 p-12 bg-gradient-to-r from-green-50 to-yellow-50 rounded-2xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Can't Find What You're Looking For?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            We offer custom orders and bulk quantities for special occasions. Contact us directly to discuss your
            requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Contact Us
            </Button>
            <Button size="lg" variant="outline">
              Bulk Orders
            </Button>
          </div>
        </div>
      </div>

      <WhatsAppButton />
    </div>
  )
}
