# Sequence Diagram - Order Creation Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant API as OrderController
    participant Auth as AuthMiddleware
    participant OS as OrderService
    participant PS as ProductService
    participant OR as OrderRepository
    participant NS as NotificationService
    participant DB as Database

    %% Order Creation Flow
    C->>API: POST /api/orders
    Note over C,API: Request with order data, items, shipping info

    API->>Auth: authenticate()
    Auth->>DB: validate token
    DB-->>Auth: user data
    Auth-->>API: user authenticated

    API->>OS: createOrder(orderData, userId)
    
    %% Validation Phase
    OS->>OS: validateOrderData(orderData)
    Note over OS: Check required fields, format validation

    %% Product Validation
    loop For each item in order
        OS->>PS: checkStock(productId, quantity)
        PS->>DB: query product stock
        DB-->>PS: stock level
        PS-->>OS: stock available/not available
    end

    %% Calculate Totals
    OS->>OS: calculateOrderTotal(items)
    Note over OS: Calculate subtotal, tax, shipping, total

    %% Create Order
    OS->>OR: save(order)
    OR->>DB: INSERT order
    DB-->>OR: order created with ID
    OR-->>OS: order object

    %% Create Order Items
    loop For each item
        OS->>OR: save(orderItem)
        OR->>DB: INSERT order_item
        DB-->>OR: item created
    end

    %% Update Product Stock
    loop For each item
        OS->>PS: updateStock(productId, -quantity)
        PS->>DB: UPDATE product SET stock = stock - quantity
        DB-->>PS: stock updated
    end

    %% Send Notifications
    OS->>NS: sendOrderConfirmation(order)
    NS->>C: email confirmation
    Note over NS,C: Send order confirmation email

    OS-->>API: order created successfully
    API-->>C: 201 Created + order data

    %% Error Handling
    Note over OS,API: If validation fails
    OS-->>API: validation error
    API-->>C: 400 Bad Request + error details

    Note over PS,API: If stock insufficient
    PS-->>OS: stock error
    OS-->>API: stock error
    API-->>C: 400 Bad Request + stock error
```

## Order Creation Flow Description

### 1. **Authentication Phase**
- Client sends POST request to `/api/orders`
- AuthMiddleware validates the JWT token
- User authentication is verified

### 2. **Validation Phase**
- OrderService validates the order data structure
- Checks required fields (items, shipping address, totals)
- Validates data formats and business rules

### 3. **Product Validation**
- For each item in the order:
  - ProductService checks if product exists
  - Verifies sufficient stock is available
  - Validates product options (size, color)

### 4. **Calculation Phase**
- OrderService calculates order totals:
  - Subtotal (sum of item prices × quantities)
  - Tax calculation
  - Shipping costs
  - Final total

### 5. **Order Creation**
- OrderRepository saves the order to database
- Order items are created and linked to the order
- Order status is set to "PENDING"

### 6. **Inventory Update**
- Product stock is reduced for each ordered item
- Stock levels are updated in the database

### 7. **Notification**
- NotificationService sends order confirmation email
- Client receives confirmation of successful order creation

### 8. **Response**
- API returns 201 Created with order details
- Client receives complete order information including order ID

## Error Scenarios

### Validation Errors
- Missing required fields
- Invalid data formats
- Business rule violations

### Stock Errors
- Insufficient product stock
- Product not available
- Invalid product options

### System Errors
- Database connection issues
- Service unavailability
- Network timeouts
