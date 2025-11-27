export interface Product {
  id: number
  name: string
  description: string
  price: string
  weight: string
  image: string
  category: string
  ingredients: string
  benefits: string[]
}

export const products: Product[] = [
  {
    id: 1,
    name: "Amla Candy (Sweet)",
    description:
      "Our signature sweet Amla candy made with fresh Amla and natural sweeteners. A perfect blend of health and taste that kids and adults love equally.",
    price: "₹250",
    weight: "500g",
    image: "/Candy.jpg",
    category: "Sweet Snack",
    ingredients: "Fresh Amla, Sugar",
    benefits: [
      "Rich in Vitamin C and antioxidants",
      "Boosts immunity naturally",
      "Improves digestion",
      "Promotes healthy hair and skin",
    ],
  },
  {
    id: 2,
    name: "Namkeen Amla Candy",
    description:
      "For those who love a kick of spice! Our spicy Amla candy combines the goodness of Amla with traditional Indian spices for a tangy, flavorful experience.",
    price: "₹250",
    weight: "500g",
    image: "/Namkeen1.jpg?height=400&width=600",
    category: "Savory Snack (Namkeen Candy)",
    ingredients: "Fresh Amla, Black Salt, Cumin, Cardibum",
    benefits: ["Enhances metabolism", "Aids in weight management", "Improves appetite", "Rich source of Vitamin C"],
  },
  {
    id: 3,
    name: "Pure Amla Juice",
    description:
      "100% pure Amla juice extracted from fresh, handpicked Amla fruits. No added preservatives or artificial colors - just pure nutrition in every sip.",
    price: "₹200",
    weight: "1 ltr",
    image: "/Juice1.jpg?height=100%&width=100%",
    category: "Beverage",
    ingredients: "100% Fresh Amla Extract",
    benefits: [
      "Detoxifies the body naturally",
      "Strengthens immune system",
      "Improves liver function",
      "Promotes healthy cholesterol levels",
    ],
  },
  {
    id: 4,
    name: "Amla Churna (Powder)",
    description:
      "Finely ground Amla powder made from sun-dried Amla fruits. Perfect for daily consumption, can be mixed with water, honey, or added to smoothies.",
    price: "₹250",
    weight: "500g",
    image: "/Powder1.jpg?height=400&width=600",
    category: "Herbal Powder",
    ingredients: "100% Pure Dried Amla Powder",
    benefits: [
      "Convenient daily supplement",
      "Supports digestive health",
      "Natural source of fiber",
      "Long shelf life without preservatives",
    ],
  },
  {
    id: 5,
    name: "Amla Supari",
    description:
      " A crunchy, tangy, and spiced mouth freshener made from dried Amla slices.",
    price: "₹320",
    weight: "500g",
    image: "/Supari1.jpg?height=400&width=600",
    category: "Mouth Freshener",
    ingredients: "Amla, Black Salt, Pink Salt, Rock salt, Carom Seeds, cumin",
    benefits: [
      "Aids digestion",
      "freshens breath",
      "rich in Vitamin C.",
    ],
  },
  {
    id: 6,
    name: "Moravala",
    description:
      "Sweet preserved Amla soaked in sugar syrup, used as a natural tonic.",
    price: "₹250",
    weight: "500g",
    image: "/Moravala1.jpg?height=400&width=600",
    category: "Preserved Sweet",
    ingredients: "Amla, Sugar, Cardemom",
    benefits: [
      "Acts as a rejuvenator",
      " strengthens the immune system",
      "helps relieve acidity",
      "Long shelf life without preservatives",
    ],
  },
  {
    id: 7,
    name: "Amla Pickel",
    description:
      " A traditional Indian pickle made from spiced and preserved Amla slices.",
    price: "₹250",
    weight: "500g",
    image: "/placeholder.svg?height=400&width=600",
    category: "Condiment",
    ingredients: "Amla, Rock Salt, Turmeric, Garlic, Chili Powder, Fenugreek, Mustard Seeds, Soyabean Oil",
    benefits: [
      "Stimulates appetite",
      "aids digestion",
      "Natural source of fiber",
      "provides probiotic benefits",
    ],
  },
  {
    id: 8,
    name: "Amla Refreshment",
    description:
      "Spicy Amla sticks seasoned with tangy masala a zesty treat for the taste buds.",
    price: "₹200",
    weight: "200g",
    image: "/placeholder.svg?height=400&width=600",
    category: "Spiced Snack",
    ingredients: "Amla, Ginger, cumin seeds, carom seeds, fennel seeds",
    benefits: [
      "Aids digestion ",
      "provides instant energy",
      "Natural source of fiber",
      "Reduces acidity and bloating",
    ],
  },
  {
    id: 9,
    name: "Mango Pickel",
    description:
      "A spicy and tangy Indian pickle made from raw mangoes blended with traditional spices and oil. Packed with flavor, it's a classic side dish enjoyed with meals across India.",
    price: "₹150",
    weight: "200g",
    image: "/Mango.jpg1?height=400&width=600",
    category: "Condiment",
    ingredients: "Mango, Rock Salt, Turmeric, Garlic, Chili Powder, Fenugreek, Mustard Seeds, Soyabean Oil",
    benefits: [
      "Boosts digestion by stimulating digestive juices.",
      "Enhances appetite with its tangy and spicy taste.",
      "Rich in antioxidants from raw mango and mustard seeds.",
      "Provides probiotic benefits when naturally fermented.",
    ],
  },
  {
    id: 10,
    name: "Amla Wine",
    description:
      "A fermented beverage made from Amla, offering a unique blend of health and taste.",
    price: "₹***",
    weight: "***",
    image: "/Wine11.jpg?height=400&width=600",
    category: "Beverage",
    ingredients: "***",
    benefits: [
      "Rich in antioxidants",
      "supports digestion",
      "may improve heart health (when consumed in moderation)",
      
    ],
  },
]
