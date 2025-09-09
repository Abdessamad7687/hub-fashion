"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Package, Eye, Truck, ArrowLeft, Calendar, MapPin, CreditCard } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth-context"
import { useOrders } from "@/lib/order-context"

export default function OrdersPage() {
  const { isAuthenticated } = useAuth()
  const { orders, fetchUserOrders } = useOrders()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('=== Orders page useEffect ===');
    console.log('isAuthenticated:', isAuthenticated);
    console.log('fetchUserOrders function:', typeof fetchUserOrders);
    
    if (isAuthenticated) {
      console.log('User is authenticated, fetching user orders...');
      fetchUserOrders().finally(() => {
        console.log('Orders fetch completed, setting loading to false');
        setIsLoading(false);
      });
    } else {
      console.log('User not authenticated, setting loading to false');
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchUserOrders])

  const handleRefresh = async () => {
    console.log('Manually refreshing user orders...');
    setIsLoading(true);
    try {
      await fetchUserOrders();
    } catch (error) {
      console.error('Error refreshing orders:', error);
    } finally {
      setIsLoading(false);
    }
  }

  console.log('Orders page render - orders:', orders, 'isLoading:', isLoading, 'isAuthenticated:', isAuthenticated);
  console.log('Token in localStorage:', typeof window !== 'undefined' && localStorage.getItem('token') ? 'Found' : 'Not found');
  console.log('Number of orders:', orders.length);

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container flex flex-col items-center justify-center py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="mb-6 rounded-full bg-muted/50 p-6 w-fit mx-auto">
              <Package className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-4">Sign in to view your orders</h1>
            <p className="text-muted-foreground mb-8">You need to be signed in to view your order history.</p>
            <Button className="shadow-sm" asChild>
              <Link href="/account/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container py-6 lg:py-8">
          <div className="py-4">
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">Home</Link>
              <span>/</span>
              <Link href="/account" className="hover:text-foreground">My Account</Link>
              <span>/</span>
              <span className="text-foreground">Order History</span>
            </nav>
          </div>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="mb-6 rounded-full bg-muted/50 p-6 w-fit mx-auto">
                <Package className="h-12 w-12 text-muted-foreground" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight mb-4">No orders yet</h1>
              <p className="text-muted-foreground mb-8">When you place your first order, it will appear here.</p>
              <Button className="shadow-sm" asChild>
                <Link href="/products">Start Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container py-6 lg:py-8">
        <div className="py-4">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/account" className="hover:text-foreground">My Account</Link>
            <span>/</span>
            <span className="text-foreground">Order History</span>
          </nav>
        </div>
        
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild className="p-2">
                <Link href="/account">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Order History
                </h1>
                <p className="text-muted-foreground">View and track your orders</p>
              </div>
            </div>
            <Button onClick={handleRefresh} variant="outline" disabled={isLoading}>
              {isLoading ? "Refreshing..." : "Refresh Orders"}
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Order #{order.id.slice(-8).toUpperCase()}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Placed on {new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(order.status)} px-3 py-1 text-xs font-medium`}>
                    {order.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-muted/30">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Total Amount</p>
                    <p className="text-2xl font-bold">${order.total.toFixed(2)}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Items</p>
                    <p className="text-lg font-semibold">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Shipping</p>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <p className="text-sm">
                        {order.shippingAddress ? 
                          `${order.shippingAddress.city}, ${order.shippingAddress.state}` : 
                          'Not available'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Delivery</p>
                    <p className="text-sm">
                      {order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString() : 'TBD'}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" size="sm" asChild className="shadow-sm">
                    <Link href={`/checkout/confirmation/${order.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Link>
                  </Button>
                  {order.status === "shipped" && (
                    <Button variant="outline" size="sm" className="shadow-sm">
                      <Truck className="mr-2 h-4 w-4" />
                      Track Package
                    </Button>
                  )}
                  {order.status === "delivered" && (
                    <Button variant="outline" size="sm" className="shadow-sm">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Reorder
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
