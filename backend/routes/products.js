const express = require('express');
const prisma = require('../prismaClient');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all products with filters
router.get('/', async (req, res) => {
  const { category, minPrice, maxPrice, gender, size, search } = req.query;
  const where = {};
  if (category) where.categoryId = category;
  if (gender) where.gender = gender;
  if (minPrice || maxPrice) where.price = {};
  if (minPrice) where.price.gte = parseFloat(minPrice);
  if (maxPrice) where.price.lte = parseFloat(maxPrice);
  if (search) where.OR = [
    { name: { contains: search, mode: 'insensitive' } },
    { description: { contains: search, mode: 'insensitive' } }
  ];
  // Filter by size (products that have at least one ProductSize with the given size)
  if (size) {
    where.sizes = { some: { size: size } };
  }
  const products = await prisma.product.findMany({
    where,
    include: { images: true, sizes: true, colors: true, features: true, category: true }
  });
  res.json(products);
});

// Get product by id
router.get('/:id', async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
    include: { images: true, sizes: true, colors: true, features: true, category: true }
  });
  if (!product) return res.status(404).json({ error: 'Not found' });
  res.json(product);
});

// Get product recommendations (same category, exclude current, limit 6)
router.get('/:id/recommendations', async (req, res) => {
  const product = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!product) return res.status(404).json({ error: 'Not found' });
  const recommendations = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id }
    },
    take: 6,
    include: { images: true, sizes: true, colors: true, features: true, category: true }
  });
  res.json(recommendations);
});

// Create product (admin only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
  const { name, description, price, stock, gender, categoryId, images, sizes, colors, features } = req.body;
  try {
    const product = await prisma.product.create({
      data: {
        name, description, price, stock, gender, categoryId,
        images: { create: images?.map(img => ({ url: img.url })) || [] },
        sizes: { create: sizes?.map(sz => ({ size: sz.size })) || [] },
        colors: { create: colors?.map(clr => ({ color: clr.color })) || [] },
        features: { create: features?.map(feat => ({ name: feat.name, value: feat.value })) || [] }
      }
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// Update product (admin only)
router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
  const { name, description, price, stock, gender, categoryId, images, sizes, colors, features } = req.body;
  try {
    // Remove old images/sizes/colors/features, then add new
    await prisma.productImage.deleteMany({ where: { productId: req.params.id } });
    await prisma.productSize.deleteMany({ where: { productId: req.params.id } });
    await prisma.productColor.deleteMany({ where: { productId: req.params.id } });
    await prisma.productFeature.deleteMany({ where: { productId: req.params.id } });
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        name, description, price, stock, gender, categoryId,
        images: { create: images?.map(img => ({ url: img.url })) || [] },
        sizes: { create: sizes?.map(sz => ({ size: sz.size })) || [] },
        colors: { create: colors?.map(clr => ({ color: clr.color })) || [] },
        features: { create: features?.map(feat => ({ name: feat.name, value: feat.value })) || [] }
      }
    });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// Delete product (admin only)
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(404).json({ error: 'Not found' });
  }
});

module.exports = router; 