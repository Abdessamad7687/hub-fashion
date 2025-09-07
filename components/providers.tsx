"use client"

import { ReactNode } from "react"
import { CartProvider } from "@/lib/cart-context"
import { WishlistProvider } from "@/lib/wishlist-context"
import { AuthProvider } from "@/lib/auth-context"
import { OrderProvider } from "@/lib/order-context"

interface ProvidersProps {
  children: ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <OrderProvider>
            {children}
          </OrderProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  )
}
