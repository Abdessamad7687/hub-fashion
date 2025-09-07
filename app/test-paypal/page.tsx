"use client"

import { useState } from "react"
import PayPalButton from "@/components/paypal-button"

export default function TestPayPalPage() {
  const [result, setResult] = useState<string>("")

  const handleSuccess = (details: any) => {
    console.log("Payment successful:", details)
    setResult(`Payment successful! Order ID: ${details.id}`)
  }

  const handleError = (error: any) => {
    console.error("Payment error:", error)
    setResult(`Payment error: ${error.message || "Unknown error"}`)
  }

  const handleCancel = () => {
    console.log("Payment cancelled")
    setResult("Payment cancelled by user")
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">PayPal Test Page</h1>
      
      <div className="max-w-md mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Test Payment</h2>
          <p className="text-gray-600 mb-4">Amount: $10.00</p>
          
          <PayPalButton
            amount={10.00}
            onSuccess={handleSuccess}
            onError={handleError}
            onCancel={handleCancel}
          />
          
          {result && (
            <div className="mt-4 p-3 bg-gray-100 rounded">
              <p className="text-sm">{result}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
