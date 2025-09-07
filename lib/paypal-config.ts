// PayPal Sandbox Configuration
export const paypalConfig = {
  // PayPal Sandbox Client ID
  clientId: "AZw_rxzLR8GvfSrJVTp82xYweClTNFVOYub08l0CEJNzoODmzgIH_YtR_W0fMLBK3xKZ87RmcRtw_4iv",
  
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

// Instructions for PayPal Sandbox Testing:
// 1. Your PayPal Sandbox is already configured with valid credentials
// 2. Use these test accounts to simulate payments:
//    - Buyer: sb-buyer@business.example.com / 12345678
//    - Seller: sb-seller@business.example.com / 12345678
// 3. The PayPal button will appear in sandbox mode
// 4. All transactions are test transactions and won't charge real money
// 5. Check PayPal Developer Dashboard for transaction logs

