"use client"

import { createContext, useContext, useReducer, useEffect, useState, type ReactNode } from "react"
import { config } from "./config"

interface CartItem {
  id: string
  name: string
  price: number
  image?: string
  quantity: number
  size?: string
  color?: string
  cartItemId?: string // Backend cart item ID for database operations
}

interface CartState {
  cart: CartItem[]
}

interface CartContextType extends CartState {
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => Promise<void>
  removeItem: (id: string) => Promise<void>
  updateQuantity: (id: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  fetchCart: () => Promise<void>
  isLoading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "SET_CART"; payload: CartItem[] }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_CART":
      return {
        ...state,
        cart: action.payload,
      }

    case "ADD_ITEM": {
      const existingItem = state.cart.find((item) => item.id === action.payload.id)

      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.id === action.payload.id ? { ...item, quantity: item.quantity + action.payload.quantity } : item,
          ),
        }
      }

      return {
        ...state,
        cart: [...state.cart, action.payload],
      }
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      }

    case "UPDATE_QUANTITY":
      return {
        ...state,
        cart: state.cart
          .map((item) =>
            item.id === action.payload.id ? { ...item, quantity: Math.max(0, action.payload.quantity) } : item,
          )
          .filter((item) => item.quantity > 0),
      }

    case "CLEAR_CART":
      return {
        ...state,
        cart: [],
      }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { cart: [] })
  const [isLoading, setIsLoading] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)

  const fetchCart = async () => {
    // For now, we'll fetch cart without auth check to avoid hydration issues
    // Auth integration can be added later when needed
    
    try {
      setIsLoading(true)
      const response = await fetch(`${config.api.baseUrl}/api/cart`, {
        credentials: 'include',
      })
      
      if (response.ok) {
        const cartData = await response.json()
        if (cartData.items && cartData.items.length > 0) {
          const cartItems = cartData.items.map((item: any) => ({
            id: item.productId,
            name: item.product?.name || 'Product',
            price: item.product?.price || 0,
            image: item.product?.images?.[0]?.url,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            cartItemId: item.id, // Store the cart item ID for backend operations
          }))
          dispatch({ type: "SET_CART", payload: cartItems })
        }
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addItem = async (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    console.log('Adding item to cart:', item)
    
    // Update local state immediately for better UX
    dispatch({
      type: "ADD_ITEM",
      payload: { ...item, quantity: item.quantity || 1 },
    })

    // TODO: Add backend sync when auth is properly integrated
    // For now, just update local state
  }

  const removeItem = async (id: string) => {
    // Update local state immediately
    dispatch({ type: "REMOVE_ITEM", payload: id })
    
    // TODO: Add backend sync when auth is properly integrated
  }

  const updateQuantity = async (id: string, quantity: number) => {
    // Update local state immediately
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
    
    // TODO: Add backend sync when auth is properly integrated
  }

  const clearCart = async () => {
    // Update local state immediately
    dispatch({ type: "CLEAR_CART" })
    
    // TODO: Add backend sync when auth is properly integrated
  }

  // Initialize component
  useEffect(() => {
    setHasMounted(true)
  }, [])

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        fetchCart,
        isLoading: hasMounted ? isLoading : false, // Don't show loading during SSR
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
