# Class Diagram - Complete E-commerce Database Schema

```mermaid
classDiagram
    %% Core Domain Classes
    class User {
        -String id
        -String email
        -String password
        -String firstName
        -String lastName
        -String phone
        -UserRole role
        -DateTime createdAt
        -DateTime updatedAt
        +authenticate(password)
        +hasRole(role)
        +getFullName()
    }

    class Product {
        -String id
        -String name
        -String description
        -Float price
        -Int stock
        -Gender gender
        -String categoryId
        -DateTime createdAt
        -DateTime updatedAt
        +isInStock()
        +reduceStock(quantity)
        +increaseStock(quantity)
        +getAvailableSizes()
        +getAvailableColors()
    }

    class Category {
        -String id
        -String name
        -String description
        -String image
        +addProduct(product)
        +removeProduct(productId)
    }

    class Order {
        -String id
        -String userId
        -Float total
        -OrderStatus status
        -DateTime createdAt
        -DateTime updatedAt
        -String shippingFirstName
        -String shippingLastName
        -String shippingEmail
        -String shippingPhone
        -String shippingAddress
        -String shippingCity
        -String shippingState
        -String shippingZipCode
        -String shippingCountry
        -String paymentMethod
        +calculateTotal()
        +updateStatus(status)
        +validateShippingInfo()
    }

    class OrderItem {
        -String id
        -String orderId
        -String productId
        -Int quantity
        -Float price
        -String size
        -String color
        +calculateSubtotal()
        +updateQuantity(quantity)
        +validateItem()
    }

    class Cart {
        -String id
        -String userId
        -DateTime createdAt
        -DateTime updatedAt
        +addItem(item)
        +removeItem(itemId)
        +clearCart()
        +calculateTotal()
    }

    class CartItem {
        -String id
        -String cartId
        -String productId
        -Int quantity
        -String size
        -String color
        +updateQuantity(quantity)
        +calculateSubtotal()
    }

    class Review {
        -String id
        -Int rating
        -String comment
        -String userId
        -String productId
        -DateTime createdAt
        +validateRating()
        +isValidComment()
    }

    %% Product Detail Classes
    class ProductImage {
        -String id
        -String url
        -String productId
        +isValidUrl()
        +getImageType()
    }

    class ProductSize {
        -String id
        -String size
        -String productId
        +isValidSize()
        +getSizeOrder()
    }

    class ProductColor {
        -String id
        -String color
        -String productId
        +isValidColor()
        +getColorCode()
    }

    class ProductFeature {
        -String id
        -String name
        -String value
        -String productId
        +isValidFeature()
        +getFeatureType()
    }

    %% Enums
    class OrderStatus {
        <<enumeration>>
        PENDING
        CONFIRMED
        PROCESSING
        SHIPPED
        DELIVERED
        CANCELLED
    }

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

    %% Service Classes
    class OrderService {
        +createOrder(orderData, userId)
        +getOrderById(orderId, userId)
        +getUserOrders(userId)
        +getAllOrders()
        +updateOrder(orderId, orderData)
        +updateOrderStatus(orderId, status)
        +deleteOrder(orderId)
        +validateOrderData(orderData)
        +calculateOrderTotal(items)
    }

    class CartService {
        +addToCart(userId, productId, quantity, size, color)
        +removeFromCart(userId, cartItemId)
        +updateCartItem(cartItemId, quantity)
        +getUserCart(userId)
        +clearCart(userId)
        +calculateCartTotal(cartId)
    }

    class ProductService {
        +getProductById(id)
        +checkStock(productId, quantity)
        +updateStock(productId, quantity)
        +getProductsByCategory(categoryId)
        +searchProducts(query)
        +getProductImages(productId)
        +getProductSizes(productId)
        +getProductColors(productId)
        +getProductFeatures(productId)
    }

    class ReviewService {
        +createReview(userId, productId, rating, comment)
        +getProductReviews(productId)
        +getUserReviews(userId)
        +updateReview(reviewId, rating, comment)
        +deleteReview(reviewId)
        +calculateAverageRating(productId)
    }

    class NotificationService {
        +sendOrderConfirmation(order)
        +sendStatusUpdate(order, status)
        +sendShippingNotification(order)
    }

    %% Repository Classes
    class OrderRepository {
        +save(order)
        +findById(id)
        +findByUserId(userId)
        +findAll()
        +update(id, data)
        +delete(id)
    }

    class CartRepository {
        +save(cart)
        +findByUserId(userId)
        +saveItem(item)
        +findItemById(id)
        +deleteItem(id)
        +clearCart(cartId)
    }

    class ProductRepository {
        +save(product)
        +findById(id)
        +findByCategory(categoryId)
        +search(query)
        +update(id, data)
        +delete(id)
    }

    %% Controller Classes
    class OrderController {
        +createOrder(req, res)
        +getOrder(req, res)
        +getUserOrders(req, res)
        +getAllOrders(req, res)
        +updateOrder(req, res)
        +updateOrderStatus(req, res)
        +deleteOrder(req, res)
    }

    class CartController {
        +addToCart(req, res)
        +getCart(req, res)
        +updateCartItem(req, res)
        +removeFromCart(req, res)
        +clearCart(req, res)
    }

    class ProductController {
        +getProduct(req, res)
        +getProducts(req, res)
        +searchProducts(req, res)
        +getProductImages(req, res)
        +getProductSizes(req, res)
        +getProductColors(req, res)
        +getProductFeatures(req, res)
    }

    class ReviewController {
        +createReview(req, res)
        +getProductReviews(req, res)
        +getUserReviews(req, res)
        +updateReview(req, res)
        +deleteReview(req, res)
    }

    class AuthMiddleware {
        +authenticate(req, res, next)
        +authorize(roles)
    }

    %% Core Relationships
    User ||--o{ Order : "creates"
    User ||--|| Cart : "has"
    User ||--o{ Review : "writes"
    User ||--|| UserRole : "has role"

    Order ||--o{ OrderItem : "contains"
    Order ||--|| OrderStatus : "has status"

    OrderItem }o--|| Product : "references"

    Product }o--|| Category : "belongs to"
    Product ||--|| Gender : "has gender"
    Product ||--o{ ProductImage : "has images"
    Product ||--o{ ProductSize : "has sizes"
    Product ||--o{ ProductColor : "has colors"
    Product ||--o{ ProductFeature : "has features"
    Product ||--o{ Review : "receives reviews"
    Product ||--o{ CartItem : "in cart items"

    Cart ||--o{ CartItem : "contains"

    %% Service Dependencies
    OrderService --> OrderRepository : "uses"
    OrderService --> ProductService : "uses"
    OrderService --> NotificationService : "uses"
    
    CartService --> CartRepository : "uses"
    CartService --> ProductService : "uses"
    
    ProductService --> ProductRepository : "uses"
    
    ReviewService --> ProductRepository : "uses"

    %% Controller Dependencies
    OrderController --> OrderService : "uses"
    OrderController --> AuthMiddleware : "uses"
    
    CartController --> CartService : "uses"
    CartController --> AuthMiddleware : "uses"
    
    ProductController --> ProductService : "uses"
    
    ReviewController --> ReviewService : "uses"
    ReviewController --> AuthMiddleware : "uses"

    %% Composition
    Order *-- OrderItem : "composition"
    Cart *-- CartItem : "composition"
    Product *-- ProductImage : "composition"
    Product *-- ProductSize : "composition"
    Product *-- ProductColor : "composition"
    Product *-- ProductFeature : "composition"
```

## Class Descriptions

### Core Domain Entities

**User**
- Represents system users (clients and admins)
- Handles authentication and authorization
- Manages user profile information
- One-to-one relationship with Cart
- One-to-many relationship with Orders and Reviews

**Product**
- Represents products available for purchase
- Manages inventory and product details
- Handles stock management operations
- Belongs to a Category
- Has multiple Images, Sizes, Colors, and Features
- Referenced by OrderItems and CartItems

**Category**
- Organizes products into logical groups
- Contains category metadata and images
- One-to-many relationship with Products

**Order**
- Represents a customer order with shipping and payment information
- Contains business logic for order management
- Validates order data and calculates totals
- Belongs to a User
- Contains multiple OrderItems

**OrderItem**
- Represents individual items within an order
- Contains product details, quantity, and pricing
- Handles item-specific calculations
- References a Product

**Cart**
- Represents a user's shopping cart
- One-to-one relationship with User
- Contains multiple CartItems
- Manages cart-level operations

**CartItem**
- Represents individual items in a shopping cart
- Contains product details, quantity, size, and color
- References a Product
- Belongs to a Cart

**Review**
- Represents user reviews for products
- Contains rating, comment, and metadata
- Belongs to both User and Product

### Product Detail Entities

**ProductImage**
- Stores product image URLs
- Belongs to a Product
- Handles image validation and metadata

**ProductSize**
- Stores available sizes for a product
- Belongs to a Product
- Manages size-specific information

**ProductColor**
- Stores available colors for a product
- Belongs to a Product
- Manages color-specific information

**ProductFeature**
- Stores product features and specifications
- Belongs to a Product
- Manages key-value feature pairs

### Enumerations

**OrderStatus**
- PENDING: Order placed but not confirmed
- CONFIRMED: Order confirmed and being processed
- PROCESSING: Order being prepared
- SHIPPED: Order shipped to customer
- DELIVERED: Order delivered successfully
- CANCELLED: Order cancelled

**UserRole**
- CLIENT: Regular customer
- ADMIN: System administrator

**Gender**
- HOMME: Men's products
- FEMME: Women's products
- ENFANT: Children's products

### Service Layer

**OrderService**
- Contains business logic for order operations
- Orchestrates order creation and management
- Handles validation and calculations
- Manages order status transitions

**CartService**
- Manages shopping cart operations
- Handles adding/removing items
- Calculates cart totals
- Manages cart persistence

**ProductService**
- Manages product-related operations
- Handles stock validation and updates
- Provides product information
- Manages product details (images, sizes, colors, features)

**ReviewService**
- Manages product reviews
- Handles review creation and updates
- Calculates average ratings
- Validates review data

**NotificationService**
- Handles order-related notifications
- Sends status updates to customers
- Manages communication workflows

### Repository Layer

**OrderRepository**
- Data access layer for orders
- Abstracts database operations
- Implements CRUD operations for orders

**CartRepository**
- Data access layer for carts and cart items
- Manages cart persistence
- Handles cart item operations

**ProductRepository**
- Data access layer for products
- Manages product data persistence
- Handles product search and filtering

### Controller Layer

**OrderController**
- Handles HTTP requests for order operations
- Manages request/response processing
- Implements order API endpoints

**CartController**
- Handles HTTP requests for cart operations
- Manages cart API endpoints
- Processes cart-related requests

**ProductController**
- Handles HTTP requests for product operations
- Manages product API endpoints
- Processes product-related requests

**ReviewController**
- Handles HTTP requests for review operations
- Manages review API endpoints
- Processes review-related requests

**AuthMiddleware**
- Handles authentication and authorization
- Validates user permissions
- Protects API endpoints
