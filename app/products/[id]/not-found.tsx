import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center py-16 text-center">
      <h1 className="text-4xl font-bold tracking-tight">Product Not Found</h1>
      <p className="mt-4 text-muted-foreground">Sorry, we couldn't find the product you're looking for.</p>
      <div className="mt-8 flex gap-4">
        <Button asChild>
          <Link href="/products">Browse All Products</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  )
}
