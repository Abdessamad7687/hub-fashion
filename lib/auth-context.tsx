"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { config } from "./config"

interface User {
  id: string
  email: string
  firstName?: string | null
  lastName?: string | null
  phone?: string | null
  avatar?: string | null
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: ProfileData) => Promise<void>
  checkAuth: () => Promise<void>
}

interface RegisterData {
  email: string
  password: string
  firstName?: string
  lastName?: string
}

interface ProfileData {
  firstName?: string
  lastName?: string
  phone?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasMounted, setHasMounted] = useState(false)

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth-token')
      const headers: HeadersInit = {}
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      console.log('CheckAuth attempt:', { apiUrl: config.api.baseUrl, hasToken: !!token })
      const response = await fetch(`${config.api.baseUrl}/api/auth/me`, {
        credentials: 'include',
        headers
      })
      console.log('CheckAuth response:', { status: response.status, statusText: response.statusText })
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
        // Clear invalid token
        if (token) {
          localStorage.removeItem('auth-token')
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      setUser(null)
      setIsAuthenticated(false)
      localStorage.removeItem('auth-token')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setHasMounted(true)
    // Add a small delay to ensure proper hydration
    const timer = setTimeout(() => {
      checkAuth()
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  const login = async (email: string, password: string) => {
    console.log('Login attempt:', { email, apiUrl: config.api.baseUrl })
    const response = await fetch(`${config.api.baseUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    })
    console.log('Login response:', { status: response.status, statusText: response.statusText })

    if (!response.ok) {
      let errorMessage = "Login failed"
      try {
        const errorData = await response.json()
        errorMessage = errorData.error || errorMessage
      } catch (e) {
        // If we can't parse the error response, use the status text
        errorMessage = response.statusText || errorMessage
      }
      throw new Error(errorMessage)
    }

    const data = await response.json()

    // Store token from Authorization header as fallback
    const authHeader = response.headers.get('Authorization')
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      localStorage.setItem('auth-token', token)
    }

    setUser(data.user)
    setIsAuthenticated(true)
  }

  const register = async (userData: RegisterData) => {
    const response = await fetch(`${config.api.baseUrl}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify(userData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Registration failed")
    }

    setUser(data.user)
    setIsAuthenticated(true)
  }

  const logout = async () => {
    try {
      await fetch(`${config.api.baseUrl}/api/auth/logout`, {
        method: "POST",
        credentials: 'include',
      })
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setUser(null)
      setIsAuthenticated(false)
      localStorage.removeItem('auth-token')
    }
  }

  const updateProfile = async (data: ProfileData) => {
    console.log('Updating profile with data:', data);
    console.log('Current auth state:', { isAuthenticated, user });
    
    // First check if we're still authenticated
    if (!isAuthenticated || !user) {
      console.log('User not authenticated, checking auth...');
      await checkAuth();
      if (!isAuthenticated || !user) {
        throw new Error('User not authenticated');
      }
    }
    
    const response = await fetch(`${config.api.baseUrl}/api/users/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || "Profile update failed")
    }

    setUser(result.user)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading: hasMounted ? isLoading : true, // Show loading during SSR
        login,
        register,
        logout,
        updateProfile,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
