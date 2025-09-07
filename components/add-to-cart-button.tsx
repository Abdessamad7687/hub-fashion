"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface AddToCartButtonProps {
  product: {
    id: string
    name: string
    price: number
    image?: string
    images?: Array<{ url: string }>
  }
  variant?: "default" | "secondary" | "outline"
  size?: "default" | "sm" | "lg"
  className?: string
  disabled?: boolean
}

export default function AddToCartButton({
  product,
  variant = "default",
  size = "default",
  className,
  disabled = false,
}: AddToCartButtonProps) {
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAddToCart = () => {
    console.log('Add to cart clicked for product:', product)
    if (disabled) return

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || product.images?.[0]?.url,
      quantity: 1,
    }
    
    console.log('Adding to cart:', cartItem)
    addItem(cartItem)

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  return (
    <Button onClick={handleAddToCart} variant={variant} size={size} className={cn(className)} disabled={disabled}>
      <ShoppingCart className="mr-2 h-4 w-4" />
      {disabled ? "Out of Stock" : "Add to Cart"}
    </Button>
  )
}
