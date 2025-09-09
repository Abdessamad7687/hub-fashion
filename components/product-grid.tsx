import Image from "next/image"
import Link from "next/link"

import { config } from "@/lib/config"
import AddToCartButton from "./add-to-cart-button"
import ClientWrapper from "./client-wrapper"
import Pagination from "./pagination"

interface ProductGridProps {
  category?: string | string[]
  sort?: string | string[]
  price?: string | string[]
  page?: string | string[]
  showPagination?: boolean
}

export default async function ProductGrid({
  category,
  sort,
  price,
  page,
  showPagination = true,
}: ProductGridProps) {
  // Build query parameters
  const params = new URLSearchParams()
  if (category) params.append('category', category as string)
  if (sort) params.append('sort', sort as string)
  if (price) params.append('price', price as string)
  if (page) params.append('page', page as string)
  
  // Fetch products from API
  const res = await fetch(`${config.api.baseUrl}/api/products?${params.toString()}`, { cache: "no-store" })
  if (!res.ok) {
    return (
      <div className="flex h-[400px] w-full flex-col items-center justify-center rounded-lg border bg-muted/40 p-8 text-center">
        <h3 className="text-xl font-semibold">Error loading products</h3>
        <p className="text-muted-foreground">Please try again later.</p>
      </div>
    )
  }
  
  const data = await res.json()
  const products = data.products || []
  const pagination = data.pagination

  if (products.length === 0) {
    return (
      <div className="flex h-[400px] w-full flex-col items-center justify-center rounded-lg border bg-muted/40 p-8 text-center">
        <h3 className="text-xl font-semibold">No products found</h3>
        <p className="text-muted-foreground">Try adjusting your filters or search term.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div key={product.id} className="group relative overflow-hidden rounded-lg border bg-background">
            <Link href={`/products/${product.id}`} className="relative block aspect-square overflow-hidden">
              <Image
                src={product.images?.[0]?.url || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              />
              {product.isNew && (
                <div className="absolute left-2 top-2 rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                  New
                </div>
              )}
              {product.discount && (
                <div className="absolute right-2 top-2 rounded-full bg-destructive px-2 py-1 text-xs font-medium text-destructive-foreground">
                  {product.discount}% OFF
                </div>
              )}
            </Link>

            <div className="p-4">
              <Link href={`/products/${product.id}`} className="hover:underline">
                <h3 className="font-medium">{product.name}</h3>
              </Link>
              <p className="mt-1 text-sm text-muted-foreground">{product.category?.name || 'Uncategorized'}</p>
              
              {/* Colors and Sizes */}
              <div className="mt-2 space-y-1">
                {product.colors && product.colors.length > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">Colors:</span>
                    <div className="flex gap-1">
                      {product.colors.slice(0, 2).map((color: any, index: number) => (
                        <span key={index} className="text-xs bg-secondary px-1.5 py-0.5 rounded">
                          {color.color}
                        </span>
                      ))}
                      {product.colors.length > 2 && (
                        <span className="text-xs text-muted-foreground">+{product.colors.length - 2}</span>
                      )}
                    </div>
                  </div>
                )}
                
                {product.sizes && product.sizes.length > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">Sizes:</span>
                    <div className="flex gap-1">
                      {product.sizes.slice(0, 3).map((size: any, index: number) => (
                        <span key={index} className="text-xs border px-1.5 py-0.5 rounded">
                          {size.size}
                        </span>
                      ))}
                      {product.sizes.length > 3 && (
                        <span className="text-xs text-muted-foreground">+{product.sizes.length - 3}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-3 flex items-center justify-between">
                <div>
                  {product.originalPrice ? (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">${product.price.toFixed(2)}</span>
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <span className="font-semibold">${product.price.toFixed(2)}</span>
                  )}
                </div>
                <ClientWrapper fallback={<div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />}>
                  <AddToCartButton product={product} variant="secondary" />
                </ClientWrapper>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {showPagination && pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalCount={pagination.totalCount}
          hasNextPage={pagination.hasNextPage}
          hasPrevPage={pagination.hasPrevPage}
          limit={pagination.limit}
        />
      )}
    </div>
  )
}
