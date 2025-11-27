import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Award, Users, Leaf, Heart, Clock, MapPin } from "lucide-react"
import WhatsAppButton from "@/components/whatsapp-button"

export const metadata = {
  title: "About Us - Active Amla Delights | Our Story & Heritage",
  description:
    "Learn about Active Amla Delights' journey since 2010. Discover our family tradition, commitment to quality, and passion for bringing you the finest Amla products.",
}

export default function AboutPage() {
  const timeline = [
    {
      year: "2010",
      title: "The Beginning",
      description:
        "Sanjiwani Ashok Jadhav started our family business with a small Amla processing unit in Maharashtra.",
    },
    {
      year: "2012",
      title: "Expansion",
      description: "Expanded our product range and started supplying to local markets across Maharashtra.",
    },
    {
      year: "2005",
      title: "Quality Certification",
      description:
        "Obtained food safety certifications and modernized our processing methods while maintaining traditional recipes.",
    },
    {
      year: "2015",
      title: "Digital Presence",
      description: "Launched our online presence and started serving customers across India.",
    },
    {
      year: "2023",
      title: "New Generation",
      description: "Third generation joins the business, bringing fresh ideas while preserving our heritage.",
    },
  ]

  const values = [
    {
      icon: <Leaf className="w-8 h-8 text-green-600" />,
      title: "100% Natural",
      description: "We use only natural ingredients without any artificial preservatives or colors.",
    },
    {
      icon: <Heart className="w-8 h-8 text-red-500" />,
      title: "Made with Love",
      description: "Every product is crafted with care and attention to detail, just like homemade.",
    },
    {
      icon: <Award className="w-8 h-8 text-yellow-600" />,
      title: "Quality First",
      description: "We never compromise on quality and maintain the highest standards in production.",
    },
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Community Support",
      description: "We work directly with local farmers, supporting our community and ensuring freshness.",
    },
  ]

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-green-100 text-green-800">
            <Clock className="w-4 h-4 mr-2" />
            Since 2010
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our <span className="text-green-600">Story</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Three generations of dedication to bringing you the finest Amla products, rooted in tradition and driven by
            a passion for health and wellness.
          </p>
        </div>

        {/* Hero Story Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">
              A Legacy of <span className="text-green-600">Health & Tradition</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              In 2010, Sanjiwani Ashok Jadhav had a simple yet powerful vision: to share the incredible health benefits
              of Amla with families across Maharashtra. What started as a small home-based operation has grown into a
              trusted name in traditional Amla products.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our journey began in the fertile lands of Maharashtra, where the finest Amla fruits grow under the perfect
              combination of soil and climate. We've maintained the same traditional recipes and processing methods that
              our founder perfected nearly four decades ago.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">12+</div>
                <div className="text-gray-600">Years of Excellence</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-3xl font-bold text-yellow-600">3</div>
                <div className="text-gray-600">Generations</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <Image
              src="/placeholder.svg?height=500&width=600"
              alt="Jadhav Family Heritage"
              width={600}
              height={500}
              className="rounded-2xl shadow-lg"
            />
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Maharashtra</p>
                  <p className="text-sm text-gray-600">Our Homeland</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600">Milestones that shaped our legacy</p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-green-200"></div>
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"}`}>
                    <Card className="shadow-lg border-0">
                      <CardContent className="p-6">
                        <Badge className="mb-2 bg-green-600">{item.year}</Badge>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-green-600 rounded-full border-4 border-white shadow-lg">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">What drives us every day</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center shadow-lg border-0 hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="mb-4 flex justify-center">{value.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Health Benefits */}
        <div className="bg-gradient-to-r from-green-50 to-yellow-50 rounded-2xl p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Why <span className="text-green-600">Amla</span>?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Leaf className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Rich in Vitamin C</h4>
                    <p className="text-gray-600">Contains 20 times more Vitamin C than oranges</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Leaf className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Powerful Antioxidants</h4>
                    <p className="text-gray-600">Helps fight free radicals and boost immunity</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Leaf className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Digestive Health</h4>
                    <p className="text-gray-600">Promotes healthy digestion and metabolism</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Leaf className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Hair & Skin Health</h4>
                    <p className="text-gray-600">Natural source for healthy hair and glowing skin</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=400&width=500"
                alt="Fresh Amla Benefits"
                width={500}
                height={400}
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <WhatsAppButton />
    </div>
  )
}
