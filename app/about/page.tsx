import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Award, Users, Leaf, Heart, Clock, MapPin } from "lucide-react"
import WhatsAppButton from "@/components/whatsapp-button"

export const metadata = {
  title: "About Us - Active Products | Our Story & Heritage",
  description:
    "Learn about Active Products' journey since 2010. Discover our family tradition, commitment to quality, and passion for bringing you the finest Amla products.",
}

export default function AboutPage() {
  const timeline = [
    { year: "2010", title: "The Beginning", description: "Sanjiwani Ashok Jadhav started our family business with a small Amla processing unit in Maharashtra." },
    { year: "2012", title: "Expansion", description: "Expanded our product range and started supplying to local markets across Maharashtra." },
    { year: "2013", title: "Quality Certification", description: "Obtained food safety certifications and modernized our processing methods while maintaining traditional recipes." },
    { year: "2017", title: "Digital Presence", description: "Launched our online presence and started serving customers across India." },
    { year: "2025", title: "New Generation", description: "Second generation joins the business, bringing fresh ideas while preserving our heritage." },
  ]

  const values = [
    { icon: <Leaf className="w-8 h-8 text-green-600 dark:text-emerald-400" />, title: "100% Natural", description: "We use only natural ingredients without any artificial preservatives or colors." },
    { icon: <Heart className="w-8 h-8 text-red-500 dark:text-red-400" />, title: "Made with Love", description: "Every product is crafted with care and attention to detail, just like homemade." },
    { icon: <Award className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />, title: "Quality First", description: "We never compromise on quality and maintain the highest standards in production." },
    { icon: <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />, title: "Community Support", description: "We work directly with local farmers, supporting our community and ensuring freshness." },
  ]

  return (
    <div className="min-h-screen py-20 px-4 dark:bg-gray-950">
      <div className="container mx-auto max-w-6xl">

        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300">
            <Clock className="w-4 h-4 mr-2" /> Since 2010
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Our <span className="text-green-600 dark:text-emerald-400">Story</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Two generations of dedication to bringing you the finest Amla products.
          </p>
        </div>

        {/* Hero Story Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              A Legacy of <span className="text-green-600 dark:text-emerald-400">Health & Tradition</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">Our journey began in Maharashtra.</p>

            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                <div className="text-3xl font-bold text-green-600 dark:text-emerald-400">16+</div>
                <div className="text-gray-600 dark:text-gray-300">Years of Excellence</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">2</div>
                <div className="text-gray-600 dark:text-gray-300">Generations</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <Image src="/family_heritage.png" alt="Jadhav Family Heritage" width={600} height={500} className="rounded-2xl shadow-lg" />
            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
              <p className="font-semibold text-gray-900 dark:text-white">Maharashtra</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Our Homeland</p>
            </div>
          </div>
        </div>

        {/* Timeline — ORIGINAL LAYOUT PRESERVED */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Milestones that shaped our legacy</p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-green-200 dark:bg-green-800"></div>
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"}`}>
                    <Card className="shadow-lg border-0 dark:bg-gray-900">
                      <CardContent className="p-6">
                        <Badge className="mb-2 bg-green-600">{item.year}</Badge>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-green-600 rounded-full border-4 border-white dark:border-gray-700 shadow-lg dark:shadow-gray-600">
                    <div className="w-4 h-4 bg-white dark:bg-gray-900 rounded-full"></div>
                  </div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {values.map((value, index) => (
            <Card key={index} className="text-center shadow-lg border-0 dark:bg-gray-900">
              <CardContent className="p-8">
                <div className="mb-4 flex justify-center">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Health Benefits — IMAGE + LAYOUT PRESERVED */}
        <div className="bg-gradient-to-r from-green-50 to-yellow-50 dark:from-[#0f2027] dark:via-[#203a43] dark:to-[#2c5364] rounded-2xl p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Why <span className="text-green-600 dark:text-emerald-400">Amla</span>?
              </h2>

              <div className="space-y-4">

                <div className="flex items-start gap-3">
                  <Leaf className="w-6 h-6 text-green-600 dark:text-emerald-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Rich in Vitamin C</h4>
                    <p className="text-gray-600 dark:text-gray-300">Contains 20 times more Vitamin C than oranges</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Leaf className="w-6 h-6 text-green-600 dark:text-emerald-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Powerful Antioxidants</h4>
                    <p className="text-gray-600 dark:text-gray-300">Helps fight free radicals and boost immunity</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Leaf className="w-6 h-6 text-green-600 dark:text-emerald-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Digestive Health</h4>
                    <p className="text-gray-600 dark:text-gray-300">Promotes healthy digestion and metabolism</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Leaf className="w-6 h-6 text-green-600 dark:text-emerald-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Hair & Skin Health</h4>
                    <p className="text-gray-600 dark:text-gray-300">Natural source for healthy hair and glowing skin</p>
                  </div>
                </div>

              </div>
            </div>

            <div className="relative ">
              <Image src="/about.png" alt="Fresh Amla Benefits" width={500} height={400} />
            </div>
          </div>
        </div>


      </div>


      <WhatsAppButton />
    </div>
  )
}
