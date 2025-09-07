import { config } from "./config"

export interface AdminUser {
  id: string
  email: string
  role: "ADMIN" | "CLIENT"
  firstName?: string
  lastName?: string
}

export async function checkAdminAccess(): Promise<{ isAdmin: boolean; user?: AdminUser }> {
  try {
    const response = await fetch(`${config.api.baseUrl}/api/auth/me`, {
      credentials: 'include',
    })

    if (!response.ok) {
      return { isAdmin: false }
    }

    const data = await response.json()
    const user = data.user

    return {
      isAdmin: user?.role === "ADMIN",
      user: user
    }
  } catch (error) {
    console.error("Error checking admin access:", error)
    return { isAdmin: false }
  }
}

export function isAdminRole(role: string | undefined): boolean {
  return role === "ADMIN"
}

