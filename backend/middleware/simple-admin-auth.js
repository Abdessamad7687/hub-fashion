// Simple admin authentication middleware
// No JWT tokens, no database lookups - just a simple password check

function simpleAdminAuth(req, res, next) {
  // Check for admin password in request headers or body
  const adminPassword = req.headers['x-admin-password'] || req.body.adminPassword;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
  
  console.log('Simple admin auth - Password provided:', !!adminPassword);
  
  if (adminPassword === ADMIN_PASSWORD) {
    // Set a simple admin flag
    req.isAdmin = true;
    next();
  } else {
    console.log('Simple admin auth - Access denied');
    res.status(403).json({ error: 'Admin access required' });
  }
}

module.exports = simpleAdminAuth;
