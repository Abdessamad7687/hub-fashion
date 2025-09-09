"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, Eye, Users, Settings } from "lucide-react"
import Link from "next/link"

export default function TestOrdersPage() {
  const [userOrders, setUserOrders] = useState([])
  const [adminOrders, setAdminOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Get token for authentication
        const token = localStorage.getItem('token')
        console.log('Token found:', !!token)
        console.log('Token value:', token ? token.substring(0, 20) + '...' : 'No token')
        
        if (!token) {
          console.log('No token found')
          setIsLoading(false)
          return
        }

        // Fetch user orders
        const userResponse = await fetch('http://localhost:4000/api/orders/user/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include'
        })
        console.log('User orders response:', userResponse.status, userResponse.ok)
        if (userResponse.ok) {
          const userData = await userResponse.json()
          console.log('User orders data:', userData)
          setUserOrders(userData)
        } else {
          const errorText = await userResponse.text()
          console.error('User orders error:', errorText)
        }

        // Fetch admin orders (if admin)
        const adminResponse = await fetch('http://localhost:4000/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include'
        })
        console.log('Admin orders response:', adminResponse.status, adminResponse.ok)
        if (adminResponse.ok) {
          const adminData = await adminResponse.json()
          console.log('Admin orders data:', adminData)
          setAdminOrders(adminData)
        } else {
          const errorText = await adminResponse.text()
          console.error('Admin orders error:', errorText)
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800'
      case 'PROCESSING': return 'bg-purple-100 text-purple-800'
      case 'SHIPPED': return 'bg-indigo-100 text-indigo-800'
      case 'DELIVERED': return 'bg-green-100 text-green-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Order Management Test</h1>
        <p className="text-muted-foreground">
          Test page to verify order functionality for both users and admins
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Orders ({userOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userOrders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No user orders found</p>
                <Button asChild className="mt-4">
                  <Link href="/checkout">Create Test Order</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {userOrders.map((order: any) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">Order #{order.id.slice(-8)}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="text-sm">
                      <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
                      <p><strong>Items:</strong> {order.items.length} items</p>
                      <p><strong>Payment:</strong> {order.paymentMethod || 'N/A'}</p>
                    </div>
                    <Button asChild size="sm" className="mt-2">
                      <Link href={`/checkout/confirmation/${order.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Admin Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Admin Orders ({adminOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {adminOrders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No admin orders found</p>
                <Button asChild className="mt-4">
                  <Link href="/admin/orders">View Admin Panel</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {adminOrders.map((order: any) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">Order #{order.id.slice(-8)}</h3>
                        <p className="text-sm text-muted-foreground">
                          Customer: {order.user?.firstName} {order.user?.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="text-sm">
                      <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
                      <p><strong>Items:</strong> {order.items.length} items</p>
                      <p><strong>Customer:</strong> {order.user?.email}</p>
                    </div>
                    <Button asChild size="sm" className="mt-2">
                      <Link href={`/checkout/confirmation/${order.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <div className="space-x-4">
          <Button asChild>
            <Link href="/checkout">Test Checkout</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/account/orders">User Orders Page</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/orders">Admin Orders Page</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
