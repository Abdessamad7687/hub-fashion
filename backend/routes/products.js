const express = require('express');
const prisma = require('../prismaClient');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all products with filters
router.get('/', async (req, res) => {
  const { category, minPrice, maxPrice, gender, size, sizes, colors, price, search, sort } = req.query;
  const where = {};
  
  // Category filter
  if (category) where.categoryId = category;
  
  // Gender filter
  if (gender) where.gender = gender;
  
  // Price filter - handle both individual min/max and range format
  if (price) {
    const [min, max] = price.split('-').map(p => parseFloat(p));
    where.price = {};
    if (min) where.price.gte = min;
    if (max) where.price.lte = max;
  } else {
    if (minPrice || maxPrice) where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }
  
  // Search filter
  if (search) where.OR = [
    { name: { contains: search } },
    { description: { contains: search } }
  ];
  
  // Size filter - handle both single size and multiple sizes
  if (sizes) {
    const sizeArray = sizes.split(',');
    where.sizes = { some: { size: { in: sizeArray } } };
  } else if (size) {
    where.sizes = { some: { size: size } };
  }
  
  // Color filter - handle multiple colors
  if (colors) {
    const colorArray = colors.split(',');
    where.colors = { some: { color: { in: colorArray } } };
  }
  
  // Build orderBy for sorting
  let orderBy = {};
  if (sort) {
    switch (sort) {
      case 'price-asc':
        orderBy = { price: 'asc' };
        break;
      case 'price-desc':
        orderBy = { price: 'desc' };
        break;
      case 'name-asc':
        orderBy = { name: 'asc' };
        break;
      case 'name-desc':
        orderBy = { name: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }
  } else {
    orderBy = { createdAt: 'desc' };
  }
  
  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: { 
      images: true, 
      sizes: true, 
      colors: true, 
      features: true, 
      category: true,
      reviews: {
        select: {
          rating: true
        }
      }
    }
  });

  // Calculate average ratings
  const productsWithRatings = products.map(product => {
    const ratings = product.reviews.map(review => review.rating);
    const averageRating = ratings.length > 0 
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
      : 0;
    
    return {
      ...product,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      reviewCount: ratings.length
    };
  });

  res.json(productsWithRatings);
});

// Search products endpoint for live search
router.get('/search', async (req, res) => {
  const { q, limit = 10 } = req.query;
  
  if (!q || q.trim().length < 2) {
    return res.json([]);
  }

  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: q } },
        { description: { contains: q } }
      ]
    },
    take: parseInt(limit),
    include: { 
      images: true, 
      category: true,
      reviews: {
        select: {
          rating: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Calculate average ratings and format for search results
  const searchResults = products.map(product => {
    const ratings = product.reviews.map(review => review.rating);
    const averageRating = ratings.length > 0 
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
      : 0;
    
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]?.url,
      averageRating: Math.round(averageRating * 10) / 10,
      reviewCount: ratings.length
    };
  });

  res.json(searchResults);
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