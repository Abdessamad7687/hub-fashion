import Link from "next/link"
import { CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function ConfirmationPage() {
  return (
    <div className="container flex flex-col items-center py-16 text-center">
      <div className="mb-6 rounded-full bg-primary/10 p-4">
        <CheckCircle className="h-16 w-16 text-primary" />
      </div>

      <h1 className="mb-4 text-3xl font-bold tracking-tight">Order Confirmed!</h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        Thank you for your purchase. Your order #12345 has been confirmed and will be shipped shortly.
      </p>

      <div className="mb-8 w-full max-w-md rounded-lg border p-6 text-left">
        <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>

        <div className="mb-4 flex justify-between">
          <span>Order number:</span>
          <span>#12345</span>
        </div>

        <div className="mb-4 flex justify-between">
          <span>Date:</span>
          <span>July 25, 2025</span>
        </div>

        <div className="mb-4 flex justify-between">
          <span>Total:</span>
          <span>$129.99</span>
        </div>

        <div className="mb-4 flex justify-between">
          <span>Payment method:</span>
          <span>Credit Card</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Button asChild>
          <Link href="/account/orders">View Order</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  )
}
