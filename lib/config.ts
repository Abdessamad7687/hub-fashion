export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
    categories: '/api/categories',
    products: '/api/products',
    auth: '/api/auth',
    users: '/api/users',
    cart: '/api/cart',
    orders: '/api/orders',
    reviews: '/api/reviews',
  },
  app: {
    name: 'Modern E-commerce',
    description: 'Your one-stop shop for fashion and lifestyle',
  }
}




