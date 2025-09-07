"use client"

import Link from "next/link"
import Image from "next/image"
import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"
import EmptyCart from "./empty-cart"

export default function CartDrawer({ setIsOpen }) {
  const { cart, updateQuantity, removeItem } = useCart()

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (cart.length === 0) {
    return <EmptyCart />
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 py-6">
        <h2 className="text-lg font-semibold">Shopping Cart ({cart.length})</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-md">
                <Image
                  src={item.image || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=80&q=80"}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex flex-1 flex-col">
                <div className="flex justify-between">
                  <h3 className="font-medium">{item.name}</h3>
                  <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="h-8 w-8">
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>

                <div className="text-sm text-muted-foreground space-y-1">
                  {item.size && <p>Size: {item.size}</p>}
                  {item.color && <p>Color: {item.color}</p>}
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-r-none bg-transparent"
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value))}
                      className="h-8 w-12 rounded-none border-x-0 text-center"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-l-none bg-transparent"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </Button>
                  </div>

                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span>Calculated at checkout</span>
          </div>

          <Separator />

          <div className="flex items-center justify-between font-semibold">
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex flex-col gap-2">
            <Button size="lg" asChild onClick={() => setIsOpen(false)}>
              <Link href="/checkout">Checkout</Link>
            </Button>
            <Button variant="outline" size="lg" asChild onClick={() => setIsOpen(false)}>
              <Link href="/cart">View Cart</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
