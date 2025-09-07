"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CreditCard, Truck, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { useOrders } from "@/lib/order-context"
import { useToast } from "@/components/ui/use-toast"
import CheckoutSummary from "@/components/checkout-summary"
import PayPalButton from "@/components/paypal-button"
import DemoCardPayment from "@/components/demo-card-payment"

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, clearCart } = useCart()
  const { isAuthenticated, user } = useAuth()
  const { createOrder } = useOrders()
  const { toast } = useToast()

  const [step, setStep] = useState("shipping")
  const [paymentMethod, setPaymentMethod] = useState("card")
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
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
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
    if (paymentMethod === "paypal" || paymentMethod === "demo-card") return true
    const required = ["cardName", "cardNumber", "expiry", "cvc"]
    return required.every((field) => formData[field as keyof typeof formData].trim() !== "")
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

  const handleCardPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validatePaymentForm()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required payment fields.",
        variant: "destructive",
      })
      return
    }

    // Simulate card processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    await processOrder()
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
            <span className="font-medium">Payment</span>
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
                                  cardName: "",
                                  cardNumber: "",
                                  expiry: "",
                                  cvc: "",
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
                        Continue to Payment
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
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card">Credit / Debit Card (Real)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="demo-card" id="demo-card" />
                      <Label htmlFor="demo-card">Demo Card Payment</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal">PayPal Sandbox</Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === "card" && (
                    <form onSubmit={handleCardPayment} className="space-y-4">
                      <div>
                        <Label htmlFor="cardName">Name on Card *</Label>
                        <Input
                          id="cardName"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardNumber">Card Number *</Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Expiry Date *</Label>
                          <Input
                            id="expiry"
                            name="expiry"
                            placeholder="MM/YY"
                            value={formData.expiry}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvc">CVC *</Label>
                          <Input
                            id="cvc"
                            name="cvc"
                            placeholder="123"
                            value={formData.cvc}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="flex justify-between pt-4">
                        <Button type="button" variant="outline" onClick={() => setStep("shipping")}>
                          Back to Shipping
                        </Button>
                        <Button type="submit" size="lg" disabled={isProcessing}>
                          {isProcessing ? "Processing..." : `Pay $${total.toFixed(2)}`}
                        </Button>
                      </div>
                    </form>
                  )}

                  {paymentMethod === "demo-card" && (
                    <div className="space-y-4">
                      <DemoCardPayment
                        amount={total}
                        onSuccess={handlePayPalSuccess}
                        onError={handlePayPalError}
                        onCancel={() => setStep("shipping")}
                      />
                    </div>
                  )}

                  {paymentMethod === "paypal" && (
                    <div className="space-y-4">
                      <div className="rounded-lg border p-4">
                        <div className="mb-4 flex items-center gap-2">
                          <Shield className="h-5 w-5 text-green-600" />
                          <span className="text-sm font-medium">PayPal Sandbox Payment</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-4">
                          Use PayPal Sandbox for testing. No real charges will be made.
                        </p>
                        <PayPalButton
                          amount={total}
                          onSuccess={handlePayPalSuccess}
                          onError={handlePayPalError}
                          onCancel={() => console.log("PayPal payment cancelled")}
                        />
                      </div>

                      <div className="flex justify-start">
                        <Button type="button" variant="outline" onClick={() => setStep("shipping")}>
                          Back to Shipping
                        </Button>
                      </div>
                    </div>
                  )}
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
