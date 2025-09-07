"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductImageGalleryProps {
  product: {
    id: string
    name: string
    images?: Array<{ url: string }>
  }
}

export default function ProductImageGallery({ product }: ProductImageGalleryProps) {
  // Use real product images or fallback to meaningful images
  const productImages = product.images?.map(img => img.url) || []
  const images = productImages.length > 0 
    ? productImages 
    : ["https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"]

  const [currentImage, setCurrentImage] = useState(0)

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
        <Image
          src={images[currentImage] || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"}
          alt={`${product.name} - Image ${currentImage + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-2 right-2 rounded-full bg-background/80 px-2 py-1 text-xs backdrop-blur-sm">
          {currentImage + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Images */}
      <div className="grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            className={`relative aspect-square overflow-hidden rounded-md border-2 transition-colors ${
              index === currentImage ? "border-primary" : "border-transparent"
            }`}
            onClick={() => setCurrentImage(index)}
          >
            <Image
              src={image || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80"}
              alt={`${product.name} thumbnail ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 25vw, 12.5vw"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
