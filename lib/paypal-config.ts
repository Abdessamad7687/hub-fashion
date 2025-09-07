// PayPal Sandbox Configuration
// Replace these with your actual PayPal Sandbox credentials
export const paypalConfig = {
  // PayPal Sandbox Client ID
  // Get this from: https://developer.paypal.com/dashboard/
  clientId: "test", // Change this to your actual sandbox client ID
  
  // Environment: 'sandbox' for testing, 'production' for live
  environment: "sandbox" as "sandbox" | "production",
  
  // Currency
  currency: "USD",
  
  // Intent: 'capture' for immediate payment, 'authorize' for authorization only
  intent: "capture" as "capture" | "authorize",
}

// PayPal Sandbox Test Accounts
// You can use these test accounts to simulate payments:
export const paypalTestAccounts = {
  buyer: {
    email: "sb-buyer@business.example.com",
    password: "12345678",
  },
  seller: {
    email: "sb-seller@business.example.com", 
    password: "12345678",
  },
}

// Instructions for setting up PayPal Sandbox:
// 1. Go to https://developer.paypal.com/
// 2. Sign up for a developer account
// 3. Go to Dashboard > My Apps & Credentials
// 4. Create a new app for Sandbox
// 5. Copy the Client ID and replace 'test' above
// 6. Use the test accounts above to simulate payments

