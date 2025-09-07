import Link from "next/link"
import Image from "next/image"
import AddToCartButton from "./add-to-cart-button"
import ClientWrapper from "./client-wrapper"

import { config } from "@/lib/config"

// Helper function to get appropriate product images based on category
function getProductImage(categoryName: string): string {
  const productImages: { [key: string]: string } = {
    "Homme": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    "Femme": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    "Enfant": "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    "fashion": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
  }
  
  return productImages[categoryName] || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
}

async function fetchFeaturedProducts() {
  const res = await fetch(`${config.api.baseUrl}/api/products`, { cache: "no-store" })
  if (!res.ok) return []
  const products = await res.json()
  // Return first 8 products as featured
  return products.slice(0, 8)
}

export default async function FeaturedProducts() {
  const products = await fetchFeaturedProducts()

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product: any) => (
        <div key={product.id} className="group relative overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <Link href={`/products/${product.id}`} className="relative block aspect-square overflow-hidden">
            <Image
              src={product.images?.[0]?.url || getProductImage(product.category?.name || "fashion")}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </Link>

          <div className="p-6">
            <Link href={`/products/${product.id}`} className="hover:underline">
              <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
            </Link>
            <p className="mt-1 text-sm text-muted-foreground capitalize">{product.category?.name}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xl font-bold text-primary">${product.price}</span>
              <ClientWrapper fallback={<div className="h-10 w-24 bg-muted rounded-lg animate-pulse" />}>
                <AddToCartButton product={product} variant="secondary" />
              </ClientWrapper>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
