import { notFound } from "next/navigation"
import { Star } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import WishlistButton from "@/components/wishlist-button"
import ShareButton from "@/components/share-button"
import ProductImageGallery from "@/components/product-image-gallery"
import ProductActions from "@/components/product-actions"
import ProductReviews from "@/components/product-reviews"
import RelatedProducts from "@/components/related-products"
import { ResponsiveBreadcrumb } from "@/components/responsive-breadcrumb"
import { config } from "@/lib/config"

export async function generateMetadata({ params }: { params: { id: string } }) {
  const res = await fetch(`${config.api.baseUrl}/api/products/${params.id}`, { cache: "no-store" })
  const product = res.ok ? await res.json() : null

  if (!product) {
    return {
      title: "Product Not Found | StyleHub",
    }
  }

  return {
    title: `${product.name} | StyleHub`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const res = await fetch(`${config.api.baseUrl}/api/products/${params.id}`, { cache: "no-store" })
  if (!res.ok) {
    notFound()
  }
  const product = await res.json()

  // Fetch reviews to get real rating and count
  const reviewsRes = await fetch(`${config.api.baseUrl}/api/reviews?productId=${params.id}`, { cache: "no-store" })
  const reviews = reviewsRes.ok ? await reviewsRes.json() : []
  
  // Calculate real rating and review count
  const reviewCount = reviews.length
  const averageRating = reviewCount > 0 
    ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviewCount 
    : 0

  // Use real API data
  const productDetails = {
    ...product,
    rating: averageRating,
    reviewCount: reviewCount,
    inStock: product.stock > 0,
    stockCount: product.stock,
    sizes: product.sizes?.map((s: any) => s.size) || [],
    colors: product.colors?.map((c: any) => ({ name: c.color, value: c.color })) || [],
    features: product.features?.map((f: any) => `${f.name}: ${f.value}`) || [],
    specifications: product.features?.reduce((acc: any, feature: any) => {
      acc[feature.name] = feature.value
      return acc
    }, {}) || {
      Material: "Not specified",
      "Care Instructions": "Not specified",
      "Country of Origin": "Not specified",
      Fit: "Not specified",
    },
  }

  // Generate breadcrumb items
  const breadcrumbItems = [
    { label: "Products", href: "/products" },
    ...(product.category ? [{ label: product.category.name, href: `/categories/${product.category.name.toLowerCase()}` }] : []),
    { label: product.name }
  ]

  return (
    <div className="container py-8">
      <ResponsiveBreadcrumb items={breadcrumbItems} />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          <ProductImageGallery product={productDetails} />
        </div>

        {/* Product Details */}
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              {productDetails.isNew && <Badge variant="secondary">New</Badge>}
              {productDetails.discount && <Badge variant="destructive">{productDetails.discount}% OFF</Badge>}
            </div>

            <h1 className="text-3xl font-bold tracking-tight">{productDetails.name}</h1>

            <div className="mt-2 flex items-center gap-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(productDetails.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
                <span className="ml-1 text-sm text-muted-foreground">
                  {productDetails.reviewCount > 0 
                    ? `${productDetails.rating.toFixed(1)} (${productDetails.reviewCount} reviews)`
                    : "No reviews yet"
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold">${productDetails.price.toFixed(2)}</div>
            {productDetails.originalPrice && (
              <div className="text-xl text-muted-foreground line-through">
                ${productDetails.originalPrice.toFixed(2)}
              </div>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${productDetails.inStock ? "bg-green-500" : "bg-red-500"}`} />
            <span className="text-sm">
              {productDetails.inStock ? `In stock (${productDetails.stockCount} available)` : "Out of stock"}
            </span>
          </div>

          {/* Description */}
          <div>
            <p className="text-muted-foreground leading-relaxed">{productDetails.description}</p>
          </div>

          {/* Product Actions (Size, Color, Add to Cart) */}
          <ProductActions product={productDetails} disabled={!productDetails.inStock} />

          {/* Additional Actions */}
          <div className="flex gap-4">
            <WishlistButton product={productDetails} size="lg" />
            <ShareButton product={productDetails} size="lg" />
          </div>

          {/* Features */}
          <div>
            <h3 className="mb-3 font-semibold">Key Features</h3>
            <ul className="space-y-2">
              {productDetails.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({productDetails.reviewCount})</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <div className="prose max-w-none">
              <p className="text-muted-foreground leading-relaxed">{productDetails.description}</p>
            </div>
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {Object.entries(productDetails.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b pb-2">
                  <span className="font-medium">{key}:</span>
                  <span className="text-muted-foreground">{value}</span>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <ProductReviews productId={params.id} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="mb-6 text-2xl font-bold">You May Also Like</h2>
        <RelatedProducts currentProductId={params.id} />
      </div>
    </div>
  )
}
