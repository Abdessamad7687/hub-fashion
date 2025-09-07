// Simple admin API client that uses password-based authentication
// No JWT tokens, no complex auth flows

const ADMIN_PASSWORD = 'admin123';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

class SimpleAdminAPI {
  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'x-admin-password': ADMIN_PASSWORD,
    };
  }

  async getStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/stats`, {
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      throw error;
    }
  }

  async getUsers() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async getProducts() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/products`, {
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getOrders() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/orders`, {
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }
}

export const simpleAdminAPI = new SimpleAdminAPI();
