"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Upload, Save } from "lucide-react"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"
import { config } from "@/lib/config"

export default function NewCategoryPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`${config.api.baseUrl}/api/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to create category")
      }

      toast({
        title: "Success!",
        description: "Category created successfully.",
      })

      router.push("/admin/categories")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create category. Please try again.",
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

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/categories">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Categories
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Category</h1>
          <p className="text-muted-foreground">Add a new product category to your store</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Information</CardTitle>
          <CardDescription>
            Fill in the details for your new category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Men's Clothing"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe this category..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <div className="flex gap-2">
                <Input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
                <Button type="button" variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                You can use an image URL or upload a file
              </p>
            </div>

            {formData.image && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="aspect-[3/2] w-full max-w-md relative overflow-hidden rounded-lg border">
                  <img
                    src={formData.image}
                    alt="Category preview"
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  "Creating..."
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Category
                  </>
                )}
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/categories">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

