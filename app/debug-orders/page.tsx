"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, AlertCircle, CheckCircle, Loader2 } from "lucide-react"

export default function DebugOrdersPage() {
  const [debugInfo, setDebugInfo] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const debugOrders = async () => {
      try {
        console.log('Starting order debug...')
        
        // Test 1: Check authentication
        const authResponse = await fetch('/api/auth/me', {
          credentials: 'include'
        })
        console.log('Auth response:', authResponse.status, authResponse.ok)
        
        const authData = authResponse.ok ? await authResponse.json() : null
        console.log('Auth data:', authData)

        // Test 2: Try to fetch user orders
        const ordersResponse = await fetch('/api/orders/user/me', {
          credentials: 'include'
        })
        console.log('Orders response:', ordersResponse.status, ordersResponse.ok)
        
        let ordersData = null
        if (ordersResponse.ok) {
          ordersData = await ordersResponse.json()
          console.log('Orders data:', ordersData)
        } else {
          const errorText = await ordersResponse.text()
          console.log('Orders error:', errorText)
        }

        // Test 3: Try to fetch all orders (admin)
        const allOrdersResponse = await fetch('/api/orders', {
          credentials: 'include'
        })
        console.log('All orders response:', allOrdersResponse.status, allOrdersResponse.ok)
        
        let allOrdersData = null
        if (allOrdersResponse.ok) {
          allOrdersData = await allOrdersResponse.json()
          console.log('All orders data:', allOrdersData)
        } else {
          const errorText = await allOrdersResponse.text()
          console.log('All orders error:', errorText)
        }

        setDebugInfo({
          auth: {
            status: authResponse.status,
            ok: authResponse.ok,
            data: authData
          },
          userOrders: {
            status: ordersResponse.status,
            ok: ordersResponse.ok,
            data: ordersData
          },
          allOrders: {
            status: allOrdersResponse.status,
            ok: allOrdersResponse.ok,
            data: allOrdersData
          }
        })

      } catch (err) {
        console.error('Debug error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setIsLoading(false)
      }
    }

    debugOrders()
  }, [])

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p>Debugging orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Order Debug Information</h1>
        <p className="text-muted-foreground">
          Debug information to help identify order fetching issues
        </p>
      </div>

      <div className="space-y-6">
        {/* Authentication Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {debugInfo.auth?.ok ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              Authentication Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Status:</strong> {debugInfo.auth?.status}</p>
              <p><strong>Success:</strong> {debugInfo.auth?.ok ? 'Yes' : 'No'}</p>
              {debugInfo.auth?.data && (
                <div>
                  <p><strong>User Data:</strong></p>
                  <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                    {JSON.stringify(debugInfo.auth.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* User Orders Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {debugInfo.userOrders?.ok ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              User Orders API
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Status:</strong> {debugInfo.userOrders?.status}</p>
              <p><strong>Success:</strong> {debugInfo.userOrders?.ok ? 'Yes' : 'No'}</p>
              <p><strong>Orders Count:</strong> {debugInfo.userOrders?.data?.length || 0}</p>
              {debugInfo.userOrders?.data && (
                <div>
                  <p><strong>Orders Data:</strong></p>
                  <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto max-h-96">
                    {JSON.stringify(debugInfo.userOrders.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* All Orders Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {debugInfo.allOrders?.ok ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              All Orders API (Admin)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Status:</strong> {debugInfo.allOrders?.status}</p>
              <p><strong>Success:</strong> {debugInfo.allOrders?.ok ? 'Yes' : 'No'}</p>
              <p><strong>Orders Count:</strong> {debugInfo.allOrders?.data?.length || 0}</p>
              {debugInfo.allOrders?.data && (
                <div>
                  <p><strong>Orders Data:</strong></p>
                  <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto max-h-96">
                    {JSON.stringify(debugInfo.allOrders.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {error && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                Error
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-x-4">
              <Button onClick={() => window.location.reload()}>
                Refresh Debug Info
              </Button>
              <Button variant="outline" onClick={() => {
                console.log('Current debug info:', debugInfo)
              }}>
                Log to Console
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
