"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/lib/cart-context"
import { ShoppingCart } from "lucide-react"

interface ProductActionsProps {
  product: {
    id: string
    name: string
    price: number
    image?: string
    images?: Array<{ url: string }>
    sizes?: string[]
    colors?: Array<{ name: string; value: string }>
    stock?: number
  }
  disabled?: boolean
}

export default function ProductActions({ product, disabled = false }: ProductActionsProps) {
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>("")
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAddToCart = () => {
    if (disabled) return

    // Check if size is required and selected
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast({
        title: "Size Required",
        description: "Please select a size before adding to cart.",
        variant: "destructive",
      })
      return
    }

    // Check if color is required and selected
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast({
        title: "Color Required",
        description: "Please select a color before adding to cart.",
        variant: "destructive",
      })
      return
    }

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || product.images?.[0]?.url,
      quantity: 1,
      size: selectedSize,
      color: selectedColor,
    }
    
    console.log('Adding to cart with options:', cartItem)
    addItem(cartItem)

    toast({
      title: "Added to cart",
      description: `${product.name}${selectedSize ? ` (${selectedSize})` : ''}${selectedColor ? ` - ${selectedColor}` : ''} has been added to your cart.`,
    })
  }

  return (
    <div className="space-y-6">
      {/* Size Selection */}
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <Label className="text-base font-medium">Size</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <Button
                key={size}
                variant={selectedSize === size ? "default" : "outline"}
                size="sm"
                className="h-10 w-12"
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </Button>
            ))}
          </div>
          {selectedSize && <p className="mt-2 text-sm text-muted-foreground">Selected size: {selectedSize}</p>}
        </div>
      )}

      {/* Color Selection */}
      {product.colors && product.colors.length > 0 && (
        <div>
          <Label className="text-base font-medium">Color</Label>
          <div className="mt-2 flex flex-wrap gap-3">
            {product.colors.map((color) => (
              <button
                key={color.name}
                className={`relative h-8 w-8 rounded-full border-2 transition-all ${
                  selectedColor === color.name
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-muted-foreground/20 hover:border-muted-foreground/40"
                }`}
                style={{ backgroundColor: color.value }}
                onClick={() => setSelectedColor(color.name)}
                title={color.name}
              >
                {selectedColor === color.name && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-white shadow-sm" />
                  </div>
                )}
              </button>
            ))}
          </div>
          {selectedColor && <p className="mt-2 text-sm text-muted-foreground">Selected color: {selectedColor}</p>}
        </div>
      )}

      {/* Add to Cart Button */}
      <Button 
        onClick={handleAddToCart} 
        size="lg" 
        className="w-full" 
        disabled={disabled}
      >
        <ShoppingCart className="mr-2 h-4 w-4" />
        {disabled ? "Out of Stock" : "Add to Cart"}
      </Button>
    </div>
  )
}

