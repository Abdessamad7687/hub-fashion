const express = require('express');
const prisma = require('../prismaClient');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all users (admin only)
router.get('/', auth, async (req, res) => {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
  const users = await prisma.user.findMany({ select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true } });
  res.json(users);
});

// Get current user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ 
      where: { id: req.user.userId }, 
      select: { 
        id: true, 
        email: true, 
        firstName: true, 
        lastName: true, 
        role: true, 
        createdAt: true,
        phone: true
      } 
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update current user profile
router.put('/profile', auth, async (req, res) => {
  try {
    console.log('Profile update request body:', req.body);
    console.log('User ID from auth:', req.user.userId);
    
    const { firstName, lastName, phone } = req.body;
    console.log('Extracted fields:', { firstName, lastName, phone });
    
    const user = await prisma.user.update({ 
      where: { id: req.user.userId }, 
      data: { firstName, lastName, phone },
      select: { 
        id: true, 
        email: true, 
        firstName: true, 
        lastName: true, 
        role: true, 
        createdAt: true,
        phone: true
      }
    });
    
    console.log('Profile update successful:', user);
    res.json(user);
  } catch (err) {
    console.error('Profile update error:', err);
    console.error('Error details:', {
      message: err.message,
      code: err.code,
      meta: err.meta
    });
    res.status(400).json({ error: 'Failed to update profile', details: err.message });
  }
});

// Get user by id (admin or self)
router.get('/:id', auth, async (req, res) => {
  if (req.user.role !== 'ADMIN' && req.user.userId !== req.params.id) return res.status(403).json({ error: 'Forbidden' });
  const user = await prisma.user.findUnique({ where: { id: req.params.id }, select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true } });
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
});

// Update user (admin only)
router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
  const { role, firstName, lastName, phone } = req.body;
  try {
    const user = await prisma.user.update({ 
      where: { id: req.params.id }, 
      data: { role, firstName, lastName, phone },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true }
    });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// Update user role (admin only)
router.put('/:id/role', auth, async (req, res) => {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
  const { role } = req.body;
  try {
    const user = await prisma.user.update({ where: { id: req.params.id }, data: { role } });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// Delete user (admin only)
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(404).json({ error: 'Not found' });
  }
});

module.exports = router; 