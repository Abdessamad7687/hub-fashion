"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface ProductOptionsProps {
  product: {
    sizes?: string[]
    colors?: Array<{ name: string; value: string }>
  }
}

export default function ProductOptions({ product }: ProductOptionsProps) {
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>("")

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
    </div>
  )
}
