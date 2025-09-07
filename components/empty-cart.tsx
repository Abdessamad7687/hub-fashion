import Link from "next/link"
import { ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function EmptyCart() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-4 text-center">
      <div className="mb-4 rounded-full bg-muted p-6">
        <ShoppingBag className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-xl font-semibold">Your cart is empty</h3>
      <p className="mb-6 text-muted-foreground">Looks like you haven't added any products to your cart yet.</p>
      <Button asChild>
        <Link href="/products">Continue Shopping</Link>
      </Button>
    </div>
  )
}
