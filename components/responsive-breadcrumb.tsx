"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Home } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface ResponsiveBreadcrumbProps {
  items?: BreadcrumbItem[]
  className?: string
}

export function ResponsiveBreadcrumb({ items = [], className = "" }: ResponsiveBreadcrumbProps) {
  const pathname = usePathname()
  
  // Generate breadcrumb items from pathname if no items provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items.length > 0) return items
    
    const pathSegments = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []
    
    let currentPath = ''
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      
      // Skip dynamic segments like [id] or [slug]
      if (segment.startsWith('[') && segment.endsWith(']')) {
        return
      }
      
      let label = segment
      
      // Customize labels for specific routes
      switch (segment) {
        case 'categories':
          label = 'Categories'
          break
        case 'products':
          label = 'Products'
          break
        case 'cart':
          label = 'Shopping Cart'
          break
        case 'checkout':
          label = 'Checkout'
          break
        case 'account':
          label = 'My Account'
          break
        case 'wishlist':
          label = 'Wishlist'
          break
        case 'search':
          label = 'Search Results'
          break
        case 'admin':
          label = 'Admin Dashboard'
          break
        default:
          // Capitalize first letter and replace hyphens with spaces
          label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
      }
      
      // Don't make the last item a link
      const isLast = index === pathSegments.length - 1
      
      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath
      })
    })
    
    return breadcrumbs
  }
  
  const breadcrumbItems = generateBreadcrumbs()
  
  // Don't show breadcrumb on home page
  if (pathname === '/' || breadcrumbItems.length === 0) {
    return null
  }
  
  return (
    <div className={`py-4 ${className}`}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/" className="flex items-center gap-1">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          
          {breadcrumbItems.map((item, index) => (
            <div key={index} className="flex items-center">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {item.href ? (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>
                      <span className="truncate max-w-[150px] sm:max-w-none">
                        {item.label}
                      </span>
                    </Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>
                    <span className="truncate max-w-[150px] sm:max-w-none">
                      {item.label}
                    </span>
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}
