"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload, Save, Plus, X } from "lucide-react"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"
import { config } from "@/lib/config"

interface Category {
  id: string
  name: string
}

export default function NewProductPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
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

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${config.api.baseUrl}/api/categories`)
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error)
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

      const response = await fetch(`${config.api.baseUrl}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create product")
      }

      toast({
        title: "Success!",
        description: "Product created successfully.",
      })

      router.push("/admin/products")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images]
    newImages[index] = value
    setFormData(prev => ({
      ...prev,
      images: newImages
    }))
  }

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ""]
    }))
  }

  const removeImageField = (index: number) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index)
      setFormData(prev => ({
        ...prev,
        images: newImages
      }))
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Product</h1>
          <p className="text-muted-foreground">Add a new product to your store</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Essential details about your product
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Classic T-Shirt"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoryId">Category *</Label>
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
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your product..."
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="29.99"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity *</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="100"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HOMME">Men</SelectItem>
                    <SelectItem value="FEMME">Women</SelectItem>
                    <SelectItem value="ENFANT">Children</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
            <CardDescription>
              Add images to showcase your product
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.images.map((image, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={image}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1"
                />
                {formData.images.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeImageField(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            
            <Button type="button" variant="outline" onClick={addImageField}>
              <Plus className="mr-2 h-4 w-4" />
              Add Another Image
            </Button>

            {formData.images.some(img => img.trim() !== "") && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {formData.images.filter(img => img.trim() !== "").map((image, index) => (
                  <div key={index} className="aspect-square relative overflow-hidden rounded-lg border">
                    <img
                      src={image}
                      alt={`Product image ${index + 1}`}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Sizes</CardTitle>
            <CardDescription>
              Add available sizes for this product
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.sizes.map((size, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={size}
                  onChange={(e) => {
                    const newSizes = [...formData.sizes]
                    newSizes[index] = e.target.value
                    setFormData(prev => ({ ...prev, sizes: newSizes }))
                  }}
                  placeholder="e.g., S, M, L, XL"
                  className="flex-1"
                />
                {formData.sizes.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newSizes = formData.sizes.filter((_, i) => i !== index)
                      setFormData(prev => ({ ...prev, sizes: newSizes }))
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            
            <Button type="button" variant="outline" onClick={() => {
              setFormData(prev => ({ ...prev, sizes: [...prev.sizes, ""] }))
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Another Size
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Colors</CardTitle>
            <CardDescription>
              Add available colors for this product
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.colors.map((color, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={color}
                  onChange={(e) => {
                    const newColors = [...formData.colors]
                    newColors[index] = e.target.value
                    setFormData(prev => ({ ...prev, colors: newColors }))
                  }}
                  placeholder="e.g., Black, White, Red, Blue"
                  className="flex-1"
                />
                {formData.colors.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newColors = formData.colors.filter((_, i) => i !== index)
                      setFormData(prev => ({ ...prev, colors: newColors }))
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            
            <Button type="button" variant="outline" onClick={() => {
              setFormData(prev => ({ ...prev, colors: [...prev.colors, ""] }))
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Another Color
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Features</CardTitle>
            <CardDescription>
              Add product features and specifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={feature.name}
                  onChange={(e) => {
                    const newFeatures = [...formData.features]
                    newFeatures[index] = { ...newFeatures[index], name: e.target.value }
                    setFormData(prev => ({ ...prev, features: newFeatures }))
                  }}
                  placeholder="Feature name (e.g., Material, Brand)"
                  className="flex-1"
                />
                <Input
                  value={feature.value}
                  onChange={(e) => {
                    const newFeatures = [...formData.features]
                    newFeatures[index] = { ...newFeatures[index], value: e.target.value }
                    setFormData(prev => ({ ...prev, features: newFeatures }))
                  }}
                  placeholder="Feature value (e.g., 100% Cotton)"
                  className="flex-1"
                />
                {formData.features.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newFeatures = formData.features.filter((_, i) => i !== index)
                      setFormData(prev => ({ ...prev, features: newFeatures }))
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            
            <Button type="button" variant="outline" onClick={() => {
              setFormData(prev => ({ ...prev, features: [...prev.features, { name: "", value: "" }] }))
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Another Feature
            </Button>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              "Creating..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Product
              </>
            )}
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/products">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}

