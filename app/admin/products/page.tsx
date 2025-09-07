import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Eye } from "lucide-react"
import { config } from "@/lib/config"

async function fetchProducts() {
  const res = await fetch(`${config.api.baseUrl}/api/products`, { cache: "no-store" })
  if (!res.ok) return []
  return res.json()
}

export default async function ProductsPage() {
  const products = await fetchProducts()

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first product
              </p>
              <Button asChild>
                <Link href="/admin/products/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Product
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: any) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-square relative">
                <Image
                  src={product.images?.[0]?.url || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                <Badge className="absolute top-2 left-2">
                  {product.category?.name || "Uncategorized"}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2">{product.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {product.description || "No description provided"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">${product.price}</span>
                    <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                      {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                    </Badge>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link href={`/products/${product.id}`} target="_blank">
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Link>
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}