const express = require('express');
const prisma = require('../prismaClient');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { 
        email, 
        password: hashedPassword, 
        role: 'CLIENT',
        firstName: firstName || null,
        lastName: lastName || null
      },
    });
    
    // Return user data without password
    const userResponse = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone
    };
    
    res.status(201).json({ 
      user: userResponse,
      message: 'User created successfully'
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  console.log('Login request received:', { body: req.body, headers: req.headers });
  const { email, password } = req.body;
  if (!email || !password) {
    console.log('Missing email or password');
    return res.status(400).json({ error: 'Email and password are required' });
  }
  try {
    console.log('Looking for user with email:', email);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    console.log('User found, checking password');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      console.log('Password validation failed');
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    console.log('Login successful for user:', email);
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    // Set HTTP-only cookie
    res.cookie('auth-token', token, {
      httpOnly: true,
      secure: false, // Set to false for localhost development
      sameSite: 'lax',
      path: '/', // Explicitly set path
      // Remove domain restriction for localhost development
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    // Also send token in response for frontend to store
    res.setHeader('Authorization', `Bearer ${token}`);
    console.log('Login successful, sending Authorization header:', `Bearer ${token.substring(0, 20)}...`);
    
    const userResponse = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone
    };
    
    res.json({ 
      user: userResponse,
      message: 'Login successful'
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.cookies['auth-token'] || req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await prisma.user.findUnique({ 
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        phone: true
      }
    });
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    res.json({ user });
  } catch (err) {
    console.error('Auth check error:', err);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  try {
    res.clearCookie('auth-token');
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: 'Logout failed' });
  }
});

module.exports = router; 