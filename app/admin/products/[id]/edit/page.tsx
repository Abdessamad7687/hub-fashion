"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, Save, Plus, X, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { config } from "@/lib/config"

interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  gender: string
  categoryId: string
  images: Array<{ url: string }>
  sizes: Array<{ size: string }>
  colors: Array<{ color: string }>
  features: Array<{ name: string; value: string }>
  category: { id: string; name: string }
}

interface Category {
  id: string
  name: string
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  
  const [product, setProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    gender: "HOMME",
    categoryId: "",
    images: [""],
    sizes: ["S", "M", "L"],
    colors: ["Black", "White"],
    features: [{ name: "Material", value: "100% Cotton" }]
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    fetchProduct()
    fetchCategories()
  }, [productId])

  const fetchProduct = async () => {
    try {
      setIsFetching(true)
      const response = await fetch(`${config.api.baseUrl}/api/products/${productId}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          toast({
            title: "Product not found",
            description: "The product you're looking for doesn't exist.",
            variant: "destructive"
          })
          router.push("/admin/products")
          return
        }
        throw new Error("Failed to fetch product")
      }

      const data = await response.json()
      setProduct(data)
      setFormData({
        name: data.name || "",
        description: data.description || "",
        price: data.price?.toString() || "",
        stock: data.stock?.toString() || "",
        gender: data.gender || "HOMME",
        categoryId: data.categoryId || "",
        images: data.images?.map((img: any) => img.url) || [""],
        sizes: data.sizes?.map((size: any) => size.size) || ["S", "M", "L"],
        colors: data.colors?.map((color: any) => color.color) || ["Black", "White"],
        features: data.features?.map((feat: any) => ({ name: feat.name, value: feat.value })) || [{ name: "Material", value: "100% Cotton" }]
      })
    } catch (error: any) {
      console.error("Error fetching product:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to fetch product data.",
        variant: "destructive"
      })
      router.push("/admin/products")
    } finally {
      setIsFetching(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${config.api.baseUrl}/api/categories`)
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        images: formData.images.filter(img => img.trim() !== "").map(url => ({ url })),
        sizes: formData.sizes.filter(size => size.trim() !== "").map(size => ({ size })),
        colors: formData.colors.filter(color => color.trim() !== "").map(color => ({ color })),
        features: formData.features.filter(feat => feat.name.trim() !== "" && feat.value.trim() !== "")
      }

      const response = await fetch(`${config.api.baseUrl}/api/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update product")
      }

      toast({
        title: "Success!",
        description: "Product updated successfully.",
      })

      router.push("/admin/products")
    } catch (error: any) {
      console.error("Error updating product:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update product.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ""]
    }))
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const updateImage = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img)
    }))
  }

  const addSize = () => {
    setFormData(prev => ({
      ...prev,
      sizes: [...prev.sizes, ""]
    }))
  }

  const removeSize = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }))
  }

  const updateSize = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.map((size, i) => i === index ? value : size)
    }))
  }

  const addColor = () => {
    setFormData(prev => ({
      ...prev,
      colors: [...prev.colors, ""]
    }))
  }

  const removeColor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }))
  }

  const updateColor = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.map((color, i) => i === index ? value : color)
    }))
  }

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, { name: "", value: "" }]
    }))
  }

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const updateFeature = (index: number, field: 'name' | 'value', value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feat, i) => 
        i === index ? { ...feat, [field]: value } : feat
      )
    }))
  }

  if (isFetching) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading product...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button asChild>
            <Link href="/admin/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Edit Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Update the basic product details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Product Name *
                </label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium">
                  Price *
                </label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="stock" className="text-sm font-medium">
                  Stock Quantity *
                </label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                  placeholder="0"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="gender" className="text-sm font-medium">
                  Gender
                </label>
                <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HOMME">Men</SelectItem>
                    <SelectItem value="FEMME">Women</SelectItem>
                    <SelectItem value="ENFANT">Kids</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Category *
                </label>
                <Select value={formData.categoryId} onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter product description"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Product Images */}
        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
            <CardDescription>
              Add product images (URLs)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.images.map((image, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={image}
                  onChange={(e) => updateImage(index, e.target.value)}
                  placeholder="Enter image URL"
                  type="url"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeImage(index)}
                  disabled={formData.images.length === 1}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addImage}>
              <Plus className="mr-2 h-4 w-4" />
              Add Image
            </Button>
          </CardContent>
        </Card>

        {/* Product Sizes */}
        <Card>
          <CardHeader>
            <CardTitle>Product Sizes</CardTitle>
            <CardDescription>
              Available sizes for this product
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {formData.sizes.map((size, index) => (
                <div key={index} className="flex items-center gap-1">
                  <Input
                    value={size}
                    onChange={(e) => updateSize(index, e.target.value)}
                    placeholder="Size"
                    className="w-20"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeSize(index)}
                    disabled={formData.sizes.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" onClick={addSize}>
              <Plus className="mr-2 h-4 w-4" />
              Add Size
            </Button>
          </CardContent>
        </Card>

        {/* Product Colors */}
        <Card>
          <CardHeader>
            <CardTitle>Product Colors</CardTitle>
            <CardDescription>
              Available colors for this product
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {formData.colors.map((color, index) => (
                <div key={index} className="flex items-center gap-1">
                  <Input
                    value={color}
                    onChange={(e) => updateColor(index, e.target.value)}
                    placeholder="Color"
                    className="w-24"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeColor(index)}
                    disabled={formData.colors.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" onClick={addColor}>
              <Plus className="mr-2 h-4 w-4" />
              Add Color
            </Button>
          </CardContent>
        </Card>

        {/* Product Features */}
        <Card>
          <CardHeader>
            <CardTitle>Product Features</CardTitle>
            <CardDescription>
              Key features and specifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.features.map((feature, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Input
                  value={feature.name}
                  onChange={(e) => updateFeature(index, 'name', e.target.value)}
                  placeholder="Feature name"
                />
                <Input
                  value={feature.value}
                  onChange={(e) => updateFeature(index, 'value', e.target.value)}
                  placeholder="Feature value"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeFeature(index)}
                  disabled={formData.features.length === 1}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addFeature}>
              <Plus className="mr-2 h-4 w-4" />
              Add Feature
            </Button>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              "Updating..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Update Product
              </>
            )}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/products">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
