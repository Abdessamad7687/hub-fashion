"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { config } from "@/lib/config"

export default function MobileNav() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [categories, setCategories] = useState([])

  // Helper function to generate category slug
  const getCategorySlug = (categoryName: string): string => {
    const slugMap: { [key: string]: string } = {
      "Men": "men",
      "Women": "women", 
      "Kids": "kids",
      "Accessories": "accessories",
      "Shoes": "shoes",
      "Bags": "bags"
    }
    
    return slugMap[categoryName] || categoryName.toLowerCase().replace(/\s+/g, '-')
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${config.api.baseUrl}/api/categories`)
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [])

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="p-6">
        <Link href="/" className="mb-8 flex items-center space-x-2">
          <Image
            src="/logo.svg"
            alt="StyleHub Logo"
            width={120}
            height={40}
            className="h-8 w-auto"
          />
        </Link>

        {isSearchOpen ? (
          <div className="relative mb-6">
            <Input type="search" placeholder="Search products..." className="w-full pr-8" autoFocus />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setIsSearchOpen(false)}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            className="mb-6 w-full justify-start bg-transparent"
            onClick={() => setIsSearchOpen(true)}
          >
            Search products...
          </Button>
        )}
      </div>

      <nav className="flex-1">
        <Accordion type="multiple" className="w-full">
          <Link href="/" className="flex h-12 items-center border-b px-6 font-medium">
            Home
          </Link>

          <AccordionItem value="shop">
            <AccordionTrigger className="px-6">Shop</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col space-y-2 px-6 pb-4">
                <Link href="/products" className="py-2 text-muted-foreground hover:text-foreground">
                  All Products
                </Link>
                <Link href="/categories" className="py-2 text-muted-foreground hover:text-foreground">
                  Browse Categories
                </Link>
                {categories.slice(0, 3).map((category: any) => (
                  <Link 
                    key={category.id} 
                    href={`/categories/${getCategorySlug(category.name)}`} 
                    className="py-2 text-muted-foreground hover:text-foreground"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <Link href="/about" className="flex h-12 items-center border-b px-6 font-medium">
            About
          </Link>

          <Link href="/contact" className="flex h-12 items-center border-b px-6 font-medium">
            Contact
          </Link>
        </Accordion>
      </nav>

      <div className="border-t p-6">
        <div className="flex flex-col space-y-4">
          <Button asChild className="h-12">
            <Link href="/account/login">Sign In</Link>
          </Button>
          <Button variant="outline" asChild className="h-12">
            <Link href="/account/register">Create Account</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
