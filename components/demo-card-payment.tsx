"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, CreditCard, CheckCircle } from "lucide-react"

interface DemoCardPaymentProps {
  amount: number
  onSuccess: (details: any) => void
  onError?: (error: any) => void
  onCancel?: () => void
}

export default function DemoCardPayment({ amount, onSuccess, onError, onCancel }: DemoCardPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
    cardName: "",
  })
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    return formData.cardNumber && formData.expiry && formData.cvc && formData.cardName
  }

  const processPayment = async () => {
    if (!validateForm()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all card details.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Simulate success (in real app, this would call your payment processor)
      setIsSuccess(true)
      
      toast({
        title: "Payment Successful",
        description: "Your card payment has been processed successfully.",
      })

      // Simulate payment details
      const paymentDetails = {
        id: `demo_${Date.now()}`,
        status: "completed",
        amount: amount,
        method: "card",
        timestamp: new Date().toISOString(),
      }

      onSuccess(paymentDetails)
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })
      onError?.(error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border p-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-500" />
        <div>
          <h3 className="text-lg font-semibold">Payment Successful!</h3>
          <p className="text-sm text-muted-foreground">
            Your payment of ${amount.toFixed(2)} has been processed.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border p-4 bg-muted/50">
        <div className="mb-4 flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium">Demo Card Payment</span>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          This is a demo payment system. Use any card details to test the checkout flow.
        </p>
      </div>

      <form className="space-y-4">
        <div>
          <Label htmlFor="cardName">Name on Card *</Label>
          <Input
            id="cardName"
            name="cardName"
            placeholder="John Doe"
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

        <div className="pt-4 space-y-2">
          <Button
            type="button"
            onClick={processPayment}
            disabled={isProcessing || !validateForm()}
            className="w-full"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Payment...
              </>
            ) : (
              `Pay $${amount.toFixed(2)}`
            )}
          </Button>

          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="w-full"
              disabled={isProcessing}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>

      <div className="rounded-lg border p-3 bg-blue-50 border-blue-200">
        <p className="text-xs text-blue-800">
          <strong>Demo Mode:</strong> This payment system is for demonstration purposes only. 
          No real charges will be made. Use any card details to test the checkout flow.
        </p>
      </div>
    </div>
  )
}

