"use client"

import { createContext, useContext, useReducer, type ReactNode } from "react"
import { config } from "./config"

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  size?: string
  color?: string
}

export interface ShippingAddress {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  apartment?: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface Order {
  id: string
  items: OrderItem[]
  shippingAddress: ShippingAddress
  subtotal: number
  shipping: number
  tax: number
  total: number
  paymentMethod: "card" | "paypal"
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  createdAt: string
  estimatedDelivery?: string
}

interface OrderState {
  orders: Order[]
  currentOrder?: Order
}

interface OrderContextType extends OrderState {
  createOrder: (orderData: Omit<Order, "id" | "createdAt" | "status">) => Promise<Order>
  getOrder: (id: string) => Order | undefined
  fetchUserOrders: () => Promise<void>
  updateOrderStatus: (id: string, status: Order["status"]) => void
  clearCurrentOrder: () => void
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

type OrderAction =
  | { type: "CREATE_ORDER"; payload: Order }
  | { type: "SET_USER_ORDERS"; payload: Order[] }
  | { type: "UPDATE_ORDER_STATUS"; payload: { id: string; status: Order["status"] } }
  | { type: "SET_CURRENT_ORDER"; payload: Order }
  | { type: "CLEAR_CURRENT_ORDER" }

function orderReducer(state: OrderState, action: OrderAction): OrderState {
  switch (action.type) {
    case "CREATE_ORDER":
      return {
        ...state,
        orders: [action.payload, ...state.orders],
        currentOrder: action.payload,
      }

    case "SET_USER_ORDERS":
      return {
        ...state,
        orders: action.payload,
      }

    case "UPDATE_ORDER_STATUS":
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === action.payload.id ? { ...order, status: action.payload.status } : order,
        ),
      }

    case "SET_CURRENT_ORDER":
      return {
        ...state,
        currentOrder: action.payload,
      }

    case "CLEAR_CURRENT_ORDER":
      return {
        ...state,
        currentOrder: undefined,
      }

    default:
      return state
  }
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(orderReducer, { orders: [] })

  const createOrder = async (orderData: Omit<Order, "id" | "createdAt" | "status">): Promise<Order> => {
    try {
      // Call backend API to create order
      const response = await fetch(`${config.api.baseUrl}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const backendOrder = await response.json();
      
      // Transform backend order to frontend format
      const order: Order = {
        id: backendOrder.id,
        items: backendOrder.items.map((item: any) => ({
          id: item.productId,
          name: item.product?.name || 'Product',
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
        shippingAddress: orderData.shippingAddress,
        subtotal: orderData.subtotal,
        shipping: orderData.shipping,
        tax: orderData.tax,
        total: orderData.total,
        paymentMethod: orderData.paymentMethod,
        status: backendOrder.status.toLowerCase() as Order["status"],
        createdAt: new Date(backendOrder.createdAt).toISOString(),
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      };

          dispatch({ type: "CREATE_ORDER", payload: order })
    return order
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

  const fetchUserOrders = async (): Promise<void> => {
    try {
      console.log('Fetching user orders from:', `${config.api.baseUrl}/api/orders/user/me`);
      
      const response = await fetch(`${config.api.baseUrl}/api/orders/user/me`, {
        credentials: 'include',
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`Failed to fetch orders: ${response.status} ${errorText}`);
      }

      const backendOrders = await response.json();
      console.log('Backend orders received:', backendOrders);
      
      // Transform backend orders to frontend format
      const orders: Order[] = backendOrders.map((backendOrder: any) => ({
        id: backendOrder.id,
        items: backendOrder.items.map((item: any) => ({
          id: item.productId,
          name: item.product?.name || 'Product',
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
        shippingAddress: backendOrder.shippingFirstName ? {
          firstName: backendOrder.shippingFirstName,
          lastName: backendOrder.shippingLastName || '',
          email: backendOrder.shippingEmail || '',
          phone: backendOrder.shippingPhone || '',
          address: backendOrder.shippingAddress || '',
          city: backendOrder.shippingCity || '',
          state: backendOrder.shippingState || '',
          zipCode: backendOrder.shippingZipCode || '',
          country: backendOrder.shippingCountry || '',
        } : undefined,
        subtotal: backendOrder.total,
        shipping: 0,
        tax: 0,
        total: backendOrder.total,
        paymentMethod: (backendOrder.paymentMethod as any) || 'card',
        status: backendOrder.status.toLowerCase() as Order["status"],
        createdAt: new Date(backendOrder.createdAt).toISOString(),
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      }));

      console.log('Transformed orders:', orders);
      dispatch({ type: "SET_USER_ORDERS", payload: orders });
      console.log('Orders dispatched to state');
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }

  const getOrder = (id: string): Order | undefined => {
    return state.orders.find((order) => order.id === id)
  }

  const updateOrderStatus = (id: string, status: Order["status"]) => {
    dispatch({ type: "UPDATE_ORDER_STATUS", payload: { id, status } })
  }

  const clearCurrentOrder = () => {
    dispatch({ type: "CLEAR_CURRENT_ORDER" })
  }

  return (
    <OrderContext.Provider
      value={{
        ...state,
        createOrder,
        getOrder,
        fetchUserOrders,
        updateOrderStatus,
        clearCurrentOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrderContext)
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider")
  }
  return context
}
