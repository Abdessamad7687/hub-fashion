"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, Save, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { config } from "@/lib/config"

interface Category {
  id: string
  name: string
  description: string
  image: string
}

export default function EditCategoryPage() {
  const router = useRouter()
  const params = useParams()
  const categoryId = params.id as string
  
  const [category, setCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    fetchCategory()
  }, [categoryId])

  const fetchCategory = async () => {
    try {
      setIsFetching(true)
      const response = await fetch(`${config.api.baseUrl}/api/categories/${categoryId}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          toast({
            title: "Category not found",
            description: "The category you're looking for doesn't exist.",
            variant: "destructive"
          })
          router.push("/admin/categories")
          return
        }
        throw new Error("Failed to fetch category")
      }

      const data = await response.json()
      setCategory(data)
      setFormData({
        name: data.name || "",
        description: data.description || "",
        image: data.image || ""
      })
    } catch (error: any) {
      console.error("Error fetching category:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to fetch category data.",
        variant: "destructive"
      })
      router.push("/admin/categories")
    } finally {
      setIsFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`${config.api.baseUrl}/api/categories/${categoryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update category")
      }

      toast({
        title: "Success!",
        description: "Category updated successfully.",
      })

      router.push("/admin/categories")
    } catch (error: any) {
      console.error("Error updating category:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update category.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="container mx-auto py-8 max-w-2xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading category...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="container mx-auto py-8 max-w-2xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Category not found</h1>
          <Button asChild>
            <Link href="/admin/categories">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Categories
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/categories">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Edit Category</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Information</CardTitle>
          <CardDescription>
            Update the category details below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Category Name *
              </label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter category name"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter category description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="image" className="text-sm font-medium">
                Image URL
              </label>
              <div className="flex gap-2">
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="Enter image URL"
                  type="url"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const url = prompt("Enter image URL:")
                    if (url) {
                      setFormData(prev => ({ ...prev, image: url }))
                    }
                  }}
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {formData.image && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Image Preview</label>
                <div className="relative w-full h-48 rounded-md overflow-hidden border">
                  <Image
                    src={formData.image}
                    alt="Category preview"
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  "Updating..."
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update Category
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/categories">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
