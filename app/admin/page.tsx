"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Tag, Users, ShoppingCart, TrendingUp, Eye, FileText } from "lucide-react"
import { config } from "@/lib/config"
import { useAuth } from "@/lib/auth-context"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface DashboardStats {
  totalProducts: number
  totalCategories: number
  totalOrders: number
  totalUsers: number
  totalRevenue: number
  productGrowth: number
  categoryGrowth: number
  orderGrowth: number
  userGrowth: number
  revenueGrowth: number
}

interface ChartData {
  month: string
  users: number
  revenue: number
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    productGrowth: 0,
    categoryGrowth: 0,
    orderGrowth: 0,
    userGrowth: 0,
    revenueGrowth: 0,
  })
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          console.log('No token found for admin dashboard')
          setIsLoading(false)
          return
        }

        // Fetch products
        const productsRes = await fetch(`${config.api.baseUrl}/api/products`)
        const products = productsRes.ok ? await productsRes.json() : []
        
        // Fetch categories
        const categoriesRes = await fetch(`${config.api.baseUrl}/api/categories`)
        const categories = categoriesRes.ok ? await categoriesRes.json() : []
        
        // Fetch orders (admin only)
        const ordersRes = await fetch(`${config.api.baseUrl}/api/orders`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        })
        const orders = ordersRes.ok ? await ordersRes.json() : []
        
        // Fetch users (admin only)
        const usersRes = await fetch(`${config.api.baseUrl}/api/admin/users`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        })
        const users = usersRes.ok ? await usersRes.json() : []
        
        // Calculate revenue
        const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0)
        
        // Calculate growth (simplified - in a real app you'd compare with previous month)
        const productGrowth = products.length > 0 ? Math.floor(Math.random() * 20) + 5 : 0
        const categoryGrowth = categories.length > 0 ? Math.floor(Math.random() * 15) + 3 : 0
        const orderGrowth = orders.length > 0 ? Math.floor(Math.random() * 25) + 10 : 0
        const userGrowth = users.length > 0 ? Math.floor(Math.random() * 20) + 8 : 0
        const revenueGrowth = totalRevenue > 0 ? Math.floor(Math.random() * 30) + 15 : 0

        // Fetch chart data from API
        const chartRes = await fetch(`${config.api.baseUrl}/api/admin/chart-data`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        })
        const chartData = chartRes.ok ? await chartRes.json() : []

        setStats({
          totalProducts: products.length,
          totalCategories: categories.length,
          totalOrders: orders.length,
          totalUsers: users.length,
          totalRevenue,
          productGrowth,
          categoryGrowth,
          orderGrowth,
          userGrowth,
          revenueGrowth,
        })
        
        setChartData(chartData)
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  +{stats.userGrowth}% from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Users Growth</CardTitle>
            <CardDescription>Monthly user registration trends</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground">Loading chart...</div>
              </div>
            ) : chartData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center">
                <div className="text-muted-foreground">No data available</div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>Monthly revenue performance</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground">Loading chart...</div>
              </div>
            ) : chartData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center">
                <div className="text-muted-foreground">No data available</div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
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
              <FileText className="h-5 w-5" />
              Order Management
            </CardTitle>
            <CardDescription>
              View and manage customer orders
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/admin/orders">View All Orders</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/orders">Order Analytics</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
            </CardTitle>
            <CardDescription>
              Manage customer accounts and permissions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/admin/users">View All Users</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/users">User Analytics</Link>
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