"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import SearchBar from "./search-bar"

export default function MobileSearch() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="h-auto">
        <div className="p-4">
          <SearchBar className="w-full" />
        </div>
      </SheetContent>
    </Sheet>
  )
}
