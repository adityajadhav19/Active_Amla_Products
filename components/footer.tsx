import Link from "next/link"
import { Leaf, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-full">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold">Active Products</div>
                <div className="text-sm text-gray-400">Since 2010</div>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Two generations of tradition bringing you the finest Amla products from the heart of Maharashtra.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-green-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-400 hover:text-green-400 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-green-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-green-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Products</h3>
            <a href="/products">
            <ul className="space-y-2">
              <li className="text-gray-400">Amla Candy </li>
              <li className="text-gray-400">Amla Supari</li>
              <li className="text-gray-400">Amla Pickle</li>
              <li className="text-gray-400">Amla Murabba</li>
              <li className="text-gray-400">Amla Morawala</li>
              <li className="text-gray-400">Spicy Amla Candy</li>
              <li className="text-gray-400">Amla Juice</li>
              <li className="text-gray-400">Amla Churna</li>
            </ul>
            </a>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div className="text-gray-400 text-sm">
                  <a href="https://maps.app.goo.gl/Lpm8ivoFYtgh3HHn7">Gopikishan Nagar
                  <br />
                  Jalna, Maharashtra 431203</a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-green-400 flex-shrink-0" />
                <div className="text-gray-400 text-sm">+91 7020513097</div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-green-400 flex-shrink-0" />
                <div className="text-gray-400 text-sm">info@activeproducts.in</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Active Products. All rights reserved. Made with ❤️ in Maharashtra.
          </p>
        </div>
      </div>
    </footer>
  )
}
