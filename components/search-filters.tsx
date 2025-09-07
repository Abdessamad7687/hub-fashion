"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export default function SearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [priceRange, setPriceRange] = useState([0, 200])

  const categories = [
    { id: "men", label: "Men's Clothing" },
    { id: "women", label: "Women's Clothing" },
    { id: "accessories", label: "Accessories" },
    { id: "footwear", label: "Footwear" },
  ]

  const colors = [
    { id: "black", label: "Black" },
    { id: "white", label: "White" },
    { id: "blue", label: "Blue" },
    { id: "red", label: "Red" },
    { id: "green", label: "Green" },
  ]

  const sizes = [
    { id: "xs", label: "XS" },
    { id: "s", label: "S" },
    { id: "m", label: "M" },
    { id: "l", label: "L" },
    { id: "xl", label: "XL" },
  ]

  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams)
    params.set("category", categoryId)
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
              {colors.map((color) => (
                <div key={color.id} className="flex items-center space-x-2">
                  <Checkbox id={`color-${color.id}`} />
                  <Label htmlFor={`color-${color.id}`} className="text-sm font-normal">
                    {color.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="size">
          <AccordionTrigger>Size</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {sizes.map((size) => (
                <div key={size.id} className="flex items-center space-x-2">
                  <Checkbox id={`size-${size.id}`} />
                  <Label htmlFor={`size-${size.id}`} className="text-sm font-normal">
                    {size.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
