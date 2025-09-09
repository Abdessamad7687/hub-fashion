"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Package, CheckCircle, AlertCircle, Loader2, RefreshCw, Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function TestOrderSystemPage() {
  const [systemStatus, setSystemStatus] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const { toast } = useToast()

  const testSystem = async () => {
    setIsLoading(true)
    console.log('Testing order system...')
    
    try {
      // Test 1: Authentication
      const authResponse = await fetch('/api/auth/me', { credentials: 'include' })
      const authData = authResponse.ok ? await authResponse.json() : null
      console.log('Auth test:', authResponse.status, authData)

      // Test 2: User Orders
      const userOrdersResponse = await fetch('/api/orders/user/me', { credentials: 'include' })
      const userOrdersData = userOrdersResponse.ok ? await userOrdersResponse.json() : null
      console.log('User orders test:', userOrdersResponse.status, userOrdersData)

      // Test 3: Admin Orders
      const adminOrdersResponse = await fetch('/api/orders', { credentials: 'include' })
      const adminOrdersData = adminOrdersResponse.ok ? await adminOrdersResponse.json() : null
      console.log('Admin orders test:', adminOrdersResponse.status, adminOrdersData)

      // Test 4: Backend Health
      const healthResponse = await fetch('/api/health', { credentials: 'include' })
      const healthData = healthResponse.ok ? await healthResponse.json() : null
      console.log('Health test:', healthResponse.status, healthData)

      setSystemStatus({
        auth: {
          status: authResponse.status,
          ok: authResponse.ok,
          data: authData,
          error: authResponse.ok ? null : await authResponse.text()
        },
        userOrders: {
          status: userOrdersResponse.status,
          ok: userOrdersResponse.ok,
          data: userOrdersData,
          count: userOrdersData?.length || 0,
          error: userOrdersResponse.ok ? null : await userOrdersResponse.text()
        },
        adminOrders: {
          status: adminOrdersResponse.status,
          ok: adminOrdersResponse.ok,
          data: adminOrdersData,
          count: adminOrdersData?.length || 0,
          error: adminOrdersResponse.ok ? null : await adminOrdersResponse.text()
        },
        health: {
          status: healthResponse.status,
          ok: healthResponse.ok,
          data: healthData,
          error: healthResponse.ok ? null : await healthResponse.text()
        }
      })

    } catch (error) {
      console.error('System test error:', error)
      setSystemStatus({ error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setIsLoading(false)
    }
  }

  const createTestOrder = async () => {
    setIsCreatingOrder(true)
    try {
      const testOrder = {
        items: [
          {
            id: "test-product-1",
            name: "Test Product 1",
            price: 29.99,
            quantity: 2,
            size: "M",
            color: "Blue"
          }
        ],
        shippingAddress: {
          firstName: "Test",
          lastName: "User",
          email: "test@example.com",
          phone: "+1234567890",
          address: "123 Test Street",
          city: "Test City",
          state: "TS",
          zipCode: "12345",
          country: "United States"
        },
        subtotal: 59.98,
        shipping: 9.99,
        tax: 4.80,
        total: 74.77,
        paymentMethod: "paypal"
      }

      console.log('Creating test order:', testOrder)
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(testOrder)
      })

      if (response.ok) {
        const orderData = await response.json()
        console.log('Test order created:', orderData)
        toast({
          title: "Test Order Created",
          description: `Order ${orderData.id} created successfully!`,
        })
        // Refresh system status
        await testSystem()
      } else {
        const errorText = await response.text()
        console.error('Order creation failed:', response.status, errorText)
        toast({
          title: "Order Creation Failed",
          description: `Error: ${response.status} ${errorText}`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error creating test order:', error)
      toast({
        title: "Order Creation Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      })
    } finally {
      setIsCreatingOrder(false)
    }
  }

  useEffect(() => {
    testSystem()
  }, [])

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p>Testing order system...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Order System Test</h1>
        <p className="text-muted-foreground">
          Comprehensive test of the order management system
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* System Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">
                  {systemStatus.userOrders?.count || 0}
                </div>
                <div className="text-sm text-muted-foreground">User Orders</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">
                  {systemStatus.adminOrders?.count || 0}
                </div>
                <div className="text-sm text-muted-foreground">Admin Orders</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {systemStatus.auth?.ok ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="text-sm">Authentication: {systemStatus.auth?.ok ? 'OK' : 'Failed'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                {systemStatus.userOrders?.ok ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="text-sm">User Orders API: {systemStatus.userOrders?.ok ? 'OK' : 'Failed'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                {systemStatus.adminOrders?.ok ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="text-sm">Admin Orders API: {systemStatus.adminOrders?.ok ? 'OK' : 'Failed'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={testSystem} className="w-full" variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh System Status
            </Button>
            
            <Button onClick={createTestOrder} className="w-full" disabled={isCreatingOrder}>
              <Plus className="h-4 w-4 mr-2" />
              {isCreatingOrder ? 'Creating Order...' : 'Create Test Order'}
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => window.open('/account/orders', '_blank')}>
                User Orders
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.open('/admin/orders', '_blank')}>
                Admin Orders
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Status */}
      <div className="space-y-6">
        {/* Authentication Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {systemStatus.auth?.ok ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              Authentication Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Status:</strong> {systemStatus.auth?.status}</p>
              <p><strong>Success:</strong> {systemStatus.auth?.ok ? 'Yes' : 'No'}</p>
              {systemStatus.auth?.data && (
                <div>
                  <p><strong>User:</strong> {systemStatus.auth.data.email} ({systemStatus.auth.data.role})</p>
                </div>
              )}
              {systemStatus.auth?.error && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{systemStatus.auth.error}</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Orders Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {systemStatus.userOrders?.ok ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                User Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Status:</strong> {systemStatus.userOrders?.status}</p>
                <p><strong>Count:</strong> {systemStatus.userOrders?.count}</p>
                {systemStatus.userOrders?.error && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{systemStatus.userOrders.error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {systemStatus.adminOrders?.ok ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                Admin Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Status:</strong> {systemStatus.adminOrders?.status}</p>
                <p><strong>Count:</strong> {systemStatus.adminOrders?.count}</p>
                {systemStatus.adminOrders?.error && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{systemStatus.adminOrders.error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Display */}
        {systemStatus.error && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                System Error
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{systemStatus.error}</AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
