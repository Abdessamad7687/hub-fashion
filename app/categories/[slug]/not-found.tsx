import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CategoryNotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <div className="mx-auto max-w-md">
        <h1 className="mb-4 text-3xl font-bold tracking-tight">Category Not Found</h1>
        <p className="mb-8 text-muted-foreground">
          Sorry, we couldn't find the category you're looking for. It may have been moved or doesn't exist.
        </p>
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Button asChild>
            <Link href="/products">Browse All Products</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}




