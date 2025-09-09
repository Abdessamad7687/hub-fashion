import Link from "next/link"
import Image from "next/image"
import { Clock, Star } from "lucide-react"
import AddToCartButton from "./add-to-cart-button"
import WishlistButton from "./wishlist-button"
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

async function fetchLatestProducts() {
  const res = await fetch(`${config.api.baseUrl}/api/products?limit=6&sort=newest`, { cache: "no-store" })
  if (!res.ok) return []
  const data = await res.json()
  // Return latest 6 products
  return data.products || []
}

export default async function LatestProducts() {
  const products = await fetchLatestProducts()

  if (products.length === 0) {
    return (
      <div className="flex h-[400px] w-full flex-col items-center justify-center rounded-lg border bg-muted/40 p-8 text-center">
        <h3 className="text-xl font-semibold">No latest products found</h3>
        <p className="text-muted-foreground">Check back soon for new arrivals!</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Clock className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Latest Arrivals
            </h2>
            <p className="mt-2 text-muted-foreground">
              Discover our newest products fresh off the production line
            </p>
          </div>
        </div>
        <Link 
          href="/products" 
          className="mt-4 text-sm font-medium underline-offset-4 hover:underline sm:mt-0"
        >
          View All Products →
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product: any, index: number) => (
          <div 
            key={product.id} 
            className="group relative overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
          >
            {/* Product Image */}
            <Link href={`/products/${product.id}`} className="relative block aspect-square overflow-hidden">
              <Image
                src={product.images?.[0]?.url || getProductImage(product.category?.name || "fashion")}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              
              {/* New Badge */}
              <div className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
                <Clock className="h-3 w-3" />
                New
              </div>
              
              {/* Wishlist Button */}
              <div className="absolute right-4 top-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <ClientWrapper fallback={<div className="h-10 w-10 bg-background/80 rounded-full" />}>
                  <WishlistButton 
                    product={product} 
                    variant="outline" 
                    size="icon" 
                    showText={false}
                    className="h-10 w-10 bg-background/80 backdrop-blur-sm hover:bg-background"
                  />
                </ClientWrapper>
              </div>

              {/* Discount Badge */}
              {product.discount && (
                <div className="absolute right-4 bottom-4 rounded-full bg-destructive px-2 py-1 text-xs font-medium text-destructive-foreground">
                  {product.discount}% OFF
                </div>
              )}
            </Link>

            {/* Product Info */}
            <div className="p-6">
              <div className="mb-2 flex items-center justify-between">
                <Link href={`/products/${product.id}`} className="hover:underline">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors overflow-hidden" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-muted-foreground">
                    {product.averageRating > 0 ? (
                      <>
                        {product.averageRating.toFixed(1)}
                        {product.reviewCount > 0 && (
                          <span className="text-xs text-muted-foreground ml-1">
                            ({product.reviewCount})
                          </span>
                        )}
                      </>
                    ) : (
                      'No reviews'
                    )}
                  </span>
                </div>
              </div>
              
              <p className="mb-3 text-sm text-muted-foreground capitalize">
                {product.category?.name || 'Uncategorized'}
              </p>
              
              {/* Colors and Sizes */}
              <div className="mb-4 space-y-2">
                {product.colors && product.colors.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Colors:</span>
                    <div className="flex gap-1">
                      {product.colors.slice(0, 3).map((color: any, colorIndex: number) => (
                        <div 
                          key={colorIndex} 
                          className="h-4 w-4 rounded-full border-2 border-background shadow-sm"
                          style={{ backgroundColor: color.color.toLowerCase() }}
                          title={color.color}
                        />
                      ))}
                      {product.colors.length > 3 && (
                        <span className="text-xs text-muted-foreground">+{product.colors.length - 3}</span>
                      )}
                    </div>
                  </div>
                )}
                
                {product.sizes && product.sizes.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Sizes:</span>
                    <div className="flex gap-1">
                      {product.sizes.slice(0, 4).map((size: any, sizeIndex: number) => (
                        <span key={sizeIndex} className="text-xs border px-2 py-0.5 rounded">
                          {size.size}
                        </span>
                      ))}
                      {product.sizes.length > 4 && (
                        <span className="text-xs text-muted-foreground">+{product.sizes.length - 4}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Price and Actions */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  {product.originalPrice ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-primary">${product.price.toFixed(2)}</span>
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xl font-bold text-primary">${product.price.toFixed(2)}</span>
                  )}
                  {product.originalPrice && (
                    <span className="text-xs text-green-600 font-medium">
                      Save ${(product.originalPrice - product.price).toFixed(2)}
                    </span>
                  )}
                </div>
                
                <ClientWrapper fallback={<div className="h-10 w-32 bg-muted rounded-lg animate-pulse" />}>
                  <AddToCartButton 
                    product={product} 
                    variant="default" 
                    size="sm"
                    className="px-6"
                  />
                </ClientWrapper>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="flex justify-center">
        <Link href="/products">
          <button className="group relative inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:scale-105">
            <span>View All Latest Products</span>
            <div className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1">
              →
            </div>
          </button>
        </Link>
      </div>
    </div>
  )
}
