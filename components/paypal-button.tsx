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
  const [isRendered, setIsRendered] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    let isMounted = true

    const loadPayPalScript = () => {
      // Check if PayPal is already loaded
      if (window.paypal && window.paypal.Buttons) {
        console.log('PayPal SDK already loaded')
        if (isMounted) {
          setIsLoaded(true)
          setIsLoading(false)
        }
        return
      }

      // Check if script is already being loaded
      const existingScript = document.querySelector('script[src*="paypal.com/sdk/js"]')
      if (existingScript) {
        console.log('PayPal script already exists, waiting for load...')
        existingScript.addEventListener('load', () => {
          if (isMounted) {
            setIsLoaded(true)
            setIsLoading(false)
          }
        })
        return
      }

      console.log('Loading PayPal SDK...')
      const script = document.createElement("script")
      script.src = `https://www.paypal.com/sdk/js?client-id=${paypalConfig.clientId}&currency=${paypalConfig.currency}&intent=${paypalConfig.intent}&components=buttons`
      script.async = true
      script.defer = true
      
      script.onload = () => {
        console.log('PayPal SDK script loaded')
        // Wait a bit for PayPal to initialize
        setTimeout(() => {
          if (isMounted && window.paypal && window.paypal.Buttons) {
            console.log('PayPal SDK ready')
            setIsLoaded(true)
            setIsLoading(false)
          } else {
            console.error('PayPal SDK loaded but Buttons not available')
            if (isMounted) {
              setIsLoading(false)
              toast({
                title: "PayPal Error",
                description: "PayPal SDK loaded but buttons are not available. Please refresh the page.",
                variant: "destructive",
              })
            }
          }
        }, 500)
      }
      
      script.onerror = (error) => {
        console.error('PayPal SDK loading error:', error)
        if (isMounted) {
          setIsLoading(false)
          toast({
            title: "PayPal Error",
            description: "Failed to load PayPal SDK. Please check your internet connection and try again.",
            variant: "destructive",
          })
        }
      }
      
      document.head.appendChild(script)
    }

    loadPayPalScript()

    return () => {
      isMounted = false
    }
  }, [toast])

  useEffect(() => {
    if (isLoaded && !isRendered && paypalRef.current && window.paypal && window.paypal.Buttons) {
      console.log('Rendering PayPal button...')
      
      try {
        // Clear any existing content
        paypalRef.current.innerHTML = ""

        const buttons = window.paypal.Buttons({
          createOrder: (data: any, actions: any) => {
            console.log('Creating PayPal order for amount:', amount)
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: amount.toFixed(2),
                    currency_code: paypalConfig.currency
                  },
                },
              ],
            })
          },
          onApprove: async (data: any, actions: any) => {
            try {
              console.log('PayPal order approved:', data)
              const details = await actions.order.capture()
              console.log('PayPal order captured:', details)
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
            console.log('PayPal payment cancelled')
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
            height: 45,
          },
        })

        buttons.render(paypalRef.current).then(() => {
          console.log('PayPal button rendered successfully')
          setIsRendered(true)
        }).catch((error: any) => {
          console.error('PayPal button render error:', error)
          toast({
            title: "PayPal Error",
            description: "Failed to render PayPal button. Please try again.",
            variant: "destructive",
          })
        })

      } catch (error) {
        console.error('PayPal Buttons creation error:', error)
        toast({
          title: "PayPal Error",
          description: "Failed to create PayPal buttons. Please refresh the page.",
          variant: "destructive",
        })
      }
    }
  }, [isLoaded, amount, onSuccess, onError, onCancel, toast, isRendered])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (paypalRef.current) {
        paypalRef.current.innerHTML = ""
      }
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-12 items-center justify-center rounded-md bg-muted">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="ml-2 text-sm">Loading PayPal...</span>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="flex h-12 items-center justify-center rounded-md bg-red-50 border border-red-200">
        <span className="text-sm text-red-600">PayPal not available</span>
      </div>
    )
  }

  return <div ref={paypalRef} className="paypal-button-container" />
}