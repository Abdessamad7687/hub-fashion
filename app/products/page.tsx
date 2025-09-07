import { Suspense } from "react"
import ProductFilters from "@/components/product-filters"
import ProductGrid from "@/components/product-grid"
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
  const { category, sort, price } = searchParams

  return (
    <div className="container py-8">
      <ResponsiveBreadcrumb />
      <h1 className="mb-8 text-3xl font-bold tracking-tight">All Products</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[240px_1fr]">
        <ProductFilters />
        <div>
          <Suspense fallback={<ProductsLoading />}>
            <ProductGrid category={category} sort={sort} price={price} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
