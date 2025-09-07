"use client"

import { useEffect, useRef, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { paypalConfig } from "@/lib/paypal-config"

interface PayPalButtonProps {
  amount: number
  onSuccess: (details: any) => void
  onError?: (error: any) => void
  onCancel?: () => void
}

declare global {
  interface Window {
    paypal?: any
  }
}

export default function PayPalButton({ amount, onSuccess, onError, onCancel }: PayPalButtonProps) {
  const paypalRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Load PayPal SDK
    const loadPayPalScript = () => {
      if (window.paypal) {
        setIsLoaded(true)
        return
      }

      const script = document.createElement("script")
      // Use PayPal Sandbox for demo/testing
      script.src = `https://www.paypal.com/sdk/js?client-id=${paypalConfig.clientId}&currency=${paypalConfig.currency}&intent=${paypalConfig.intent}`
      script.async = true
      script.onload = () => setIsLoaded(true)
      script.onerror = () => {
        toast({
          title: "PayPal Error",
          description: "Failed to load PayPal SDK. Please try again.",
          variant: "destructive",
        })
      }
      document.body.appendChild(script)
    }

    loadPayPalScript()
  }, [toast])

  useEffect(() => {
    if (isLoaded && window.paypal && paypalRef.current) {
      // Clear any existing PayPal buttons
      paypalRef.current.innerHTML = ""

      window.paypal
        .Buttons({
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: amount.toFixed(2),
                  },
                },
              ],
            })
          },
          onApprove: async (data: any, actions: any) => {
            try {
              const details = await actions.order.capture()
              onSuccess(details)
            } catch (error) {
              console.error("PayPal approval error:", error)
              onError?.(error)
            }
          },
          onError: (error: any) => {
            console.error("PayPal error:", error)
            toast({
              title: "Payment Error",
              description: "There was an error processing your PayPal payment.",
              variant: "destructive",
            })
            onError?.(error)
          },
          onCancel: () => {
            toast({
              title: "Payment Cancelled",
              description: "Your PayPal payment was cancelled.",
            })
            onCancel?.()
          },
          style: {
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "paypal",
          },
        })
        .render(paypalRef.current)
    }
  }, [isLoaded, amount, onSuccess, onError, onCancel, toast])

  if (!isLoaded) {
    return (
      <div className="flex h-12 items-center justify-center rounded-md bg-muted">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="ml-2 text-sm">Loading PayPal...</span>
      </div>
    )
  }

  return <div ref={paypalRef} className="paypal-button-container" />
}
