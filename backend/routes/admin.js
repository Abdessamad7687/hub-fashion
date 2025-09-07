const express = require('express');
const prisma = require('../prismaClient');
const simpleAdminAuth = require('../middleware/simple-admin-auth');
const router = express.Router();

// Dashboard stats
router.get('/stats', simpleAdminAuth, async (req, res) => {
  try {
    const [users, products, orders, reviews] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.review.count()
    ]);
    const totalSales = await prisma.order.aggregate({ _sum: { total: true } });
    res.json({ users, products, orders, reviews, totalSales: totalSales._sum.total || 0 });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// List all orders (with user)
router.get('/orders', simpleAdminAuth, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({ include: { user: true, items: true } });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// List all users
router.get('/users', simpleAdminAuth, async (req, res) => {
  try {
    const users = await prisma.user.findMany({ select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true } });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// List all products
router.get('/products', simpleAdminAuth, async (req, res) => {
  try {
    const products = await prisma.product.findMany({ include: { images: true, sizes: true, category: true } });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

module.exports = router; 