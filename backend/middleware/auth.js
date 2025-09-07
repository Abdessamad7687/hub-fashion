const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  // Check for token in Authorization header or cookies
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies['auth-token'];
  
  console.log('Auth middleware - Headers:', req.headers);
  console.log('Auth middleware - Cookies:', req.cookies);
  console.log('Auth middleware - Auth header:', authHeader);
  console.log('Auth middleware - Cookie token:', cookieToken);
  
  let token = null;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (cookieToken) {
    token = cookieToken;
  }
  
  if (!token) {
    console.log('Auth middleware - No token found');
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log('Auth middleware - Token decoded successfully:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.log('Auth middleware - Token verification failed:', err.message);
    res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = authMiddleware; 