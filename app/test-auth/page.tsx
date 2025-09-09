"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2, RefreshCw } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function TestAuthPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const [testResults, setTestResults] = useState<any>({})
  const [isTesting, setIsTesting] = useState(false)

  const testAuth = async () => {
    setIsTesting(true)
    console.log('Testing authentication...')
    
    try {
      // Test 1: Check localStorage token
      const token = localStorage.getItem('auth-token')
      console.log('Token in localStorage:', token ? 'Found' : 'Not found')
      
      // Test 2: Test /api/auth/me endpoint
      const authResponse = await fetch('/api/auth/me', { 
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const authData = authResponse.ok ? await authResponse.json() : null
      console.log('Auth /me response:', authResponse.status, authData)
      
      // Test 3: Test /api/orders endpoint
      const ordersResponse = await fetch('/api/orders', { 
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const ordersData = ordersResponse.ok ? await ordersResponse.json() : null
      console.log('Orders response:', ordersResponse.status, ordersData)
      
      // Test 4: Test /api/orders/user/me endpoint
      const userOrdersResponse = await fetch('/api/orders/user/me', { 
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const userOrdersData = userOrdersResponse.ok ? await userOrdersResponse.json() : null
      console.log('User orders response:', userOrdersResponse.status, userOrdersData)

      setTestResults({
        token: {
          found: !!token,
          value: token ? token.substring(0, 20) + '...' : null
        },
        authMe: {
          status: authResponse.status,
          ok: authResponse.ok,
          data: authData,
          error: authResponse.ok ? null : await authResponse.text()
        },
        orders: {
          status: ordersResponse.status,
          ok: ordersResponse.ok,
          data: ordersData,
          error: ordersResponse.ok ? null : await ordersResponse.text()
        },
        userOrders: {
          status: userOrdersResponse.status,
          ok: userOrdersResponse.ok,
          data: userOrdersData,
          error: userOrdersResponse.ok ? null : await userOrdersResponse.text()
        }
      })

    } catch (error) {
      console.error('Auth test error:', error)
      setTestResults({ error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setIsTesting(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      testAuth()
    }
  }, [isAuthenticated])

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p>Loading authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="container py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You need to be logged in to test authentication. Please log in first.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Authentication Test</h1>
        <p className="text-muted-foreground">
          Testing authentication and API endpoints
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Current Auth State */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Current Auth State
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
              <p><strong>User Email:</strong> {user?.email}</p>
              <p><strong>User ID:</strong> {user?.id}</p>
              <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Test Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Test Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={testAuth} className="w-full" disabled={isTesting}>
              <RefreshCw className="h-4 w-4 mr-2" />
              {isTesting ? 'Testing...' : 'Run Auth Tests'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Test Results */}
      {Object.keys(testResults).length > 0 && (
        <div className="space-y-6">
          {/* Token Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {testResults.token?.found ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                Token Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Found:</strong> {testResults.token?.found ? 'Yes' : 'No'}</p>
                <p><strong>Value:</strong> {testResults.token?.value || 'None'}</p>
              </div>
            </CardContent>
          </Card>

          {/* API Test Results */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Auth /me */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {testResults.authMe?.ok ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  Auth /me
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Status:</strong> {testResults.authMe?.status}</p>
                  <p><strong>Success:</strong> {testResults.authMe?.ok ? 'Yes' : 'No'}</p>
                  {testResults.authMe?.error && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{testResults.authMe.error}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {testResults.orders?.ok ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Status:</strong> {testResults.orders?.status}</p>
                  <p><strong>Success:</strong> {testResults.orders?.ok ? 'Yes' : 'No'}</p>
                  {testResults.orders?.error && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{testResults.orders.error}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* User Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {testResults.userOrders?.ok ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  User Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Status:</strong> {testResults.userOrders?.status}</p>
                  <p><strong>Success:</strong> {testResults.userOrders?.ok ? 'Yes' : 'No'}</p>
                  {testResults.userOrders?.error && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{testResults.userOrders.error}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Error Display */}
          {testResults.error && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  Test Error
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{testResults.error}</AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
