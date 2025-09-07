"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, ArrowLeft, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, isAuthenticated, user, isLoading } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [error, setError] = useState("")

  const redirectTo = searchParams.get("redirect") || "/admin"

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      if (user?.role === "ADMIN") {
        router.push(redirectTo)
      } else {
        setError("You don't have admin privileges. Please contact an administrator.")
      }
    }
  }, [isAuthenticated, user, isLoading, router, redirectTo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggingIn(true)
    setError("")

    try {
      await login(formData.email, formData.password)
      
      // The useEffect will handle the redirect after successful login
      toast({
        title: "Login successful!",
        description: "Redirecting to admin panel...",
      })
    } catch (error: any) {
      setError(error.message || "Login failed. Please check your credentials.")
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials.",
        variant: "destructive",
      })
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>
            Sign in to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="admin@example.com"
                required
                disabled={isLoggingIn}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                  disabled={isLoggingIn}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoggingIn}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoggingIn}>
              {isLoggingIn ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Button asChild variant="outline" className="w-full">
                <Link href="/account/login">
                  Regular User Login
                </Link>
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Store
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Need admin access? Contact your system administrator.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

