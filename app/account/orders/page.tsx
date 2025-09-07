"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Package, Eye, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { useOrders } from "@/lib/order-context"

export default function OrdersPage() {
  const { isAuthenticated } = useAuth()
  const { orders, fetchUserOrders } = useOrders()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('Orders page useEffect - isAuthenticated:', isAuthenticated);
    if (isAuthenticated) {
      console.log('Fetching user orders...');
      fetchUserOrders().finally(() => {
        console.log('Orders fetched, setting loading to false');
        setIsLoading(false);
      });
    } else {
      console.log('User not authenticated, setting loading to false');
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchUserOrders])

  console.log('Orders page render - orders:', orders, 'isLoading:', isLoading, 'isAuthenticated:', isAuthenticated);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="container flex flex-col items-center justify-center py-16 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Sign in to view your orders</h1>
        <p className="mt-4 text-muted-foreground">You need to be signed in to view your order history.</p>
        <Button className="mt-8" asChild>
          <Link href="/account/login">Sign In</Link>
        </Button>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="container flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 rounded-full bg-muted p-6">
          <Package className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">No orders yet</h1>
        <p className="mt-4 text-muted-foreground">When you place your first order, it will appear here.</p>
        <Button className="mt-8" asChild>
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
        <p className="text-muted-foreground">View and track your orders</p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Order {order.id}</CardTitle>
                  <p className="text-sm text-muted-foreground">Placed on {order.createdAt.toLocaleDateString()}</p>
                </div>
                <Badge className={getStatusColor(order.status)}>{order.status.toUpperCase()}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-sm font-medium">Total</p>
                    <p className="text-lg font-semibold">${order.total.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Items</p>
                    <p className="text-sm text-muted-foreground">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Shipping Address</p>
                    <p className="text-sm text-muted-foreground">
                      {order.shippingAddress ? 
                        `${order.shippingAddress.city}, ${order.shippingAddress.state}` : 
                        'Not available'
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Estimated Delivery</p>
                    <p className="text-sm text-muted-foreground">{order.estimatedDelivery?.toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/checkout/confirmation/${order.id}`}>
                      <Eye className="mr-1 h-3 w-3" />
                      View Details
                    </Link>
                  </Button>
                  {order.status === "shipped" && (
                    <Button variant="outline" size="sm">
                      <Truck className="mr-1 h-3 w-3" />
                      Track Package
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
