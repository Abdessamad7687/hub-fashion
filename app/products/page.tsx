import { Suspense } from "react"
import ProductFilters from "@/components/product-filters"
import ProductGrid from "@/components/product-grid"
import ProductSort from "@/components/product-sort"
import ProductsLoading from "./loading"
import { ResponsiveBreadcrumb } from "@/components/responsive-breadcrumb"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Products | StyleHub",
  description: "Browse our collection of fashion products",
}

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const { category, sort, price, page } = searchParams

  return (
    <div className="container py-8">
      <ResponsiveBreadcrumb />
      <h1 className="mb-8 text-3xl font-bold tracking-tight">All Products</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[240px_1fr]">
        <ProductFilters />
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Products</h2>
            <ProductSort />
          </div>
          <Suspense fallback={<ProductsLoading />}>
            <ProductGrid category={category} sort={sort} price={price} page={page} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
