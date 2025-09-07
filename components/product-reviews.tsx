"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Star, ThumbsUp, ThumbsDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { config } from "@/lib/config"
import { useAuth } from "@/lib/auth-context"

interface ProductReviewsProps {
  productId: string
}

interface Review {
  id: string
  rating: number
  comment: string
  createdAt: string
  user: {
    id: string
    firstName?: string
    lastName?: string
    email: string
  }
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { toast } = useToast()
  const { isAuthenticated } = useAuth()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [review, setReview] = useState("")
  const [reviewerName, setReviewerName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [averageRating, setAverageRating] = useState(0)
  const [ratingDistribution, setRatingDistribution] = useState<{[key: number]: number}>({})

  // Fetch reviews from backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${config.api.baseUrl}/api/reviews?productId=${productId}`)
        if (response.ok) {
          const fetchedReviews = await response.json()
          setReviews(fetchedReviews)
          
          // Calculate average rating and distribution
          if (fetchedReviews.length > 0) {
            const totalRating = fetchedReviews.reduce((sum: number, review: Review) => sum + review.rating, 0)
            setAverageRating(totalRating / fetchedReviews.length)
            
            // Calculate rating distribution
            const distribution: {[key: number]: number} = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
            fetchedReviews.forEach((review: Review) => {
              distribution[review.rating]++
            })
            setRatingDistribution(distribution)
          } else {
            setRatingDistribution({1: 0, 2: 0, 3: 0, 4: 0, 5: 0})
          }
        }
      } catch (error) {
        console.error('Error fetching reviews:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReviews()
  }, [productId])

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit a review.",
        variant: "destructive",
      })
      return
    }

    if (!rating || !review.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields and select a rating.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const token = localStorage.getItem('auth-token')
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`${config.api.baseUrl}/api/reviews`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          rating,
          comment: review,
          productId,
        }),
      })

      if (response.ok) {
        toast({
          title: "Review submitted!",
          description: "Thank you for your feedback. Your review has been published.",
        })

        // Reset form
        setRating(0)
        setReview("")

        // Refresh reviews
        const updatedReviews = await fetch(`${config.api.baseUrl}/api/reviews?productId=${productId}`)
        if (updatedReviews.ok) {
          const fetchedReviews = await updatedReviews.json()
          setReviews(fetchedReviews)
          
          // Recalculate average rating and distribution
          if (fetchedReviews.length > 0) {
            const totalRating = fetchedReviews.reduce((sum: number, review: Review) => sum + review.rating, 0)
            setAverageRating(totalRating / fetchedReviews.length)
            
            // Recalculate rating distribution
            const distribution: {[key: number]: number} = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
            fetchedReviews.forEach((review: Review) => {
              distribution[review.rating]++
            })
            setRatingDistribution(distribution)
          }
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to submit review. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
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
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <div className="flex">{renderStars(averageRating)}</div>
                <span className="text-lg font-medium">{averageRating.toFixed(1)} out of 5</span>
              </div>
              <p className="text-sm text-muted-foreground">Based on {reviews.length} reviews</p>
            </>
          )}
        </div>

        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = ratingDistribution[stars] || 0
            const percentage = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0
            
            return (
              <div key={stars} className="flex items-center gap-2">
                <span className="text-sm">{stars}</span>
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground">{percentage}%</span>
              </div>
            )
          })}
        </div>
      </div>

      <Separator />

      {/* Write a Review */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Write a Review</h3>
        {!isAuthenticated ? (
          <div className="text-center py-8 border rounded-lg bg-muted/50">
            <p className="text-muted-foreground mb-4">Please sign in to write a review</p>
            <Button asChild>
              <a href="/account/login">Sign In</a>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <Label>Your Rating</Label>
              <div className="mt-1 flex gap-1">{renderStars(rating, true)}</div>
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
        )}
      </div>

      <Separator />

      {/* Reviews List */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Customer Reviews</h3>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          reviews.map((review) => {
            const reviewerName = review.user.firstName && review.user.lastName 
              ? `${review.user.firstName} ${review.user.lastName}`
              : review.user.email.split('@')[0]
            const reviewDate = new Date(review.createdAt).toLocaleDateString()
            
            return (
              <div key={review.id} className="space-y-3">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback>{reviewerName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{reviewerName}</span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{reviewDate}</span>
                    </div>
                    <div className="flex">{renderStars(review.rating)}</div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                </div>
                {review.id !== reviews[reviews.length - 1].id && <Separator />}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
