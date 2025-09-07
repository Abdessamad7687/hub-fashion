import Link from "next/link"
import Image from "next/image"
import { Metadata } from 'next'

import { config } from "@/lib/config"

// Helper function to generate category slug
function getCategorySlug(categoryName: string): string {
  const slugMap: { [key: string]: string } = {
    "Homme": "men",
    "Femme": "women", 
    "Enfant": "kids",
    "Accessoires": "accessories",
    "Chaussures": "shoes",
    "Sacs": "bags"
  }
  
  return slugMap[categoryName] || categoryName.toLowerCase().replace(/\s+/g, '-')
}

async function fetchCategories() {
  try {
    const res = await fetch(`${config.api.baseUrl}${config.api.categories}`, { cache: "no-store" })
    if (!res.ok) return []
    return res.json()
  } catch (error) {
    return []
  }
}

export const metadata: Metadata = {
  title: 'Categories - Modern E-commerce',
  description: 'Browse our product categories and find what you\'re looking for',
}

export default async function CategoriesPage() {
  const categories = await fetchCategories()

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center space-x-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <span className="text-foreground">Categories</span>
      </nav>

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Shop by Category</h1>
        <p className="mt-2 text-muted-foreground">
          Discover our collections organized by category
        </p>
        <div className="mt-4">
          <Link 
            href="/products" 
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            View All Products
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category: any) => (
          <Link
            key={category.id}
            href={`/categories/${getCategorySlug(category.name)}`}
            className="group relative overflow-hidden rounded-lg border transition-all hover:shadow-lg"
          >
            <div className="aspect-[3/4] w-full overflow-hidden">
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <h3 className="text-2xl font-bold text-white">{category.name}</h3>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-4 text-center">
              <p className="text-sm text-muted-foreground">
                {category.description || `Shop ${category.name}`}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
