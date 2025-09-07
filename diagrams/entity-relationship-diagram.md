# Entity Relationship Diagram - Orders Domain

```mermaid
erDiagram
    %% Core Entities
    USER {
        string id PK
        string email UK
        string password
        string firstName
        string lastName
        string phone
        enum role
        datetime createdAt
        datetime updatedAt
    }

    ORDER {
        string id PK
        string userId FK
        float total
        enum status
        datetime createdAt
        datetime updatedAt
        string shippingFirstName
        string shippingLastName
        string shippingEmail
        string shippingPhone
        string shippingAddress
        string shippingCity
        string shippingState
        string shippingZipCode
        string shippingCountry
        string paymentMethod
    }

    ORDER_ITEM {
        string id PK
        string orderId FK
        string productId FK
        int quantity
        float price
        string size
        string color
    }

    PRODUCT {
        string id PK
        string name
        string description
        float price
        int stock
        enum gender
        string categoryId FK
        datetime createdAt
        datetime updatedAt
    }

    CATEGORY {
        string id PK
        string name UK
        string description
        string image
    }

    %% Product Related Entities
    PRODUCT_IMAGE {
        string id PK
        string url
        string productId FK
    }

    PRODUCT_SIZE {
        string id PK
        string size
        string productId FK
    }

    PRODUCT_COLOR {
        string id PK
        string color
        string productId FK
    }

    PRODUCT_FEATURE {
        string id PK
        string name
        string value
        string productId FK
    }

    %% Cart Related Entities
    CART {
        string id PK
        string userId FK UK
        datetime createdAt
        datetime updatedAt
    }

    CART_ITEM {
        string id PK
        string cartId FK
        string productId FK
        int quantity
        string size
        string color
    }

    %% Review Entity
    REVIEW {
        string id PK
        int rating
        string comment
        string userId FK
        string productId FK
        datetime createdAt
    }

    %% Enums
    USER_ROLE {
        CLIENT
        ADMIN
    }

    ORDER_STATUS {
        PENDING
        CONFIRMED
        PROCESSING
        SHIPPED
        DELIVERED
        CANCELLED
    }

    GENDER {
        HOMME
        FEMME
        ENFANT
    }

    %% Relationships
    USER ||--o{ ORDER : "creates"
    USER ||--o| CART : "has"
    USER ||--o{ REVIEW : "writes"

    ORDER ||--o{ ORDER_ITEM : "contains"
    ORDER }o--|| USER : "belongs to"

    ORDER_ITEM }o--|| PRODUCT : "references"
    ORDER_ITEM }o--|| ORDER : "belongs to"

    PRODUCT }o--|| CATEGORY : "belongs to"
    PRODUCT ||--o{ PRODUCT_IMAGE : "has"
    PRODUCT ||--o{ PRODUCT_SIZE : "has"
    PRODUCT ||--o{ PRODUCT_COLOR : "has"
    PRODUCT ||--o{ PRODUCT_FEATURE : "has"
    PRODUCT ||--o{ ORDER_ITEM : "ordered in"
    PRODUCT ||--o{ CART_ITEM : "added to cart"
    PRODUCT ||--o{ REVIEW : "reviewed"

    CATEGORY ||--o{ PRODUCT : "contains"

    CART ||--o{ CART_ITEM : "contains"
    CART }o--|| USER : "belongs to"

    CART_ITEM }o--|| PRODUCT : "references"
    CART_ITEM }o--|| CART : "belongs to"

    REVIEW }o--|| USER : "written by"
    REVIEW }o--|| PRODUCT : "reviews"

    %% Enum Relationships
    USER ||--|| USER_ROLE : "has role"
    ORDER ||--|| ORDER_STATUS : "has status"
    PRODUCT ||--|| GENDER : "has gender"
```

## Entity Descriptions

### Core Business Entities

**USER**
- Represents system users (customers and administrators)
- Contains authentication and profile information
- Role-based access control (CLIENT/ADMIN)

**ORDER**
- Central entity representing customer orders
- Contains shipping and payment information
- Tracks order status throughout lifecycle
- Linked to user and order items

**ORDER_ITEM**
- Individual items within an order
- Contains product details, quantity, and pricing
- Links orders to products with specific options

**PRODUCT**
- Product catalog items
- Contains pricing, inventory, and categorization
- Linked to categories and product attributes

**CATEGORY**
- Product categorization system
- Organizes products into logical groups
- Contains category metadata and images

### Product Attribute Entities

**PRODUCT_IMAGE**
- Multiple images per product
- Supports product galleries
- Cascade deleted with product

**PRODUCT_SIZE**
- Available sizes for products
- Flexible size options per product
- Cascade deleted with product

**PRODUCT_COLOR**
- Available colors for products
- Flexible color options per product
- Cascade deleted with product

**PRODUCT_FEATURE**
- Additional product specifications
- Key-value pairs for product details
- Cascade deleted with product

### Shopping Cart Entities

**CART**
- User shopping cart
- One-to-one relationship with user
- Temporary storage before checkout

**CART_ITEM**
- Items in shopping cart
- Similar to order items but temporary
- Links cart to products

### Review System

**REVIEW**
- Customer product reviews
- Links users to products
- Contains rating and comments

## Relationship Cardinalities

### One-to-Many Relationships
- User → Orders (1:N)
- User → Reviews (1:N)
- Order → Order Items (1:N)
- Product → Order Items (1:N)
- Product → Reviews (1:N)
- Category → Products (1:N)

### One-to-One Relationships
- User → Cart (1:1)
- Order → User (N:1)

### Many-to-Many Relationships
- Products ↔ Categories (through foreign keys)
- Users ↔ Products (through reviews)

## Database Constraints

### Primary Keys
- All entities have unique string IDs (CUID format)
- Primary keys are immutable and unique

### Foreign Keys
- Maintain referential integrity
- Cascade deletes for dependent entities
- Nullable foreign keys where appropriate

### Unique Constraints
- User email must be unique
- Category name must be unique
- User can have only one cart

### Check Constraints
- Order status must be valid enum value
- User role must be valid enum value
- Product gender must be valid enum value
- Review rating must be within valid range (1-5)

## Indexing Strategy

### Primary Indexes
- All primary keys are automatically indexed
- Foreign keys are indexed for join performance

### Unique Indexes
- User email (unique constraint)
- Category name (unique constraint)

### Composite Indexes
- Order items: (orderId, productId)
- Cart items: (cartId, productId)
- Reviews: (userId, productId)

### Performance Indexes
- Order status for status-based queries
- Order creation date for time-based queries
- Product category for category-based queries
