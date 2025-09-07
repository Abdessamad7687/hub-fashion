"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, Mail, Phone, Calendar } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"

export default function AccountPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, isAuthenticated, isLoading, logout, updateProfile } = useAuth()

  const [isUpdating, setIsUpdating] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  })

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/account/login")
      return
    }

    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
      })
    }
  }, [isAuthenticated, isLoading, router, user])

  const handleLogout = async () => {
    await logout()
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    })
    router.push("/")
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)

    try {
      await updateProfile(profileData)
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  const userInitials =
    `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || user.email[0].toUpperCase()

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar || undefined} />
              <AvatarFallback className="text-lg">{userInitials}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : "My Account"}
              </h1>
              <p className="text-muted-foreground">{user.email}</p>
              {user.phone && (
                <p className="text-muted-foreground flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {user.phone}
                </p>
              )}
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Log Out
          </Button>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>Update your personal information and contact details.</CardDescription>
              </CardHeader>
              <form onSubmit={handleProfileUpdate}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={profileData.firstName}
                        onChange={handleInputChange}
                        disabled={isUpdating}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={profileData.lastName}
                        onChange={handleInputChange}
                        disabled={isUpdating}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="email" type="email" value={user.email} disabled className="pl-10" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed. Contact support if you need to update your email.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        disabled={isUpdating}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="rounded-lg bg-muted p-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">Member since:</span>
                      <span className="text-muted-foreground">{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? "Updating..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>View and track your recent orders.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border">
                  <div className="p-8 text-center text-muted-foreground">
                    <div className="mb-4">
                      <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center">📦</div>
                    </div>
                    <p className="font-medium">No orders yet</p>
                    <p className="text-sm">When you place your first order, it will appear here.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="addresses" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Saved Addresses</CardTitle>
                <CardDescription>Manage your shipping and billing addresses.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center rounded-lg border border-dashed p-8">
                  <div className="text-center">
                    <div className="mb-4">
                      <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center">📍</div>
                    </div>
                    <p className="font-medium">No addresses saved</p>
                    <p className="text-sm text-muted-foreground mb-4">Add an address to make checkout faster.</p>
                    <Button variant="outline">Add New Address</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
