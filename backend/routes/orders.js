const express = require('express');
const prisma = require('../prismaClient');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all orders (admin only)
router.get('/', auth, async (req, res) => {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
  const orders = await prisma.order.findMany({ include: { items: true, user: true } });
  res.json(orders);
});

// Get user orders (authenticated user)
router.get('/user/me', auth, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({ 
      where: { userId: req.user.userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order by id (admin or owner)
router.get('/:id', auth, async (req, res) => {
  const order = await prisma.order.findUnique({ where: { id: req.params.id }, include: { items: true, user: true } });
  if (!order) return res.status(404).json({ error: 'Not found' });
  if (req.user.role !== 'ADMIN' && req.user.userId !== order.userId) return res.status(403).json({ error: 'Forbidden' });
  res.json(order);
});

// Create order (client only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'CLIENT') return res.status(403).json({ error: 'Forbidden' });
  const { items, shippingAddress, subtotal, shipping, tax, total, paymentMethod } = req.body;
  try {
    const order = await prisma.order.create({
      data: {
        userId: req.user.userId,
        total,
        status: 'PENDING',
        // Shipping Address
        shippingFirstName: shippingAddress?.firstName || null,
        shippingLastName: shippingAddress?.lastName || null,
        shippingEmail: shippingAddress?.email || null,
        shippingPhone: shippingAddress?.phone || null,
        shippingAddress: shippingAddress?.address || null,
        shippingCity: shippingAddress?.city || null,
        shippingState: shippingAddress?.state || null,
        shippingZipCode: shippingAddress?.zipCode || null,
        shippingCountry: shippingAddress?.country || null,
        // Payment
        paymentMethod: paymentMethod || null,
        items: {
          create: items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
            size: item.size || null,
            color: item.color || null
          }))
        }
      },
      include: { items: true }
    });
    res.status(201).json(order);
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(400).json({ error: 'Invalid data' });
  }
});

// Update order (admin only)
router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
  const { status, shippingFirstName, shippingLastName, shippingEmail, shippingPhone, shippingAddress, shippingCity, shippingState, shippingZipCode, shippingCountry, paymentMethod } = req.body;
  try {
    const order = await prisma.order.update({ 
      where: { id: req.params.id }, 
      data: { 
        status, 
        shippingFirstName, 
        shippingLastName, 
        shippingEmail, 
        shippingPhone, 
        shippingAddress, 
        shippingCity, 
        shippingState, 
        shippingZipCode, 
        shippingCountry, 
        paymentMethod 
      },
      include: { items: true, user: true }
    });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// Update order status (admin only)
router.put('/:id/status', auth, async (req, res) => {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
  const { status } = req.body;
  try {
    const order = await prisma.order.update({ where: { id: req.params.id }, data: { status } });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// Delete order (admin only)
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
  try {
    await prisma.order.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(404).json({ error: 'Not found' });
  }
});

module.exports = router; 