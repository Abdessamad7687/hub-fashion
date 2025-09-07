"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Mail, Send } from "lucide-react"

export default function Newsletter() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Success!",
      description: "You've been subscribed to our newsletter.",
    })

    setEmail("")
    setIsLoading(false)
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="rounded-3xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 p-8 text-center lg:p-12">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Stay in the Loop
        </h2>
        <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
          Get the latest updates on new products, exclusive offers, and fashion trends. 
          Join our community of style enthusiasts.
        </p>
        <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 pl-4 pr-4 text-base"
            />
          </div>
          <Button 
            type="submit" 
            disabled={isLoading}
            size="lg"
            className="h-12 px-8 text-base"
          >
            {isLoading ? (
              "Subscribing..."
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Subscribe
              </>
            )}
          </Button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          No spam, unsubscribe at any time.
        </p>
      </div>
    </div>
  )
}
