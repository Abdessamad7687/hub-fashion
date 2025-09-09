import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import ProductGrid from '@/components/product-grid'
import ProductFilters from '@/components/product-filters'
import ProductSort from '@/components/product-sort'
import { ResponsiveBreadcrumb } from '@/components/responsive-breadcrumb'

interface CategoryPageProps {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}


const categorySlugMap: { [key: string]: string } = {
  'men': 'Men',
  'women': 'Women',
  'kids': 'Kids',
  'accessories': 'Accessories',
  'shoes': 'Shoes',
  'bags': 'Bags',
  'enfant': 'Kids',
  'homme': 'Men',
  'femme': 'Women'
}

import { config } from "@/lib/config"

async function fetchCategory(slug: string) {
  try {
    // Check if the slug looks like an ID (long alphanumeric string)
    const isId = /^[a-zA-Z0-9]{20,}$/.test(slug)
    
    if (isId) {
      // If it's an ID, fetch directly by ID
      const res = await fetch(`${config.api.baseUrl}/api/categories/${slug}`, { cache: 'no-store' })
      if (res.ok) {
        return res.json()
      }
    }
    
    // Fetch all categories and find the one that matches our slug
    const allCategoriesRes = await fetch(`${config.api.baseUrl}/api/categories`, { cache: 'no-store' })
    if (!allCategoriesRes.ok) return null
    
    const allCategories = await allCategoriesRes.json()
    
    // Find category by slug mapping - check both the mapped name and direct name match
    const category = allCategories.find((cat: any) => {
      const mappedSlug = categorySlugMap[slug.toLowerCase()] || slug.toLowerCase()
      const categoryNameSlug = cat.name.toLowerCase().replace(/\s+/g, '-')
      return cat.name.toLowerCase() === mappedSlug || categoryNameSlug === slug.toLowerCase()
    })
    
    return category || null
  } catch (error) {
    console.error('Error fetching category:', error)
    return null
  }
}

async function fetchProducts(categoryId: string, searchParams: any) {
  const params = new URLSearchParams()
  params.append('category', categoryId)
  
  if (searchParams.price) params.append('price', searchParams.price as string)
  if (searchParams.sort) params.append('sort', searchParams.sort as string)
  if (searchParams.gender) params.append('gender', searchParams.gender as string)
  
  try {
    const res = await fetch(`${config.api.baseUrl}/api/products?${params.toString()}`, { cache: 'no-store' })
    if (!res.ok) return []
    return res.json()
  } catch (error) {
    return []
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await fetchCategory(params.slug)
  
  if (!category) {
    return {
      title: 'Category Not Found',
    }
  }

  return {
    title: `${category.name} - Modern E-commerce`,
    description: category.description || `Shop our ${category.name.toLowerCase()} collection`,
  }
} 

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const category = await fetchCategory(params.slug)
  
  if (!category) {
    notFound()
  }

  const products = await fetchProducts(category.id, searchParams)

  // Generate breadcrumb items
  const breadcrumbItems = [
    { label: "Categories", href: "/categories" },
    { label: category.name }
  ]

  return (
    <div className="container py-8">
      <ResponsiveBreadcrumb items={breadcrumbItems} />

      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {category.image && (
              <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
              {category.description && (
                <p className="mt-2 text-muted-foreground">{category.description}</p>
              )}
            </div>
          </div>
          <Link 
            href="/categories" 
            className="text-sm text-muted-foreground hover:text-foreground underline"
          >
            ← Back to Categories
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <ProductFilters />
        </aside>
        
        <main className="lg:col-span-3">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{category.name} Products</h2>
              <ProductSort />
            </div>
            <ProductGrid 
              category={category.id} 
              sort={searchParams.sort} 
              price={searchParams.price}
              page={searchParams.page}
            />
          </div>
        </main>
      </div>
    </div>
  )
}
