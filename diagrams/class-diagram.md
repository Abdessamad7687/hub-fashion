# Class Diagram - Orders Domain Model

```mermaid
classDiagram
    %% Core Domain Classes
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
        +addItem(item)
        +removeItem(itemId)
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

    class OrderRepository {
        +save(order)
        +findById(id)
        +findByUserId(userId)
        +findAll()
        +update(id, data)
        +delete(id)
    }

    class ProductService {
        +getProductById(id)
        +checkStock(productId, quantity)
        +updateStock(productId, quantity)
    }

    class NotificationService {
        +sendOrderConfirmation(order)
        +sendStatusUpdate(order, status)
        +sendShippingNotification(order)
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

    class AuthMiddleware {
        +authenticate(req, res, next)
        +authorize(roles)
    }

    %% Relationships
    Order ||--o{ OrderItem : "contains"
    Order }o--|| User : "belongs to"
    OrderItem }o--|| Product : "references"
    Product }o--|| Category : "belongs to"
    User ||--o{ Order : "creates"
    Order ||--|| OrderStatus : "has status"
    User ||--|| UserRole : "has role"
    Product ||--|| Gender : "has gender"

    %% Service Dependencies
    OrderService --> OrderRepository : "uses"
    OrderService --> ProductService : "uses"
    OrderService --> NotificationService : "uses"
    OrderController --> OrderService : "uses"
    OrderController --> AuthMiddleware : "uses"

    %% Composition
    Order *-- OrderItem : "composition"
```

## Class Descriptions

### Domain Entities

**Order**
- Represents a customer order with shipping and payment information
- Contains business logic for order management
- Validates order data and calculates totals

**OrderItem**
- Represents individual items within an order
- Contains product details, quantity, and pricing
- Handles item-specific calculations

**User**
- Represents system users (clients and admins)
- Handles authentication and authorization
- Manages user profile information

**Product**
- Represents products available for purchase
- Manages inventory and product details
- Handles stock management operations

### Service Layer

**OrderService**
- Contains business logic for order operations
- Orchestrates order creation and management
- Handles validation and calculations

**OrderRepository**
- Data access layer for orders
- Abstracts database operations
- Implements CRUD operations

**ProductService**
- Manages product-related operations
- Handles stock validation and updates
- Provides product information

**NotificationService**
- Handles order-related notifications
- Sends status updates to customers
- Manages communication workflows

### Controller Layer

**OrderController**
- Handles HTTP requests for order operations
- Manages request/response processing
- Implements API endpoints

**AuthMiddleware**
- Handles authentication and authorization
- Validates user permissions
- Protects API endpoints
