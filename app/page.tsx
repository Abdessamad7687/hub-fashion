import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import CustomHero from "@/components/custom-hero"
import FeaturedProducts from "@/components/featured-products"
import LatestProducts from "@/components/latest-products"
import CategoryGrid from "@/components/category-grid"
import LiveStatsSection from "@/components/live-stats-section"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Custom Hero Section */}
      <CustomHero />

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

      {/* Latest Products */}
      <section className="section-padding bg-background">
        <div className="container">
          <LatestProducts />
        </div>
      </section>

      {/* Live Stats & Social Proof Section */}
      <LiveStatsSection />

    </main>
  )
}
