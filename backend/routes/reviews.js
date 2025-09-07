const express = require('express');
const prisma = require('../prismaClient');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all reviews
router.get('/', async (req, res) => {
  const reviews = await prisma.review.findMany({ include: { user: true, product: true } });
  res.json(reviews);
});

// Get review by id
router.get('/:id', async (req, res) => {
  const review = await prisma.review.findUnique({ where: { id: req.params.id }, include: { user: true, product: true } });
  if (!review) return res.status(404).json({ error: 'Not found' });
  res.json(review);
});

// Create review (client only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'CLIENT') return res.status(403).json({ error: 'Forbidden' });
  const { rating, comment, productId } = req.body;
  try {
    const review = await prisma.review.create({
      data: {
        rating, comment, productId, userId: req.user.userId
      }
    });
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// Update review (owner only)
router.put('/:id', auth, async (req, res) => {
  const review = await prisma.review.findUnique({ where: { id: req.params.id } });
  if (!review) return res.status(404).json({ error: 'Not found' });
  if (req.user.userId !== review.userId) return res.status(403).json({ error: 'Forbidden' });
  const { rating, comment } = req.body;
  try {
    const updated = await prisma.review.update({ where: { id: req.params.id }, data: { rating, comment } });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// Delete review (owner or admin)
router.delete('/:id', auth, async (req, res) => {
  const review = await prisma.review.findUnique({ where: { id: req.params.id } });
  if (!review) return res.status(404).json({ error: 'Not found' });
  if (req.user.userId !== review.userId && req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
  try {
    await prisma.review.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(404).json({ error: 'Not found' });
  }
});

module.exports = router; 