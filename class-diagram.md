# Class Diagram - Modern E-commerce Application

```mermaid
classDiagram
    %% Core Domain Models
    class User {
        +String id
        +String email
        +String password
        +String firstName
        +String lastName    
        +String phone
        +UserRole role
        +DateTime createdAt
        +DateTime updatedAt
        +Review[] reviews
        +Order[] orders
        +Cart cart
        +createUser()
        +authenticateUser()
        +updateUser()
        +getUserById()
    }
    
    class Product {
        +String id
        +String name
        +String description
        +Float price
        +Int stock
        +Gender gender
        +DateTime createdAt
        +DateTime updatedAt
        +String categoryId
        +Category category
        +Review[] reviews
        +OrderItem[] orderItems
        +CartItem[] cartItems
        +ProductImage[] images
        +ProductSize[] sizes
    }
    
    class Category {
        +String id
        +String name
        +String description
        +Product[] products
    }
    
    class Order {
        +String id
        +String userId
        +Float total
        +OrderStatus status
        +DateTime createdAt
        +DateTime updatedAt
        +String shippingFirstName
        +String shippingLastName
        +String shippingEmail
        +String shippingPhone
        +String shippingAddress
        +String shippingCity
        +String shippingState
        +String shippingZipCode
        +String shippingCountry
        +String paymentMethod
        +User user
        +OrderItem[] items
    }
    
    class OrderItem {
        +String id
        +String orderId
        +String productId
        +Int quantity
        +Float price
        +String size
        +String color
        +Order order
        +Product product
    }
    
    class Cart {
        +String id
        +String userId
        +DateTime createdAt
        +DateTime updatedAt
        +User user
        +CartItem[] items
    }
    
    class CartItem {
        +String id
        +String cartId
        +String productId
        +Int quantity
        +String size
        +String color
        +Cart cart
        +Product product
    }
    
    class Review {
        +String id
        +Int rating
        +String comment
        +String userId
        +String productId
        +DateTime createdAt
        +User user
        +Product product
    }
    
    class ProductImage {
        +String id
        +String url
        +String productId
        +Product product
    }
    
    class ProductSize {
        +String id
        +String size
        +String productId
        +Product product
    }
    
    %% Enums
    class UserRole {
        <<enumeration>>
        CLIENT
        ADMIN
    }
    
    class Gender {
        <<enumeration>>
        HOMME
        FEMME
        ENFANT
    }
    
    class OrderStatus {
        <<enumeration>>
        PENDING
        CONFIRMED
        PROCESSING
        SHIPPED
        DELIVERED
        CANCELLED
    }
    
    %% Context Classes (React Context)
    class CartContext {
        +CartItem[] cart
        +boolean isLoading
        +addItem()
        +removeItem()
        +updateQuantity()
        +clearCart()
        +fetchCart()
    }
    
    class OrderContext {
        +Order[] orders
        +Order currentOrder
        +createOrder()
        +getOrder()
        +fetchUserOrders()
        +updateOrderStatus()
        +clearCurrentOrder()
    }
    
    class WishlistContext {
        +WishlistItem[] wishlist
        +addToWishlist()
        +removeFromWishlist()
        +isInWishlist()
        +clearWishlist()
    }
    
    class AuthContext {
        +User user
        +boolean isAuthenticated
        +login()
        +logout()
        +register()
        +updateProfile()
    }
    
    %% Service Classes
    class AuthService {
        +hashPassword()
        +verifyPassword()
        +generateToken()
        +verifyToken()
        +createUser()
        +authenticateUser()
        +getUserById()
        +updateUser()
    }
    
    class ProductService {
        +getAllProducts()
        +getProductById()
        +getProductsByCategory()
        +getProductsByGender()
        +searchProducts()
        +createProduct()
        +updateProduct()
        +deleteProduct()
    }
    
    class OrderService {
        +createOrder()
        +getOrderById()
        +getUserOrders()
        +updateOrderStatus()
        +cancelOrder()
    }
    
    class CartService {
        +addToCart()
        +removeFromCart()
        +updateCartItem()
        +getUserCart()
        +clearCart()
    }
    
    %% API Controllers
    class AuthController {
        +register()
        +login()
        +logout()
        +getProfile()
        +updateProfile()
    }
    
    class ProductController {
        +getProducts()
        +getProduct()
        +createProduct()
        +updateProduct()
        +deleteProduct()
    }
    
    class OrderController {
        +createOrder()
        +getOrders()
        +getOrder()
        +updateOrderStatus()
    }
    
    class CartController {
        +getCart()
        +addToCart()
        +updateCartItem()
        +removeFromCart()
        +clearCart()
    }
    
    class AdminController {
        +getDashboard()
        +manageProducts()
        +manageOrders()
        +manageUsers()
        +getAnalytics()
    }
    
    %% Component Classes
    class Header {
        +cartItemsCount
        +wishlistItemsCount
        +isCartOpen
        +toggleCart()
        +toggleMobileMenu()
    }
    
    class ProductGrid {
        +Product[] products
        +renderProducts()
        +handleProductClick()
    }
    
    class CartDrawer {
        +CartItem[] items
        +updateQuantity()
        +removeItem()
        +proceedToCheckout()
    }
    
    class CheckoutForm {
        +ShippingAddress address
        +PaymentMethod payment
        +submitOrder()
        +validateForm()
    }
    
    %% Relationships
    User ||--o{ Order : places
    User ||--o{ Review : writes
    User ||--|| Cart : has
    User }o--|| UserRole : has
    
    Product ||--o{ OrderItem : "included in"
    Product ||--o{ CartItem : "added to"
    Product ||--o{ Review : reviewed
    Product ||--o{ ProductImage : has
    Product ||--o{ ProductSize : has
    Product }o--|| Category : belongs to
    Product }o--|| Gender : categorized by
    
    Order ||--o{ OrderItem : contains
    Order }o--|| OrderStatus : has status
    
    Cart ||--o{ CartItem : contains
    
    OrderItem }o--|| Product : references
    CartItem }o--|| Product : references
    Review }o--|| User : written by
    Review }o--|| Product : reviews
    
    ProductImage }o--|| Product : belongs to
    ProductSize }o--|| Product : belongs to
    
    %% Service Dependencies
    AuthService ..> User : manages
    ProductService ..> Product : manages
    OrderService ..> Order : manages
    CartService ..> Cart : manages
    
    %% Controller Dependencies
    AuthController ..> AuthService : uses
    ProductController ..> ProductService : uses
    OrderController ..> OrderService : uses
    CartController ..> CartService : uses
    
    %% Context Dependencies
    CartContext ..> CartService : uses
    OrderContext ..> OrderService : uses
    AuthContext ..> AuthService : uses
    
    %% Component Dependencies
    Header ..> CartContext : uses
    Header ..> WishlistContext : uses
    ProductGrid ..> Product : displays
    CartDrawer ..> CartContext : uses
    CheckoutForm ..> OrderContext : uses
```

## Key Features of the Class Diagram:

### 1. **Domain Models**
- **User**: Core user entity with authentication and profile management
- **Product**: Product catalog with images, sizes, and categorization
- **Order**: Order management with shipping details and status tracking
- **Cart**: Shopping cart functionality
- **Review**: Product review system

### 2. **Enumerations**
- **UserRole**: CLIENT, ADMIN
- **Gender**: HOMME, FEMME, ENFANT (French for Men, Women, Kids)
- **OrderStatus**: Complete order lifecycle management

### 3. **Context Classes (React)**
- **CartContext**: Global cart state management
- **OrderContext**: Order state management
- **WishlistContext**: Wishlist functionality
- **AuthContext**: Authentication state

### 4. **Service Layer**
- **AuthService**: User authentication and management
- **ProductService**: Product catalog operations
- **OrderService**: Order processing
- **CartService**: Cart operations

### 5. **API Controllers**
- RESTful API endpoints for all major operations
- Admin-specific functionality
- Proper separation of concerns

### 6. **UI Components**
- React components for user interface
- State management integration
- User interaction handling

This class diagram represents a modern, scalable e-commerce application with proper separation of concerns, state management, and a clean architecture pattern.


