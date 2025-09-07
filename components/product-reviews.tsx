"use client"

import type React from "react"

import { useState } from "react"
import { Star, ThumbsUp, ThumbsDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"

interface ProductReviewsProps {
  productId: string
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { toast } = useToast()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [review, setReview] = useState("")
  const [reviewerName, setReviewerName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock reviews data
  const reviews = [
    {
      id: 1,
      name: "Alex Johnson",
      rating: 5,
      date: "2 months ago",
      comment:
        "Absolutely love this product! The quality is exceptional and it fits perfectly. Would definitely recommend to anyone looking for a stylish and comfortable option.",
      helpful: 12,
      notHelpful: 1,
    },
    {
      id: 2,
      name: "Sam Taylor",
      rating: 4,
      date: "3 months ago",
      comment:
        "Great quality and fast shipping. The size runs a bit large, so I'd recommend sizing down. Overall very satisfied with my purchase.",
      helpful: 8,
      notHelpful: 0,
    },
    {
      id: 3,
      name: "Jordan Lee",
      rating: 5,
      date: "1 month ago",
      comment:
        "Perfect! Exactly what I was looking for. The material feels premium and the fit is just right. Will definitely be ordering more colors.",
      helpful: 15,
      notHelpful: 2,
    },
  ]

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!rating || !review.trim() || !reviewerName.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields and select a rating.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Review submitted!",
      description: "Thank you for your feedback. Your review will be published shortly.",
    })

    // Reset form
    setRating(0)
    setReview("")
    setReviewerName("")
    setIsSubmitting(false)
  }

  const renderStars = (currentRating: number, interactive = false) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <button
        key={i}
        type="button"
        className={`h-5 w-5 ${interactive ? "cursor-pointer" : "cursor-default"}`}
        onClick={interactive ? () => setRating(i + 1) : undefined}
        onMouseEnter={interactive ? () => setHoverRating(i + 1) : undefined}
        onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
        disabled={!interactive}
      >
        <Star
          className={`h-full w-full ${
            i < (interactive ? hoverRating || rating : currentRating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-muted-foreground"
          }`}
        />
      </button>
    ))
  }

  return (
    <div className="space-y-8">
      {/* Review Summary */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <h3 className="mb-4 text-lg font-semibold">Customer Reviews</h3>
          <div className="flex items-center gap-2">
            <div className="flex">{renderStars(4.5)}</div>
            <span className="text-lg font-medium">4.5 out of 5</span>
          </div>
          <p className="text-sm text-muted-foreground">Based on {reviews.length} reviews</p>
        </div>

        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => (
            <div key={stars} className="flex items-center gap-2">
              <span className="text-sm">{stars}</span>
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <div className="flex-1 bg-muted rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{ width: `${stars === 5 ? 60 : stars === 4 ? 30 : 10}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground">{stars === 5 ? 60 : stars === 4 ? 30 : 10}%</span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Write a Review */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Write a Review</h3>
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <Label>Your Rating</Label>
            <div className="mt-1 flex gap-1">{renderStars(rating, true)}</div>
          </div>

          <div>
            <Label htmlFor="reviewerName">Your Name</Label>
            <Input
              id="reviewerName"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <Label htmlFor="review">Your Review</Label>
            <Textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your thoughts about this product..."
              rows={4}
              required
            />
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </div>

      <Separator />

      {/* Reviews List */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Customer Reviews</h3>
        {reviews.map((review) => (
          <div key={review.id} className="space-y-3">
            <div className="flex items-start gap-3">
              <Avatar>
                <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{review.name}</span>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">{review.date}</span>
                </div>
                <div className="flex">{renderStars(review.rating)}</div>
                <p className="text-muted-foreground">{review.comment}</p>
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <ThumbsUp className="mr-1 h-3 w-3" />
                    Helpful ({review.helpful})
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <ThumbsDown className="mr-1 h-3 w-3" />
                    Not helpful ({review.notHelpful})
                  </Button>
                </div>
              </div>
            </div>
            {review.id !== reviews[reviews.length - 1].id && <Separator />}
          </div>
        ))}
      </div>
    </div>
  )
}
