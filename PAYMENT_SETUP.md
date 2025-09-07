# Payment System Setup Guide

This guide explains how to set up and use the payment system in your e-commerce application.

## 🚀 Available Payment Methods

### 1. Demo Card Payment (Recommended for Testing)
- **Purpose**: Simulate credit card payments without real charges
- **Use Case**: Development, testing, and demonstrations
- **Features**: 
  - Simulates 3-second payment processing
  - Accepts any card details
  - Shows success/failure states
  - No real charges

### 2. PayPal Sandbox
- **Purpose**: Test PayPal integration in a safe environment
- **Use Case**: Testing PayPal checkout flow
- **Features**:
  - Real PayPal interface
  - Sandbox test accounts
  - No real charges

### 3. Real Credit Card (Future Implementation)
- **Purpose**: Process real payments
- **Use Case**: Production environment
- **Features**: 
  - Integrate with Stripe, Square, or other processors
  - Real payment processing

## 🔧 Setup Instructions

### PayPal Sandbox Setup

1. **Create PayPal Developer Account**
   - Go to [PayPal Developer Portal](https://developer.paypal.com/)
   - Sign up for a free developer account

2. **Create Sandbox App**
   - Go to Dashboard > My Apps & Credentials
   - Click "Create App"
   - Choose "Business" app type
   - Give it a name (e.g., "E-commerce Demo")

3. **Get Sandbox Credentials**
   - Copy the **Client ID** from your sandbox app
   - Open `lib/paypal-config.ts`
   - Replace `"test"` with your actual Client ID

4. **Test with Sandbox Accounts**
   - Use these test accounts to simulate payments:
   - **Buyer**: `sb-buyer@business.example.com` / `12345678`
   - **Seller**: `sb-seller@business.example.com` / `12345678`

### Demo Card Payment Setup

No setup required! The demo card payment system works out of the box.

## 🧪 Testing the Payment System

### Test Demo Card Payment

1. **Add items to cart**
2. **Go to checkout** (`/checkout`)
3. **Fill shipping information**
4. **Select "Demo Card Payment"**
5. **Enter any card details**:
   - Card Number: `1234 5678 9012 3456`
   - Expiry: `12/25`
   - CVC: `123`
   - Name: `John Doe`
6. **Click "Pay $X.XX"**
7. **Wait for 3-second simulation**
8. **See success message**

### Test PayPal Sandbox

1. **Add items to cart**
2. **Go to checkout** (`/checkout`)
3. **Fill shipping information**
4. **Select "PayPal Sandbox"**
5. **Click PayPal button**
6. **Login with sandbox account**: `sb-buyer@business.example.com`
7. **Complete payment flow**
8. **Return to your app**

## 📁 File Structure

```
components/
├── paypal-button.tsx          # PayPal integration
├── demo-card-payment.tsx      # Demo card payment simulation
└── checkout-summary.tsx       # Order summary

lib/
├── paypal-config.ts           # PayPal configuration
└── order-context.tsx          # Order management

app/
└── checkout/
    └── page.tsx               # Checkout page
```

## 🔒 Security Notes

- **Demo Mode**: No real payments are processed
- **Sandbox**: PayPal sandbox is completely safe
- **Production**: Never use sandbox credentials in production
- **Environment Variables**: Store real credentials in `.env` files

## 🚀 Going to Production

When ready for production:

1. **Replace sandbox credentials** with production ones
2. **Integrate real payment processor** (Stripe, Square, etc.)
3. **Remove demo payment option**
4. **Add proper error handling**
5. **Implement webhook handling**
6. **Add payment confirmation emails**

## 🐛 Troubleshooting

### PayPal Button Not Loading
- Check if Client ID is correct
- Verify internet connection
- Check browser console for errors

### Demo Payment Not Working
- Ensure all form fields are filled
- Check browser console for errors
- Verify component is properly imported

### CORS Issues
- Ensure backend CORS is configured
- Check if frontend and backend ports match

## 📞 Support

For issues with:
- **PayPal Integration**: Check [PayPal Developer Docs](https://developer.paypal.com/docs/)
- **Demo Payments**: Check component implementation
- **General Setup**: Review this guide

## 🎯 Next Steps

1. **Test demo payments** to ensure flow works
2. **Set up PayPal sandbox** for PayPal testing
3. **Customize payment forms** as needed
4. **Add more payment methods** (Stripe, etc.)
5. **Implement order confirmation** and emails

