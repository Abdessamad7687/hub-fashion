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
      const token = localStorage.getItem('token')
      
      // If no token, user is not authenticated
      if (!token) {
        console.log('No token found, user not authenticated')
        setUser(null)
        setIsAuthenticated(false)
        setIsLoading(false)
        return
      }
      
      const headers: HeadersInit = {
        'Authorization': `Bearer ${token}`
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
        console.log('Auth check failed, clearing token')
        setUser(null)
        setIsAuthenticated(false)
        localStorage.removeItem('token')
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      setUser(null)
      setIsAuthenticated(false)
      localStorage.removeItem('token')
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

  // Add a cleanup effect to ensure state consistency
  useEffect(() => {
    if (hasMounted) {
      const token = localStorage.getItem('token')
      if (!token && isAuthenticated) {
        console.log('Token missing but user appears authenticated, clearing state')
        clearAuthState()
      }
    }
  }, [hasMounted, isAuthenticated])

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
    console.log('Login response data:', data)

    // Store token from Authorization header as fallback
    const authHeader = response.headers.get('Authorization')
    console.log('Login response auth header:', authHeader)
    console.log('All response headers:', Object.fromEntries(response.headers.entries()))
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      console.log('Storing token in localStorage:', token.substring(0, 20) + '...')
      console.log('Full token length:', token.length)
      localStorage.setItem('token', token)
      console.log('Token stored successfully in localStorage')
    } else if (data.token) {
      // Fallback: check if token is in response body
      console.log('No Authorization header, checking response body for token')
      console.log('Token from response body:', data.token.substring(0, 20) + '...')
      localStorage.setItem('token', data.token)
      console.log('Token stored successfully in localStorage from response body')
    } else {
      console.warn('No Authorization header or token in response body')
      console.log('Available headers:', Array.from(response.headers.keys()))
      console.log('Response data keys:', Object.keys(data))
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
      localStorage.removeItem('token')
    }
  }

  const clearAuthState = () => {
    console.log('Clearing auth state due to inconsistency')
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('token')
  }

  const updateProfile = async (data: ProfileData) => {
    console.log('Updating profile with data:', data);
    console.log('Current auth state:', { isAuthenticated, user });
    
    // Get the token from localStorage first
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token ? 'Found' : 'Not found');
    
    // If no token, user needs to login
    if (!token) {
      console.log('No token found, clearing auth state and redirecting to login');
      clearAuthState();
      throw new Error('Please login to update your profile');
    }
    
    // If we have a token but no user state, try to verify it
    if (!isAuthenticated || !user) {
      console.log('User not authenticated, checking auth...');
      await checkAuth();
      if (!isAuthenticated || !user) {
        throw new Error('User not authenticated');
      }
    }
    
    // Double-check that we still have a token after auth check
    const currentToken = localStorage.getItem('token');
    if (!currentToken) {
      console.log('Token lost during auth check, redirecting to login');
      clearAuthState();
      throw new Error('Please login to update your profile');
    }
    
    const response = await fetch(`${config.api.baseUrl}/api/users/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || "Profile update failed")
    }

    console.log('Profile update successful, updating user state:', result)
    setUser(result)
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
