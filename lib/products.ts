// Mock product data and functions
export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image?: string
  category: string
  isNew?: boolean
  discount?: number
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Classic White T-Shirt",
    description: "A comfortable and versatile white t-shirt made from premium cotton.",
    price: 29.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "men",
    isNew: true,
  },
  {
    id: "2",
    name: "Denim Jacket",
    description: "Stylish denim jacket perfect for layering in any season.",
    price: 89.99,
    originalPrice: 119.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "women",
    discount: 25,
  },
  {
    id: "3",
    name: "Leather Sneakers",
    description: "Premium leather sneakers with comfortable cushioning.",
    price: 149.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "footwear",
  },
  {
    id: "4",
    name: "Silk Scarf",
    description: "Elegant silk scarf with beautiful patterns.",
    price: 59.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "accessories",
    isNew: true,
  },
  {
    id: "5",
    name: "Wool Sweater",
    description: "Cozy wool sweater perfect for cold weather.",
    price: 79.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "men",
  },
  {
    id: "6",
    name: "Summer Dress",
    description: "Light and airy summer dress in floral print.",
    price: 69.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "women",
    isNew: true,
  },
  {
    id: "7",
    name: "Canvas Backpack",
    description: "Durable canvas backpack for everyday use.",
    price: 49.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "accessories",
  },
  {
    id: "8",
    name: "Running Shoes",
    description: "Lightweight running shoes with excellent support.",
    price: 129.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "footwear",
  },
]

export async function getProducts(filters?: {
  category?: string | string[]
  sort?: string | string[]
  price?: string | string[]
}): Promise<Product[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  let filteredProducts = [...mockProducts]

  if (filters?.category) {
    const category = Array.isArray(filters.category) ? filters.category[0] : filters.category
    filteredProducts = filteredProducts.filter((product) => product.category === category)
  }

  if (filters?.price) {
    const priceRange = Array.isArray(filters.price) ? filters.price[0] : filters.price
    const [min, max] = priceRange.split("-").map(Number)
    filteredProducts = filteredProducts.filter((product) => product.price >= min && product.price <= max)
  }

  if (filters?.sort) {
    const sortBy = Array.isArray(filters.sort) ? filters.sort[0] : filters.sort
    switch (sortBy) {
      case "price-asc":
        filteredProducts.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        filteredProducts.sort((a, b) => b.price - a.price)
        break
      case "name":
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
        break
    }
  }

  return filteredProducts
}

export async function getProduct(id: string): Promise<Product | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  return mockProducts.find((product) => product.id === id) || null
}

export async function getFeaturedProducts(): Promise<Product[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  return mockProducts.slice(0, 4)
}

export async function searchProducts(
  query: string,
  filters?: {
    category?: string | string[]
    sort?: string | string[]
    price?: string | string[]
  },
): Promise<Product[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200))

  let filteredProducts = [...mockProducts]

  // Filter by search query
  if (query.trim()) {
    const searchTerm = query.toLowerCase().trim()
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm),
    )
  }

  // Apply additional filters
  if (filters?.category) {
    const category = Array.isArray(filters.category) ? filters.category[0] : filters.category
    filteredProducts = filteredProducts.filter((product) => product.category === category)
  }

  if (filters?.price) {
    const priceRange = Array.isArray(filters.price) ? filters.price[0] : filters.price
    const [min, max] = priceRange.split("-").map(Number)
    filteredProducts = filteredProducts.filter((product) => product.price >= min && product.price <= max)
  }

  if (filters?.sort) {
    const sortBy = Array.isArray(filters.sort) ? filters.sort[0] : filters.sort
    switch (sortBy) {
      case "price-asc":
        filteredProducts.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        filteredProducts.sort((a, b) => b.price - a.price)
        break
      case "name":
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "relevance":
      default:
        // Keep original order for relevance
        break
    }
  }

  return filteredProducts
}
