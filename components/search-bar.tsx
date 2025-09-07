"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { searchProducts } from "@/lib/products"
import type { Product } from "@/lib/products"

interface SearchBarProps {
  className?: string
  placeholder?: string
}

export default function SearchBar({ className, placeholder = "Search products..." }: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<Product[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Fetch suggestions when query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([])
        setIsOpen(false)
        return
      }

      setIsLoading(true)
      try {
        const results = await searchProducts(query)
        setSuggestions(results.slice(0, 5)) // Show max 5 suggestions
        setIsOpen(results.length > 0)
      } catch (error) {
        console.error("Search error:", error)
        setSuggestions([])
        setIsOpen(false)
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  const handleSuggestionClick = (product: Product) => {
    setQuery("")
    setIsOpen(false)
    router.push(`/products/${product.id}`)
  }

  const clearSearch = () => {
    setQuery("")
    setSuggestions([])
    setIsOpen(false)
    inputRef.current?.focus()
  }

  return (
    <div ref={searchRef} className={cn("relative", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-full bg-muted pl-8 pr-10"
          onFocus={() => {
            if (suggestions.length > 0) {
              setIsOpen(true)
            }
          }}
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1 h-8 w-8 p-0"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </form>

      {/* Search Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-md border bg-popover p-0 shadow-md">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
            </div>
          ) : suggestions.length > 0 ? (
            <>
              <div className="max-h-80 overflow-y-auto">
                {suggestions.map((product) => (
                  <button
                    key={product.id}
                    className="flex w-full items-center gap-3 p-3 text-left hover:bg-accent"
                    onClick={() => handleSuggestionClick(product)}
                  >
                    <div className="relative h-10 w-10 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={product.image || "/placeholder.svg?height=40&width=40&query=product"}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="border-t p-2">
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  className="flex w-full items-center justify-center rounded-md p-2 text-sm hover:bg-accent"
                  onClick={() => setIsOpen(false)}
                >
                  View all results for "{query}"
                </Link>
              </div>
            </>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">No products found</div>
          )}
        </div>
      )}
    </div>
  )
}
