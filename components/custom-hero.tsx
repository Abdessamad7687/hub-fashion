"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Eye, 
  ArrowRight, 
  Sparkles, 
  ChevronRight,
  Play
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AddToCartButton from "./add-to-cart-button"
import WishlistButton from "./wishlist-button"
import { config } from "@/lib/config"

// Helper function to get appropriate product images based on category
function getProductImage(categoryName: string): string {
  const productImages: { [key: string]: string } = {
    "Homme": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    "Femme": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    "Enfant": "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    "Accessories": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
  }
  
  return productImages[categoryName] || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
}

export default function CustomHero() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const res = await fetch(`${config.api.baseUrl}/api/products?limit=4&sort=newest`)
        if (res.ok) {
          const data = await res.json()
          setProducts(data.products || [])
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLatestProducts()
  }, [])

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Modern Light Background with Gradient and Patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.02)_50%,transparent_75%)] bg-[length:20px_20px]" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-white/40 to-white" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-500" />

      <div className="container relative z-10 mx-auto px-4 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Hero Content */}
          <div className="space-y-8 text-slate-900">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-slate-200 px-6 py-3">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-slate-700">New Collection 2025</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
            
            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                Discover Your
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Perfect Style
                </span>
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl leading-relaxed">
                Explore our curated collection of premium fashion items. From casual wear to elegant pieces, 
                find everything you need to express your unique style with confidence.
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group" 
                asChild
              >
                <Link href="/products">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="px-8 py-4 text-lg bg-white/80 border-slate-300 text-slate-700 hover:bg-slate-50 backdrop-blur-sm group shadow-lg" 
                asChild
              >
                <Link href="/categories">
                  <Play className="mr-2 h-5 w-5" />
                  Browse Categories
                  <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>

          </div>
          
          {/* Right Side - Featured Products Showcase */}
          <div className="relative">
            {loading ? (
              /* Enhanced Loading State */
              <div className="grid grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i}>
                    <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                      <div className="aspect-square bg-slate-200 animate-pulse rounded-t-lg" />
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="h-4 bg-slate-200 rounded animate-pulse" />
                          <div className="h-3 bg-slate-200 rounded animate-pulse w-2/3" />
                          <div className="flex justify-between items-center">
                            <div className="h-6 bg-slate-200 rounded animate-pulse w-20" />
                            <div className="h-8 bg-slate-200 rounded animate-pulse w-16" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {/* Product Cards */}
                {products.slice(0, 3).map((product, index) => (
                  <div key={product.id}>
                    <Card className="group relative overflow-hidden border-0 bg-white/90 backdrop-blur-sm shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105">
                      <Link href={`/products/${product.id}`} className="relative block aspect-square overflow-hidden">
                        <Image
                          src={product.images?.[0]?.url || getProductImage(product.category?.name || "Accessories")}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 640px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        
                        {/* Quick Actions */}
                        <div className="absolute right-2 top-2 flex flex-col gap-1 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 translate-y-1">
                          <WishlistButton 
                            product={product} 
                            variant="outline" 
                            size="icon" 
                            showText={false}
                            className="h-8 w-8 bg-white/90 backdrop-blur-sm hover:bg-white border-white/50 text-slate-700 hover:text-slate-900"
                          />
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 bg-white/90 backdrop-blur-sm hover:bg-white border-white/50 text-slate-700 hover:text-slate-900"
                            asChild
                          >
                            <Link href={`/products/${product.id}`}>
                              <Eye className="h-3 w-3" />
                            </Link>
                          </Button>
                        </div>

                        {/* Product Info */}
                        <div className="absolute bottom-2 left-2 right-2 text-white">
                          <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-blue-300 transition-colors mb-1">
                            {product.name}
                          </h4>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-lg">
                              ${product.price.toFixed(2)}
                            </span>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs">
                                {product.averageRating > 0 ? product.averageRating.toFixed(1) : 'New'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </Card>
                  </div>
                ))}
              </div>
            ) : (
              /* Enhanced Fallback */
              <div className="flex h-[600px] w-full items-center justify-center rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm p-8 text-center shadow-xl">
                <div className="space-y-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">New Arrivals Coming Soon</h3>
                    <p className="text-slate-600">We're preparing something amazing for you!</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
