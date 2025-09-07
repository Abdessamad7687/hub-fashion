"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/lib/cart-context"
import EmptyCart from "@/components/empty-cart"

export default function CartPage() {
  const { cart, updateQuantity, removeItem } = useCart()
  const [subtotal, setSubtotal] = useState(0)

  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    setSubtotal(total)
  }, [cart])

  if (cart.length === 0) {
    return <EmptyCart />
  }

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Shopping Cart</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-lg border">
            <div className="hidden border-b p-4 md:grid md:grid-cols-[2fr_1fr_1fr_auto]">
              <div>Product</div>
              <div>Price</div>
              <div>Quantity</div>
              <div></div>
            </div>

            {cart.map((item) => (
              <div key={item.id} className="grid grid-cols-1 border-b p-4 md:grid-cols-[2fr_1fr_1fr_auto]">
                <div className="mb-4 flex items-center gap-4 md:mb-0">
                  <div className="relative h-20 w-20 overflow-hidden rounded-md">
                    <Image
                      src={item.image || "/placeholder.svg?height=80&width=80&query=product"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">Size: M</p>
                  </div>
                </div>

                <div className="mb-4 flex items-center md:mb-0">
                  <span className="md:hidden">Price: </span>
                  <span>${item.price.toFixed(2)}</span>
                </div>

                <div className="mb-4 flex items-center md:mb-0">
                  <span className="md:hidden">Quantity: </span>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value))}
                    className="w-20"
                  />
                </div>

                <div className="flex items-center justify-end">
                  <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} aria-label="Remove item">
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>

            <div className="mb-4 flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="mb-4 flex justify-between">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>

            <div className="mb-4 border-t pt-4">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <Button className="w-full" size="lg" asChild>
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
