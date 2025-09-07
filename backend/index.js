require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// Configure CORS properly for frontend requests
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'], // Allow all frontend ports
  credentials: true, // Allow cookies and authentication headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow all necessary HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'], // Allow necessary headers
  exposedHeaders: ['Authorization'], // Expose Authorization header to frontend
}));

app.use(express.json());
app.use(cookieParser());

// Add request logging middleware (after body parsing)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/users', require('./routes/users'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/admin', require('./routes/admin'));

app.get('/', (req, res) => {
  res.send('E-commerce API is running');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 