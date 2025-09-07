"use client"

import { useCart } from "@/lib/cart-context"

export default function CheckoutSummary() {
  const { cart } = useCart()

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 0 // Free shipping
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shipping + tax

  return (
    <div className="rounded-lg border p-6">
      <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>

      <div className="space-y-4">
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
            </div>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}

        <div className="border-t pt-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
          </div>

          <div className="flex justify-between">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>

          <div className="flex justify-between border-t pt-4 font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
