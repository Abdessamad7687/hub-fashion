"use client"

import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWishlist } from "@/lib/wishlist-context"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface WishlistButtonProps {
  product: {
    id: string
    name: string
    price: number
    image?: string
    category: string
  }
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  showText?: boolean
}

export default function WishlistButton({
  product,
  variant = "outline",
  size = "default",
  className,
  showText = true,
}: WishlistButtonProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()

  const inWishlist = isInWishlist(product.id)

  const handleToggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id)
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      })
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
      })
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      })
    }
  }

  return (
    <Button onClick={handleToggleWishlist} variant={variant} size={size} className={cn(className)}>
      <Heart className={cn("h-4 w-4", showText && "mr-2", inWishlist && "fill-red-500 text-red-500")} />
      {showText && (inWishlist ? "Remove from Wishlist" : "Add to Wishlist")}
    </Button>
  )
}
