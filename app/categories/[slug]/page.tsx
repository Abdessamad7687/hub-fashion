import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import ProductGrid from '@/components/product-grid'
import ProductFilters from '@/components/product-filters'

interface CategoryPageProps {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}


const categorySlugMap: { [key: string]: string } = {
  'men': 'Homme',
  'women': 'Femme',
  'kids': 'Enfant',
  'enfant': 'Enfant',
  'homme': 'Homme',
  'femme': 'Femme'
}

import { config } from "@/lib/config"

async function fetchCategory(slug: string) {
  try {
    // First try to find by the mapped category name
    const categoryName = categorySlugMap[slug.toLowerCase()] || slug
    const res = await fetch(`${config.api.baseUrl}/api/categories/slug/${encodeURIComponent(categoryName)}`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch (error) {
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

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center space-x-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <Link href="/categories" className="hover:text-foreground">Categories</Link>
        <span>/</span>
        <span className="text-foreground">{category.name}</span>
      </nav>

      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
            {category.description && (
              <p className="mt-2 text-muted-foreground">{category.description}</p>
            )}
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
          <ProductGrid 
            category={category.id} 
            sort={searchParams.sort} 
            price={searchParams.price} 
          />
        </main>
      </div>
    </div>
  )
}
