"use client"

import { useState, useEffect, ReactNode } from "react"

interface ClientWrapperProps {
  children: ReactNode
  fallback?: ReactNode
}

export default function ClientWrapper({ children, fallback = null }: ClientWrapperProps) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return <>{fallback}</>
  }

  return <>{children}</>
}



