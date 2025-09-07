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

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist()
  const { addItem } = useCart()
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
    })

    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    })
  }

  const handleRemoveFromWishlist = (item: any) => {
    removeFromWishlist(item.id)
    toast({
      title: "Removed from wishlist",
      description: `${item.name} has been removed from your wishlist.`,
    })
  }

  if (isLoading) {
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

  if (wishlist.length === 0) {
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
          {wishlist.length} item{wishlist.length !== 1 ? "s" : ""} saved
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {wishlist.map((item) => (
          <div key={item.id} className="group relative overflow-hidden rounded-lg border bg-background">
            <Link href={`/products/${item.id}`} className="relative block aspect-square overflow-hidden">
              <Image
                src={item.image || "/placeholder.svg?height=400&width=400&query=fashion+product"}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </Link>

            <div className="p-4">
              <Link href={`/products/${item.id}`} className="hover:underline">
                <h3 className="font-medium">{item.name}</h3>
              </Link>
              <p className="mt-1 text-sm text-muted-foreground">{item.category}</p>
              <div className="mt-2 font-semibold">${item.price.toFixed(2)}</div>

              <div className="mt-4 flex gap-2">
                <Button size="sm" className="flex-1" onClick={() => handleAddToCart(item)}>
                  <ShoppingCart className="mr-1 h-3 w-3" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleRemoveFromWishlist(item)}>
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
