"use client"

import { useState } from "react"
import { Share2, Copy, Facebook, Twitter, Mail, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"

interface ShareButtonProps {
  product: {
    id: string
    name: string
    price: number
    image?: string
  }
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  className?: string
}

export default function ShareButton({ product, variant = "outline", size = "default", className }: ShareButtonProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  const productUrl = typeof window !== "undefined" ? window.location.href : ""
  const productTitle = `Check out this ${product.name} for $${product.price.toFixed(2)}`
  const productDescription = `${product.name} - Available now at StyleHub`

  const shareOptions = [
    {
      name: "Copy Link",
      icon: copied ? Check : Copy,
      action: async () => {
        try {
          await navigator.clipboard.writeText(productUrl)
          setCopied(true)
          toast({
            title: "Link copied!",
            description: "Product link has been copied to your clipboard.",
          })
          setTimeout(() => setCopied(false), 2000)
        } catch (error) {
          toast({
            title: "Failed to copy",
            description: "Please try again or copy the URL manually.",
            variant: "destructive",
          })
        }
      },
    },
    {
      name: "Share on Facebook",
      icon: Facebook,
      action: () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`
        window.open(facebookUrl, "_blank", "width=600,height=400")
      },
    },
    {
      name: "Share on Twitter",
      icon: Twitter,
      action: () => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(productTitle)}&url=${encodeURIComponent(productUrl)}`
        window.open(twitterUrl, "_blank", "width=600,height=400")
      },
    },
    {
      name: "Share via Email",
      icon: Mail,
      action: () => {
        const emailUrl = `mailto:?subject=${encodeURIComponent(productTitle)}&body=${encodeURIComponent(
          `${productDescription}\n\n${productUrl}`,
        )}`
        window.location.href = emailUrl
      },
    },
  ]

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: productTitle,
          text: productDescription,
          url: productUrl,
        })
      } catch (error) {
        // User cancelled or error occurred
        console.log("Share cancelled or failed:", error)
      }
    }
  }

  // Check if native sharing is available
  const hasNativeShare = typeof navigator !== "undefined" && navigator.share

  if (hasNativeShare) {
    return (
      <Button onClick={handleNativeShare} variant={variant} size={size} className={className}>
        <Share2 className="mr-2 h-4 w-4" />
        Share
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {shareOptions.map((option, index) => (
          <div key={option.name}>
            <DropdownMenuItem onClick={option.action} className="cursor-pointer">
              <option.icon className="mr-2 h-4 w-4" />
              {option.name}
            </DropdownMenuItem>
            {index === 0 && <DropdownMenuSeparator />}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
