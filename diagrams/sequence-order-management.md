# Sequence Diagram - Order Management Flow

```mermaid
sequenceDiagram
    participant A as Admin
    participant C as Client
    participant API as OrderController
    participant Auth as AuthMiddleware
    participant OS as OrderService
    participant OR as OrderRepository
    participant NS as NotificationService
    participant DB as Database

    %% Get All Orders (Admin)
    A->>API: GET /api/orders
    API->>Auth: authenticate()
    Auth->>DB: validate admin token
    DB-->>Auth: admin user data
    Auth-->>API: admin authenticated

    API->>OS: getAllOrders()
    OS->>OR: findAll()
    OR->>DB: SELECT orders with items and users
    DB-->>OR: orders data
    OR-->>OS: orders list
    OS-->>API: orders list
    API-->>A: 200 OK + orders data

    %% Get User Orders (Client)
    C->>API: GET /api/orders/user/me
    API->>Auth: authenticate()
    Auth->>DB: validate client token
    DB-->>Auth: client user data
    Auth-->>API: client authenticated

    API->>OS: getUserOrders(userId)
    OS->>OR: findByUserId(userId)
    OR->>DB: SELECT orders WHERE userId = ?
    DB-->>OR: user orders
    OR-->>OS: user orders list
    OS-->>API: user orders list
    API-->>C: 200 OK + user orders

    %% Get Specific Order
    A->>API: GET /api/orders/:id
    API->>Auth: authenticate()
    Auth-->>API: user authenticated

    API->>OS: getOrderById(orderId, userId)
    OS->>OR: findById(orderId)
    OR->>DB: SELECT order with items and user
    DB-->>OR: order data
    OR-->>OS: order object

    OS->>OS: checkAccess(order, userId)
    Note over OS: Verify user can access this order

    OS-->>API: order data
    API-->>A: 200 OK + order details

    %% Update Order (Admin)
    A->>API: PUT /api/orders/:id
    Note over A,API: Update order details

    API->>Auth: authenticate()
    Auth-->>API: admin authenticated

    API->>OS: updateOrder(orderId, orderData)
    OS->>OS: validateOrderData(orderData)
    OS->>OR: update(orderId, orderData)
    OR->>DB: UPDATE order SET ...
    DB-->>OR: order updated
    OR-->>OS: updated order
    OS-->>API: updated order
    API-->>A: 200 OK + updated order

    %% Update Order Status (Admin)
    A->>API: PUT /api/orders/:id/status
    Note over A,API: Update order status only

    API->>Auth: authenticate()
    Auth-->>API: admin authenticated

    API->>OS: updateOrderStatus(orderId, status)
    OS->>OS: validateStatus(status)
    OS->>OR: updateStatus(orderId, status)
    OR->>DB: UPDATE order SET status = ?
    DB-->>OR: status updated
    OR-->>OS: updated order

    OS->>NS: sendStatusUpdate(order, status)
    NS->>C: email notification
    Note over NS,C: Send status update email

    OS-->>API: updated order
    API-->>A: 200 OK + updated order

    %% Delete Order (Admin)
    A->>API: DELETE /api/orders/:id
    API->>Auth: authenticate()
    Auth-->>API: admin authenticated

    API->>OS: deleteOrder(orderId)
    OS->>OR: delete(orderId)
    OR->>DB: DELETE order
    Note over DB: Cascade delete order items
    DB-->>OR: order deleted
    OR-->>OS: deletion successful
    OS-->>API: deletion successful
    API-->>A: 200 OK + success message

    %% Error Scenarios
    Note over API,OS: Access Denied
    OS-->>API: 403 Forbidden
    API-->>A: 403 Forbidden + error message

    Note over OR,API: Order Not Found
    OR-->>OS: order not found
    OS-->>API: 404 Not Found
    API-->>A: 404 Not Found + error message
```

## Order Management Flow Description

### 1. **Get All Orders (Admin)**
- Admin requests all orders in the system
- Authentication verifies admin role
- OrderService retrieves all orders with related data
- Returns complete order list with items and user information

### 2. **Get User Orders (Client)**
- Client requests their own orders
- Authentication verifies client identity
- OrderService retrieves orders for specific user
- Returns filtered order list for the authenticated user

### 3. **Get Specific Order**
- Admin or order owner requests specific order details
- Authentication verifies user identity
- OrderService retrieves order by ID
- Access control verifies user can view this order
- Returns detailed order information

### 4. **Update Order (Admin)**
- Admin updates order details (shipping, payment info)
- Authentication verifies admin role
- OrderService validates update data
- OrderRepository updates order in database
- Returns updated order information

### 5. **Update Order Status (Admin)**
- Admin changes order status (pending → confirmed → shipped → delivered)
- Authentication verifies admin role
- OrderService validates status transition
- OrderRepository updates status in database
- NotificationService sends status update to customer
- Returns updated order with new status

### 6. **Delete Order (Admin)**
- Admin removes order from system
- Authentication verifies admin role
- OrderService deletes order and related items
- Database cascade deletes order items
- Returns confirmation of successful deletion

## Access Control Rules

### Admin Access
- Can view all orders
- Can update any order
- Can change order status
- Can delete orders
- Can access order management endpoints

### Client Access
- Can view only their own orders
- Can view details of their own orders
- Cannot modify orders
- Cannot access admin-only endpoints

## Error Handling

### Authentication Errors
- Invalid or expired tokens
- Missing authentication headers
- Unauthorized access attempts

### Authorization Errors
- Client trying to access admin functions
- User trying to access another user's orders
- Insufficient permissions for operation

### Data Errors
- Order not found
- Invalid order data
- Invalid status transitions
- Database constraint violations
