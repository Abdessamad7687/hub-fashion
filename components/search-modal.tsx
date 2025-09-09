"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, X, Star, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { config } from "@/lib/config"

interface Product {
  id: string
  name: string
  price: number
  image?: string
  averageRating?: number
  reviewCount?: number
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when modal opens and handle body scroll
  useEffect(() => {
    if (isOpen) {
      if (inputRef.current) {
        inputRef.current.focus()
      }
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    } else {
      // Restore body scroll when modal is closed
      document.body.style.overflow = 'unset'
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Fetch products when query changes
  useEffect(() => {
    const fetchProducts = async () => {
      if (query.trim().length < 2) {
        setProducts([])
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(`${config.api.baseUrl}/api/products/search?q=${encodeURIComponent(query)}`)
        if (response.ok) {
          const data = await response.json()
          setProducts(data)
        }
      } catch (error) {
        console.error("Search error:", error)
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchProducts, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      onClose()
    }
  }

  const handleProductClick = (productId: string) => {
    router.push(`/products/${productId}`)
    onClose()
  }

  const clearSearch = () => {
    setQuery("")
    setProducts([])
    inputRef.current?.focus()
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-xl font-semibold">Search Products</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-full">
          <div className="p-6 pt-4 flex-shrink-0">
            <form onSubmit={handleSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={inputRef}
                type="search"
                placeholder="Search for products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-10 h-12 text-base"
              />
              {query && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 h-8 w-8 p-0 -translate-y-1/2"
                  onClick={clearSearch}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear search</span>
                </Button>
              )}
            </form>
          </div>

          {/* Search Results */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span className="text-muted-foreground">Searching...</span>
              </div>
            ) : products.length > 0 ? (
              <div className="space-y-2">
                {products.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    className="flex w-full items-center gap-4 p-3 text-left hover:bg-accent rounded-lg transition-colors"
                    onClick={(e) => {
                      e.preventDefault()
                      handleProductClick(product.id)
                    }}
                  >
                    <div className="relative h-16 w-16 overflow-hidden rounded-md bg-muted flex-shrink-0">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs text-gray-500">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{product.name}</h3>
                      <p className="text-lg font-semibold text-primary">${product.price.toFixed(2)}</p>
                      {product.averageRating && product.reviewCount ? (
                        <div className="flex items-center gap-1 mt-1">
                          <div className="flex items-center">
                            {renderStars(product.averageRating)}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            ({product.reviewCount} review{product.reviewCount !== 1 ? 's' : ''})
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">No reviews yet</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : query.trim().length >= 2 ? (
              <div className="text-center py-8 text-muted-foreground">
                No products found for "{query}"
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Start typing to search for products...
              </div>
            )}
          </div>

          {/* View All Results Link */}
          {query.trim().length >= 2 && products.length > 0 && (
            <div className="border-t pt-4 mt-4 px-6 pb-6 flex-shrink-0">
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                className="flex w-full items-center justify-center rounded-md p-3 text-sm hover:bg-accent transition-colors"
                onClick={onClose}
              >
                View all results for "{query}"
              </Link>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
