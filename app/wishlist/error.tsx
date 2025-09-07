"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function WishlistError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Wishlist error:", error)
  }, [error])

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-16">
      <div className="mx-auto max-w-md text-center">
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Wishlist Error</AlertTitle>
          <AlertDescription>
            {error.message || "There was a problem loading your wishlist."}
          </AlertDescription>
        </Alert>
        
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Button onClick={reset} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>
          <Button variant="outline" asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}








