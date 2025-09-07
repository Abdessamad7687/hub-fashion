"use client"

import { createContext, useContext, useReducer, type ReactNode } from "react"

interface WishlistItem {
  id: string
  name: string
  price: number
  image?: string
  category: string | { id: string; name: string; description?: string; image?: string }
}

interface WishlistState {
  wishlist: WishlistItem[]
}

interface WishlistContextType extends WishlistState {
  addToWishlist: (item: WishlistItem) => void
  removeFromWishlist: (id: string) => void
  isInWishlist: (id: string) => boolean
  clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

type WishlistAction =
  | { type: "ADD_ITEM"; payload: WishlistItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR_WISHLIST" }

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.wishlist.find((item) => item.id === action.payload.id)

      if (existingItem) {
        return state // Item already in wishlist
      }

      return {
        ...state,
        wishlist: [...state.wishlist, action.payload],
      }
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        wishlist: state.wishlist.filter((item) => item.id !== action.payload),
      }

    case "CLEAR_WISHLIST":
      return {
        ...state,
        wishlist: [],
      }

    default:
      return state
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, { wishlist: [] })

  const addToWishlist = (item: WishlistItem) => {
    dispatch({ type: "ADD_ITEM", payload: item })
  }

  const removeFromWishlist = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }

  const isInWishlist = (id: string) => {
    return state.wishlist.some((item) => item.id === id)
  }

  const clearWishlist = () => {
    dispatch({ type: "CLEAR_WISHLIST" })
  }

  return (
    <WishlistContext.Provider
      value={{
        ...state,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
