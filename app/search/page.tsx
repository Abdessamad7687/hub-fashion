import { Suspense } from "react"
import SearchResults from "@/components/search-results"
import SearchFilters from "@/components/search-filters"

export const metadata = {
  title: "Search Results | StyleHub",
  description: "Search results for products",
}

interface SearchPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = typeof searchParams.q === "string" ? searchParams.q : ""
  const category = searchParams.category
  const sort = searchParams.sort
  const price = searchParams.price

  if (!query) {
    return (
      <div className="container py-8">
        <div className="flex h-[400px] w-full flex-col items-center justify-center rounded-lg border bg-muted/40 p-8 text-center">
          <h1 className="text-2xl font-semibold">Search Products</h1>
          <p className="text-muted-foreground">Enter a search term to find products.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Search Results</h1>
        <p className="text-muted-foreground">{query ? `Results for "${query}"` : "All products"}</p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[240px_1fr]">
        <SearchFilters />
        <div>
          <Suspense fallback={<SearchResultsLoading />}>
            <SearchResults query={query} category={category} sort={sort} price={price} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function SearchResultsLoading() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-lg bg-muted">
          <div className="aspect-square w-full rounded-t-lg bg-muted-foreground/10" />
          <div className="p-4">
            <div className="mb-2 h-4 w-2/3 rounded bg-muted-foreground/10" />
            <div className="mb-4 h-3 w-1/2 rounded bg-muted-foreground/10" />
            <div className="h-5 w-1/3 rounded bg-muted-foreground/10" />
          </div>
        </div>
      ))}
    </div>
  )
}
