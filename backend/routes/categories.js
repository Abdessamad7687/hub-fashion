const express = require('express');
const prisma = require('../prismaClient');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: {
          select: {
            id: true
          }
        }
      }
    });
    
    // Transform the data to include product count
    const categoriesWithCount = categories.map(category => ({
      ...category,
      productCount: category.products.length
    }));
    
    res.json(categoriesWithCount);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get category by id
router.get('/:id', async (req, res) => {
  const category = await prisma.category.findUnique({ where: { id: req.params.id } });
  if (!category) return res.status(404).json({ error: 'Not found' });
  res.json(category);
});

// Get category by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const category = await prisma.category.findFirst({ 
      where: { 
        name: req.params.slug
      } 
    });
    if (!category) return res.status(404).json({ error: 'Not found' });
    res.json(category);
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create category (admin only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
  const { name, description, image } = req.body;
  try {
    const category = await prisma.category.create({ data: { name, description, image } });
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// Update category (admin only)
router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
  const { name, description, image } = req.body;
  try {
    const category = await prisma.category.update({ where: { id: req.params.id }, data: { name, description, image } });
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// Delete category (admin only)
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
  try {
    await prisma.category.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(404).json({ error: 'Not found' });
  }
});

module.exports = router; 