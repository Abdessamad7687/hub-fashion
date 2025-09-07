import { config } from "@/lib/config"
import Image from "next/image"
import Link from "next/link"
import AddToCartButton from "./add-to-cart-button"
import ClientWrapper from "./client-wrapper"

export default async function RelatedProducts({ currentProductId }: { currentProductId: string }) {
  // Fetch products from API and exclude the current one
  const res = await fetch(`${config.api.baseUrl}/api/products`, { cache: "no-store" })
  if (!res.ok) return null
  const products = await res.json()
  const relatedProducts = products.filter((product: any) => product.id !== currentProductId).slice(0, 4)

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {relatedProducts.map((product) => (
        <div key={product.id} className="group relative overflow-hidden rounded-lg border bg-background">
          <Link href={`/products/${product.id}`} className="relative block aspect-square overflow-hidden">
            <Image
              src={product.images?.[0]?.url || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            {product.isNew && (
              <div className="absolute left-2 top-2 rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                New
              </div>
            )}
          </Link>

          <div className="p-4">
            <Link href={`/products/${product.id}`} className="hover:underline">
              <h3 className="font-medium">{product.name}</h3>
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">{product.category?.name || 'Uncategorized'}</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="font-semibold">${product.price.toFixed(2)}</span>
              <ClientWrapper fallback={<div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />}>
                <AddToCartButton product={product} variant="secondary" size="sm" />
              </ClientWrapper>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
