# Use Case Diagram - Modern E-commerce Application

```mermaid
graph TB
    %% Actors
    Customer[👤 Customer]
    Guest[👤 Guest User]
    Admin[👤 Admin]
    
    %% System Boundary
    subgraph "E-commerce System"
        %% Customer Use Cases
        UC1[Browse Products]
        UC2[Search Products]
        UC3[View Product Details]
        UC4[Filter Products by Category]
        UC5[Filter Products by Gender]
        UC6[Add to Cart]
        UC7[View Cart]
        UC8[Update Cart Quantity]
        UC9[Remove from Cart]
        UC10[Proceed to Checkout]
        UC11[Create Account]
        UC12[Login]
        UC13[Logout]
        UC14[View Profile]
        UC15[Update Profile]
        UC16[Add to Wishlist]
        UC17[View Wishlist]
        UC18[Remove from Wishlist]
        UC19[Write Product Review]
        UC20[View Product Reviews]
        UC21[Place Order]
        UC22[View Order History]
        UC23[Track Order Status]
        UC24[Subscribe to Newsletter]
        
        %% Guest Use Cases
        UC25[Browse Products as Guest]
        UC26[Search Products as Guest]
        UC27[View Product Details as Guest]
        UC28[Add to Cart as Guest]
        UC29[Register Account]
        
        %% Admin Use Cases
        UC30[Manage Products]
        UC31[Add New Product]
        UC32[Update Product Details]
        UC33[Delete Product]
        UC34[Manage Product Images]
        UC35[Manage Product Sizes]
        UC36[Manage Categories]
        UC37[Add New Category]
        UC38[Update Category]
        UC39[Delete Category]
        UC40[Manage Orders]
        UC41[View All Orders]
        UC42[Update Order Status]
        UC43[Cancel Order]
        UC44[Manage Users]
        UC45[View User Details]
        UC46[Update User Role]
        UC47[View Analytics Dashboard]
        UC48[Manage Inventory]
        UC49[Update Stock Levels]
    end
    
    %% Customer Relationships
    Customer --> UC1
    Customer --> UC2
    Customer --> UC3
    Customer --> UC4
    Customer --> UC5
    Customer --> UC6
    Customer --> UC7
    Customer --> UC8
    Customer --> UC9
    Customer --> UC10
    Customer --> UC11
    Customer --> UC12
    Customer --> UC13
    Customer --> UC14
    Customer --> UC15
    Customer --> UC16
    Customer --> UC17
    Customer --> UC18
    Customer --> UC19
    Customer --> UC20
    Customer --> UC21
    Customer --> UC22
    Customer --> UC23
    Customer --> UC24
    
    %% Guest Relationships
    Guest --> UC25
    Guest --> UC26
    Guest --> UC27
    Guest --> UC28
    Guest --> UC29
    
    %% Admin Relationships
    Admin --> UC30
    Admin --> UC31
    Admin --> UC32
    Admin --> UC33
    Admin --> UC34
    Admin --> UC35
    Admin --> UC36
    Admin --> UC37
    Admin --> UC38
    Admin --> UC39
    Admin --> UC40
    Admin --> UC41
    Admin --> UC42
    Admin --> UC43
    Admin --> UC44
    Admin --> UC45
    Admin --> UC46
    Admin --> UC47
    Admin --> UC48
    Admin --> UC49
    
    %% Include Relationships
    UC10 -.->|includes| UC7
    UC21 -.->|includes| UC10
    UC21 -.->|includes| UC12
    UC22 -.->|includes| UC12
    UC23 -.->|includes| UC12
    UC15 -.->|includes| UC12
    UC17 -.->|includes| UC12
    UC18 -.->|includes| UC12
    UC19 -.->|includes| UC12
    UC20 -.->|includes| UC3
    UC29 -.->|includes| UC11
    
    %% Extend Relationships
    UC28 -.->|extends| UC6
    UC25 -.->|extends| UC1
    UC26 -.->|extends| UC2
    UC27 -.->|extends| UC3


