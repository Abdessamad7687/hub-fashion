import Link from "next/link"
import Image from "next/image"

import { config } from "@/lib/config"

// Helper function to get appropriate category images
function getCategoryImage(categoryName: string): string {
  const categoryImages: { [key: string]: string } = {
    "Homme": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    "Femme": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    "Enfant": "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    "Accessoires": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    "Chaussures": "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    "Sacs": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  }
  
  return categoryImages[categoryName] || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
}

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
  const res = await fetch(`${config.api.baseUrl}${config.api.categories}`, { cache: "no-store" })
  if (!res.ok) return []
  return res.json()
}

export default async function CategoryGrid() {
  const categories = await fetchCategories()

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map((category: any) => (
        <Link
          key={category.id}
          href={`/categories/${getCategorySlug(category.name)}`}
          className="group relative overflow-hidden rounded-2xl bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <div className="aspect-[3/4] w-full overflow-hidden">
            <Image
              src={category.image || getCategoryImage(category.name)}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 via-black/20 to-transparent">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                {category.name}
              </h3>
              <p className="mt-2 text-sm text-white/90">
                Shop {category.name.toLowerCase()}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
