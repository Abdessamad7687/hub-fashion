"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function CreateTestOrderPage() {
  const [isCreating, setIsCreating] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const createTestOrder = async () => {
    setIsCreating(true)
    setError(null)
    setResult(null)

    try {
      const testOrderData = {
        items: [
          {
            id: "test-product-1",
            name: "Test Product 1",
            price: 29.99,
            quantity: 2,
            size: "M",
            color: "Blue"
          },
          {
            id: "test-product-2", 
            name: "Test Product 2",
            price: 49.99,
            quantity: 1,
            size: "L",
            color: "Red"
          }
        ],
        shippingAddress: {
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          phone: "+1234567890",
          address: "123 Main Street",
          apartment: "Apt 4B",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "United States"
        },
        subtotal: 109.97,
        shipping: 9.99,
        tax: 8.80,
        total: 128.76,
        paymentMethod: "paypal"
      }

      console.log('Creating test order with data:', testOrderData)

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(testOrderData)
      })

      console.log('Order creation response:', response.status, response.ok)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Order creation error:', errorText)
        throw new Error(`Failed to create order: ${response.status} ${errorText}`)
      }

      const orderData = await response.json()
      console.log('Order created successfully:', orderData)
      
      setResult(orderData)
      toast({
        title: "Test Order Created",
        description: `Order ${orderData.id} created successfully!`,
      })

    } catch (err) {
      console.error('Error creating test order:', err)
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      toast({
        title: "Order Creation Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Create Test Order</h1>
          <p className="text-muted-foreground">
            Create a test order to verify the order creation system is working
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Test Order Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Items</Label>
                <div className="text-sm text-muted-foreground">
                  <p>• Test Product 1 x2 - $29.99 each</p>
                  <p>• Test Product 2 x1 - $49.99 each</p>
                </div>
              </div>
              <div>
                <Label>Customer</Label>
                <div className="text-sm text-muted-foreground">
                  <p>John Doe</p>
                  <p>john.doe@example.com</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Shipping</Label>
                <div className="text-sm text-muted-foreground">
                  <p>123 Main Street, Apt 4B</p>
                  <p>New York, NY 10001</p>
                </div>
              </div>
              <div>
                <Label>Payment</Label>
                <div className="text-sm text-muted-foreground">
                  <p>PayPal</p>
                  <p>Total: $128.76</p>
                </div>
              </div>
            </div>

            <Button 
              onClick={createTestOrder} 
              disabled={isCreating}
              className="w-full"
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Order...
                </>
              ) : (
                'Create Test Order'
              )}
            </Button>
          </CardContent>
        </Card>

        {error && (
          <Card className="mt-6">
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

        {result && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                Order Created Successfully
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Order ID:</strong> {result.id}</p>
                <p><strong>Status:</strong> {result.status}</p>
                <p><strong>Total:</strong> ${result.total}</p>
                <p><strong>Items:</strong> {result.items?.length || 0}</p>
                <p><strong>Created:</strong> {new Date(result.createdAt).toLocaleString()}</p>
              </div>
              <div className="mt-4">
                <Button 
                  onClick={() => window.location.href = '/account/orders'}
                  className="mr-2"
                >
                  View Orders
                </Button>
                <Button 
                  onClick={() => window.location.href = '/debug-orders'}
                  variant="outline"
                >
                  Debug Orders
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
