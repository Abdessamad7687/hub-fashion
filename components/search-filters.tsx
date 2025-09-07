"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { config } from "@/lib/config"

export default function SearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [priceRange, setPriceRange] = useState([0, 200])
  const [categories, setCategories] = useState([])
  const [colors, setColors] = useState([])
  const [sizes, setSizes] = useState([])
  const [loading, setLoading] = useState(true)

  // Helper function to generate category slug
  const getCategorySlug = (categoryName: string): string => {
    const slugMap: { [key: string]: string } = {
      "Homme": "men",
      "Femme": "women", 
      "Enfant": "kids",
      "Accessoires": "accessories",
      "Chaussures": "shoes",
      "Sacs": "bags"
    }
    
    return slugMap[categoryName] || categoryName.toLowerCase().replace(/\s+/g, '-')
  }

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        setLoading(true)
        
        // Fetch categories
        const categoriesRes = await fetch(`${config.api.baseUrl}/api/categories`)
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json()
          setCategories(categoriesData.map((cat: any) => ({
            id: getCategorySlug(cat.name),
            label: cat.name,
            originalId: cat.id
          })))
        }

        // Fetch products to get colors and sizes
        const productsRes = await fetch(`${config.api.baseUrl}/api/products`)
        if (productsRes.ok) {
          const productsData = await productsRes.json()
          
          // Extract unique colors
          const uniqueColors = new Set()
          const uniqueSizes = new Set()
          let maxPrice = 0
          
          productsData.forEach((product: any) => {
            if (product.price > maxPrice) maxPrice = product.price
            
            product.colors?.forEach((color: any) => {
              uniqueColors.add(color.color)
            })
            
            product.sizes?.forEach((size: any) => {
              uniqueSizes.add(size.size)
            })
          })
          
          setColors(Array.from(uniqueColors).map((color: string) => ({
            id: color.toLowerCase(),
            label: color
          })))
          
          setSizes(Array.from(uniqueSizes).map((size: string) => ({
            id: size.toLowerCase(),
            label: size
          })))
          
          // Update price range based on actual data
          setPriceRange([0, Math.ceil(maxPrice)])
        }
      } catch (error) {
        console.error('Error fetching filter data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFilterData()
  }, [])

  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams)
    if (params.get("category") === categoryId) {
      params.delete("category")
    } else {
      params.set("category", categoryId)
    }
    router.push(`/search?${params.toString()}`)
  }

  const handleColorChange = (colorId: string) => {
    const params = new URLSearchParams(searchParams)
    const currentColors = params.get("colors")?.split(",") || []
    
    if (currentColors.includes(colorId)) {
      const newColors = currentColors.filter(c => c !== colorId)
      if (newColors.length > 0) {
        params.set("colors", newColors.join(","))
      } else {
        params.delete("colors")
      }
    } else {
      params.set("colors", [...currentColors, colorId].join(","))
    }
    
    router.push(`/search?${params.toString()}`)
  }

  const handleSizeChange = (sizeId: string) => {
    const params = new URLSearchParams(searchParams)
    const currentSizes = params.get("sizes")?.split(",") || []
    
    if (currentSizes.includes(sizeId)) {
      const newSizes = currentSizes.filter(s => s !== sizeId)
      if (newSizes.length > 0) {
        params.set("sizes", newSizes.join(","))
      } else {
        params.delete("sizes")
      }
    } else {
      params.set("sizes", [...currentSizes, sizeId].join(","))
    }
    
    router.push(`/search?${params.toString()}`)
  }

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values)
  }

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams)
    params.set("price", `${priceRange[0]}-${priceRange[1]}`)
    router.push(`/search?${params.toString()}`)
  }

  const resetFilters = () => {
    const params = new URLSearchParams(searchParams)
    const query = params.get("q")
    router.push(`/search${query ? `?q=${query}` : ""}`)
    setPriceRange([0, 200])
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>
        <div className="space-y-4">
          <div className="h-4 bg-muted rounded animate-pulse"></div>
          <div className="h-4 bg-muted rounded animate-pulse"></div>
          <div className="h-4 bg-muted rounded animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button variant="ghost" size="sm" onClick={resetFilters}>
          Reset
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={["category", "price", "color", "size"]}>
        <AccordionItem value="category">
          <AccordionTrigger>Category</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={searchParams.get("category") === category.id}
                    onCheckedChange={() => handleCategoryChange(category.id)}
                  />
                  <Label htmlFor={`category-${category.id}`} className="text-sm font-normal">
                    {category.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider defaultValue={[0, 200]} max={200} step={1} value={priceRange} onValueChange={handlePriceChange} />
              <div className="flex items-center justify-between">
                <span className="text-sm">${priceRange[0]}</span>
                <span className="text-sm">${priceRange[1]}</span>
              </div>
              <Button size="sm" onClick={applyFilters} className="w-full">
                Apply
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="color">
          <AccordionTrigger>Color</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {colors.map((color) => {
                const currentColors = searchParams.get("colors")?.split(",") || []
                const isChecked = currentColors.includes(color.id)
                
                return (
                  <div key={color.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`color-${color.id}`}
                      checked={isChecked}
                      onCheckedChange={() => handleColorChange(color.id)}
                    />
                    <Label htmlFor={`color-${color.id}`} className="text-sm font-normal">
                      {color.label}
                    </Label>
                  </div>
                )
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="size">
          <AccordionTrigger>Size</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {sizes.map((size) => {
                const currentSizes = searchParams.get("sizes")?.split(",") || []
                const isChecked = currentSizes.includes(size.id)
                
                return (
                  <div key={size.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`size-${size.id}`}
                      checked={isChecked}
                      onCheckedChange={() => handleSizeChange(size.id)}
                    />
                    <Label htmlFor={`size-${size.id}`} className="text-sm font-normal">
                      {size.label}
                    </Label>
                  </div>
                )
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
