# Admin Panel Setup

This document explains how to set up and use the admin panel for the e-commerce website.

## Features

The admin panel provides the following functionality:

- **Dashboard**: Overview of key metrics (users, products, orders, reviews, total sales)
- **Product Management**: Create, read, update, and delete products
- **Category Management**: Create, read, update, and delete categories
- **Order Management**: View and update order statuses
- **User Management**: View users and update their roles

## Setup Instructions

### 1. Database Setup

Make sure your PostgreSQL database is running and the connection string is configured in your `.env` file:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
```

### 2. Seed the Database

Run the seed script to create initial data including an admin user:

```bash
cd backend
node seed.js
```

This will create:
- Sample categories (Homme, Femme, Enfant)
- Sample products
- Admin user: `admin@eshop.com` / `adminpass`
- Client user: `client@eshop.com` / `clientpass`

### 3. Start the Backend Server

```bash
cd backend
npm start
```

### 4. Start the Frontend

```bash
npm run dev
```

## Accessing the Admin Panel

1. Navigate to `http://localhost:3000/admin`
2. You'll be redirected to the login page if not authenticated
3. Login with the admin credentials:
   - Email: `admin@eshop.com`
   - Password: `adminpass`

## Admin Panel Usage

### Dashboard
- View key metrics and statistics
- Quick overview of your store's performance

### Products
- **Add Product**: Click "Add Product" to create new products
- **Edit Product**: Click the edit icon on any product card
- **Delete Product**: Click the delete icon and confirm
- **View Product**: Click the eye icon to view the product on the frontend

### Categories
- **Add Category**: Click "Add Category" to create new categories
- **Edit Category**: Click the edit icon on any category card
- **Delete Category**: Click the delete icon and confirm

### Orders
- View all customer orders
- Update order status using the dropdown
- View order details and items

### Users
- View all registered users
- Update user roles (Client/Admin)
- See user registration dates

## Security

- The admin panel is protected by authentication
- Only users with `ADMIN` role can access the panel
- All admin routes require valid JWT tokens
- User sessions are managed securely

## API Endpoints

The admin panel uses the following API endpoints:

- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/products` - List all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category
- `GET /api/admin/orders` - List all orders
- `PUT /api/orders/:id` - Update order
- `GET /api/admin/users` - List all users
- `PUT /api/users/:id` - Update user

## Troubleshooting

### Cannot Access Admin Panel
- Ensure you're logged in with an admin account
- Check that your JWT token is valid
- Verify the user has `ADMIN` role in the database

### API Errors
- Check that the backend server is running
- Verify database connection
- Check browser console for error messages

### Database Issues
- Ensure PostgreSQL is running
- Check database connection string
- Run migrations if needed: `npx prisma migrate dev`










