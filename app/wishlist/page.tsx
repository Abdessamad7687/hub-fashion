"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Trash2, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useWishlist } from "@/lib/wishlist-context"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { config } from "@/lib/config"

interface ProductData {
  id: string
  name: string
  description: string
  price: number
  stock: number
  gender: string
  images: Array<{ url: string }>
  category: { id: string; name: string; description?: string; image?: string }
  sizes: Array<{ size: string }>
  colors: Array<{ color: string }>
  features: Array<{ name: string; value: string }>
}

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist()
  const { addItem } = useCart()
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState<ProductData[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)

  // Fetch real product data for wishlist items
  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (wishlist.length === 0) {
        setProducts([])
        setIsLoading(false)
        return
      }

      setLoadingProducts(true)
      try {
        const productPromises = wishlist.map(async (item) => {
          const response = await fetch(`${config.api.baseUrl}/api/products/${item.id}`)
          if (response.ok) {
            return await response.json()
          }
          return null
        })

        const fetchedProducts = await Promise.all(productPromises)
        const validProducts = fetchedProducts.filter(product => product !== null)
        setProducts(validProducts)
      } catch (error) {
        console.error('Error fetching wishlist products:', error)
        toast({
          title: "Error",
          description: "Failed to load some products from your wishlist.",
          variant: "destructive"
        })
      } finally {
        setLoadingProducts(false)
        setIsLoading(false)
      }
    }

    fetchWishlistProducts()
  }, [wishlist, toast])

  const handleAddToCart = (product: ProductData) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.url,
      quantity: 1,
    })

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const handleRemoveFromWishlist = (product: ProductData) => {
    removeFromWishlist(product.id)
    toast({
      title: "Removed from wishlist",
      description: `${product.name} has been removed from your wishlist.`,
    })
  }

  if (isLoading || loadingProducts) {
    return (
      <div className="container flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="container flex flex-col items-center justify-center py-16 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Sign in to view your wishlist</h1>
        <p className="mt-4 text-muted-foreground">You need to be signed in to save and view your favorite products.</p>
        <div className="mt-8 flex gap-4">
          <Button asChild>
            <Link href="/account/login">Sign In</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (wishlist.length === 0 || products.length === 0) {
    return (
      <div className="container flex flex-col items-center justify-center py-16 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Your wishlist is empty</h1>
        <p className="mt-4 text-muted-foreground">
          Start adding products to your wishlist to keep track of items you love.
        </p>
        <Button className="mt-8" asChild>
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Wishlist</h1>
        <p className="text-muted-foreground">
          {products.length} item{products.length !== 1 ? "s" : ""} saved
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <div key={product.id} className="group relative overflow-hidden rounded-lg border bg-background">
            <Link href={`/products/${product.id}`} className="relative block aspect-square overflow-hidden">
              <Image
                src={product.images?.[0]?.url || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </Link>

            <div className="p-4">
              <Link href={`/products/${product.id}`} className="hover:underline">
                <h3 className="font-medium">{product.name}</h3>
              </Link>
              <p className="mt-1 text-sm text-muted-foreground">
                {product.category.name}
              </p>
              <div className="mt-2 font-semibold">${product.price.toFixed(2)}</div>
              
              {/* Stock status */}
              <div className="mt-1 flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-500"}`} />
                <span className="text-xs text-muted-foreground">
                  {product.stock > 0 ? `In stock (${product.stock} available)` : "Out of stock"}
                </span>
              </div>

              <div className="mt-4 flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1" 
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="mr-1 h-3 w-3" />
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleRemoveFromWishlist(product)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
