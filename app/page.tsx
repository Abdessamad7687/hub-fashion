import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import FeaturedProducts from "@/components/featured-products"
import CategoryGrid from "@/components/category-grid"
import Newsletter from "@/components/newsletter"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Fashion Store Hero - Modern clothing collection"
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20" />
        <div className="container relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white">
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Summer Collection 2025
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-gray-200 sm:text-xl">
            Discover our latest arrivals with styles that define the season. 
            Premium quality clothing for the modern lifestyle.
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
            <Button size="lg" className="px-8 py-4 text-lg" asChild>
              <Link href="/products">Shop Now</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-transparent text-white border-white hover:bg-white hover:text-black px-8 py-4 text-lg" 
              asChild
            >
              <Link href="/categories">Browse Categories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="section-padding bg-background">
        <div className="container">
          <div className="mb-12 flex flex-col items-center text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Shop by Category
              </h2>
              <p className="mt-2 text-muted-foreground">
                Find your perfect style across our curated collections
              </p>
            </div>
            <Link 
              href="/categories" 
              className="mt-4 text-sm font-medium underline-offset-4 hover:underline sm:mt-0"
            >
              View All Categories 
            </Link>
          </div>
          <CategoryGrid />
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding bg-muted/50">
        <div className="container">
          <div className="mb-12 flex flex-col items-center text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Featured Products
              </h2>
              <p className="mt-2 text-muted-foreground">
                Handpicked items that are trending right now
              </p>
            </div>
            <Link 
              href="/products" 
              className="mt-4 text-sm font-medium underline-offset-4 hover:underline sm:mt-0"
            >
              View All 
            </Link>
          </div>
          <FeaturedProducts />
        </div>
      </section>

      {/* Promotion Banner */}
      <section className="section-padding bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-8 text-center lg:flex-row lg:text-left">
            <div className="max-w-2xl">
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Get 20% Off Your First Order
              </h2>
              <p className="mb-6 text-lg text-primary-foreground/90">
                Sign up for our newsletter and receive a special discount code. 
                Join thousands of satisfied customers.
              </p>
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Button variant="secondary" size="lg" className="px-8 py-4 text-lg" asChild>
                  <Link href="/products">Shop Now</Link>
                </Button>
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg" asChild>
                  <Link href="/categories">Browse Categories</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-64 w-full max-w-md overflow-hidden rounded-2xl lg:h-80">
              <Image 
                src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="Special Promotion - Fashion Sale" 
                fill 
                className="object-cover" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section-padding bg-background">
        <div className="container">
          <Newsletter />
        </div>
      </section>
    </main>
  )
}
