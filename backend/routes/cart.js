const express = require('express');
const prisma = require('../prismaClient');
const auth = require('../middleware/auth');
const router = express.Router();

// Get current user's cart
router.get('/', auth, async (req, res) => {
  let cart = await prisma.cart.findUnique({
    where: { userId: req.user.userId },
    include: { items: { include: { product: { include: { images: true, sizes: true } } } } }
  });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId: req.user.userId } });
  }
  res.json(cart);
});

// Add or update item in cart
router.post('/item', auth, async (req, res) => {
  const { productId, quantity, size, color } = req.body;
  let cart = await prisma.cart.findUnique({ where: { userId: req.user.userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId: req.user.userId } });
  }
  // Check if item exists (considering both size and color for uniqueness)
  let item = await prisma.cartItem.findFirst({ 
    where: { 
      cartId: cart.id, 
      productId, 
      size: size || null,
      color: color || null
    } 
  });
  if (item) {
    item = await prisma.cartItem.update({ where: { id: item.id }, data: { quantity } });
  } else {
    item = await prisma.cartItem.create({ 
      data: { 
        cartId: cart.id, 
        productId, 
        quantity, 
        size: size || null,
        color: color || null
      } 
    });
  }
  res.json(item);
});

// Remove item from cart
router.delete('/item/:itemId', auth, async (req, res) => {
  try {
    await prisma.cartItem.delete({ where: { id: req.params.itemId } });
    res.json({ success: true });
  } catch (err) {
    res.status(404).json({ error: 'Not found' });
  }
});

// Clear cart
router.delete('/clear', auth, async (req, res) => {
  let cart = await prisma.cart.findUnique({ where: { userId: req.user.userId } });
  if (cart) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }
  res.json({ success: true });
});

module.exports = router; 