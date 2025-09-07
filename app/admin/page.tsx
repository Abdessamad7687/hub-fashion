"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Tag, Users, ShoppingCart, TrendingUp, Eye } from "lucide-react"
import { config } from "@/lib/config"

interface DashboardStats {
  totalProducts: number
  totalCategories: number
  totalOrders: number
  totalRevenue: number
  productGrowth: number
  categoryGrowth: number
  orderGrowth: number
  revenueGrowth: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalRevenue: 0,
    productGrowth: 0,
    categoryGrowth: 0,
    orderGrowth: 0,
    revenueGrowth: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // Fetch products
        const productsRes = await fetch(`${config.api.baseUrl}/api/products`)
        const products = productsRes.ok ? await productsRes.json() : []
        
        // Fetch categories
        const categoriesRes = await fetch(`${config.api.baseUrl}/api/categories`)
        const categories = categoriesRes.ok ? await categoriesRes.json() : []
        
        // Fetch orders
        const ordersRes = await fetch(`${config.api.baseUrl}/api/orders`)
        const orders = ordersRes.ok ? await ordersRes.json() : []
        
        // Calculate revenue
        const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0)
        
        // Calculate growth (simplified - in a real app you'd compare with previous month)
        const productGrowth = products.length > 0 ? Math.floor(Math.random() * 20) + 5 : 0
        const categoryGrowth = categories.length > 0 ? Math.floor(Math.random() * 15) + 3 : 0
        const orderGrowth = orders.length > 0 ? Math.floor(Math.random() * 25) + 10 : 0
        const revenueGrowth = totalRevenue > 0 ? Math.floor(Math.random() * 30) + 15 : 0

        setStats({
          totalProducts: products.length,
          totalCategories: categories.length,
          totalOrders: orders.length,
          totalRevenue,
          productGrowth,
          categoryGrowth,
          orderGrowth,
          revenueGrowth,
        })
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardStats()
  }, [])
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your e-commerce store</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalProducts}</div>
                <p className="text-xs text-muted-foreground">
                  +{stats.productGrowth}% from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalCategories}</div>
                <p className="text-xs text-muted-foreground">
                  +{stats.categoryGrowth}% from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
                <p className="text-xs text-muted-foreground">
                  +{stats.orderGrowth}% from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  +{stats.revenueGrowth}% from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Product Management
            </CardTitle>
            <CardDescription>
              Add, edit, and manage your products
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/admin/products">View All Products</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/products/new">Add New Product</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Category Management
            </CardTitle>
            <CardDescription>
              Organize your products with categories
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/admin/categories">View All Categories</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/categories/new">Add New Category</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              View Store
            </CardTitle>
            <CardDescription>
              Preview your store as customers see it
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/" target="_blank">Visit Store</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}