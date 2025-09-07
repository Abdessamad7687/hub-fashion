import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Eye } from "lucide-react"
import { config } from "@/lib/config"
import DeleteCategoryDialog from "@/components/admin/delete-category-dialog"

// Helper function to generate category slug
function getCategorySlug(categoryName: string): string {
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

async function fetchCategories() {
  const res = await fetch(`${config.api.baseUrl}/api/categories`, { cache: "no-store" })
  if (!res.ok) return []
  return res.json()
}

export default async function CategoriesPage() {
  const categories = await fetchCategories()

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">Manage your product categories</p>
        </div>
        <Button asChild>
          <Link href="/admin/categories/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Link>
        </Button>
      </div>

      {categories.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">No categories found</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first category
              </p>
              <Button asChild>
                <Link href="/admin/categories/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Category
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category: any) => (
            <Card key={category.id} className="overflow-hidden">
              <div className="aspect-[3/2] relative">
                <Image
                  src={category.image || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {category.name}
                  <Badge variant="secondary">
                    {category.products?.length || 0} products
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {category.description || "No description provided"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link href={`/admin/categories/${category.id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link href={`/categories/${getCategorySlug(category.name)}`} target="_blank">
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Link>
                  </Button>
                  <DeleteCategoryDialog 
                    categoryId={category.id} 
                    categoryName={category.name} 
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}