"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Truck, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { useOrders } from "@/lib/order-context"
import { useToast } from "@/components/ui/use-toast"
import CheckoutSummary from "@/components/checkout-summary"
import PayPalButton from "@/components/paypal-button"

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, clearCart } = useCart()
  const { isAuthenticated, user } = useAuth()
  const { createOrder } = useOrders()
  const { toast } = useToast()

  const [step, setStep] = useState("shipping")
  const [paymentMethod, setPaymentMethod] = useState("paypal")
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  })

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 100 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/account/login?redirect=/checkout")
      return
    }

    if (cart.length === 0) {
      router.push("/cart")
      return
    }
  }, [isAuthenticated, cart.length, router])

  // Pre-fill form with user data when available
  useEffect(() => {
    if (user && isAuthenticated) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
      }))
    }
  }, [user, isAuthenticated])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateShippingForm = () => {
    const required = ["firstName", "lastName", "email", "phone", "address", "city", "state", "zipCode"]
    return required.every((field) => formData[field as keyof typeof formData].trim() !== "")
  }

  const validatePaymentForm = () => {
    // PayPal is the only payment method, so always return true
    return true
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateShippingForm()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required shipping fields.",
        variant: "destructive",
      })
      return
    }
    setStep("payment")
  }

  const processOrder = async () => {
    setIsProcessing(true)

    try {
      const order = await createOrder({
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          apartment: formData.apartment,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        subtotal,
        shipping,
        tax,
        total,
        paymentMethod: paymentMethod as "card" | "paypal",
      })

      clearCart()
      router.push(`/checkout/confirmation/${order.id}`)
    } catch (error) {
      toast({
        title: "Order Failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }


  const handlePayPalSuccess = async (details: any) => {
    toast({
      title: "Payment Successful",
      description: "Your PayPal payment has been processed successfully.",
    })
    await processOrder()
  }

  const handlePayPalError = (error: any) => {
    toast({
      title: "Payment Failed",
      description: "There was an error processing your PayPal payment.",
      variant: "destructive",
    })
  }

  if (!isAuthenticated || cart.length === 0) {
    return null
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
        <div className="mt-4 flex items-center gap-4">
          <div className={`flex items-center gap-2 ${step === "shipping" ? "text-primary" : "text-muted-foreground"}`}>
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                step === "shipping" ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"
              }`}
            >
              1
            </div>
            <span className="font-medium">Shipping</span>
          </div>
          <div className="h-px flex-1 bg-border" />
          <div className={`flex items-center gap-2 ${step === "payment" ? "text-primary" : "text-muted-foreground"}`}>
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                step === "payment" ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"
              }`}
            >
              2
            </div>
            <span className="font-medium">PayPal</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs value={step} className="w-full">
            <TabsContent value="shipping">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Shipping Information
                  </CardTitle>
                  {user && (
                    <p className="text-sm text-muted-foreground">
                      Your contact information has been pre-filled from your account. 
                      You can modify it below if needed.
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleShippingSubmit} className="space-y-6">
                    {user && (
                      <div className="rounded-lg border p-3 bg-blue-50 border-blue-200 mb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                            <span className="text-sm font-medium text-blue-800">Account Information</span>
                          </div>
                                                      {formData.firstName === user.firstName ? (
                              <button
                                type="button"
                                onClick={() => setFormData({
                                  firstName: "",
                                  lastName: "",
                                  email: "",
                                  phone: "",
                                  address: "",
                                  apartment: "",
                                  city: "",
                                  state: "",
                                  zipCode: "",
                                  country: "United States",
                                })}
                                className="text-xs text-blue-600 hover:text-blue-800 underline"
                              >
                                Use Different Address
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setFormData(prev => ({
                                  ...prev,
                                  firstName: user.firstName || "",
                                  lastName: user.lastName || "",
                                  email: user.email || "",
                                  phone: user.phone || "",
                                }))}
                                className="text-xs text-blue-600 hover:text-blue-800 underline"
                              >
                                Use Account Address
                              </button>
                            )}
                        </div>
                        <p className="text-xs text-blue-700 mt-1">
                          Logged in as: {user.email} • {user.firstName} {user.lastName}
                        </p>
                      </div>
                    )}
                    <div>
                      <h3 className="mb-4 font-semibold">Contact Information</h3>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone *</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="mb-4 font-semibold">Shipping Address</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="address">Address *</Label>
                          <Input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
                          <Input
                            id="apartment"
                            name="apartment"
                            value={formData.apartment}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                          <div>
                            <Label htmlFor="city">City *</Label>
                            <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
                          </div>
                          <div>
                            <Label htmlFor="state">State *</Label>
                            <Input
                              id="state"
                              name="state"
                              value={formData.state}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="zipCode">ZIP Code *</Label>
                            <Input
                              id="zipCode"
                              name="zipCode"
                              value={formData.zipCode}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="saveAddress"
                          className="rounded border-gray-300"
                        />
                        <label htmlFor="saveAddress" className="text-sm text-muted-foreground">
                          Save this address for future orders
                        </label>
                      </div>
                      <Button type="submit" size="lg">
                        Continue to PayPal
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payment">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    Pay with PayPal
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Complete your purchase securely with PayPal. No real charges will be made in sandbox mode.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-lg border-2 border-green-200 bg-green-50 p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <Shield className="h-6 w-6 text-green-600" />
                      <span className="text-lg font-semibold text-green-800">PayPal Sandbox Payment</span>
                    </div>
                    <p className="text-sm text-green-700 mb-4">
                      Use PayPal Sandbox for testing. No real charges will be made.
                    </p>
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <PayPalButton
                        amount={total}
                        onSuccess={handlePayPalSuccess}
                        onError={handlePayPalError}
                        onCancel={() => console.log("PayPal payment cancelled")}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={() => setStep("shipping")}>
                      Back to Shipping
                    </Button>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="text-2xl font-bold">${total.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <CheckoutSummary />
        </div>
      </div>
    </div>
  )
}
