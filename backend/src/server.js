require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./database/connection');

// Import routes
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'LaundryKu API Server',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Test database connection endpoint
app.get('/api/health', async (req, res) => {
  const dbConnected = await testConnection();
  res.json({
    success: true,
    message: 'Server is running',
    database: dbConnected ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// ========== ROUTES ==========
app.use('/api/auth', authRoutes);      // Auth routes
app.use('/api/orders', orderRoutes);   // Order routes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection before starting server
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('⚠️  Server starting without database connection');
      console.error('⚠️  Please check your database configuration in .env file');
    }
    
    app.listen(PORT, () => {
      console.log('=================================');
      console.log('🚀 LaundryKu API Server');
      console.log('=================================');
      console.log(`📍 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 API URL: http://localhost:${PORT}`);
      console.log(`💾 Database: ${dbConnected ? '✅ Connected' : '❌ Disconnected'}`);
      console.log('=================================');
      console.log('🔐 Auth Routes:');
      console.log('   POST   /api/auth/register');
      console.log('   POST   /api/auth/login');
      console.log('   GET    /api/auth/profile (auth)');
      console.log('   PUT    /api/auth/profile (auth)');
      console.log('   PUT    /api/auth/change-password (auth)');
      console.log('');
      console.log('📦 Order Routes:');
      console.log('   POST   /api/orders (auth)');
      console.log('   GET    /api/orders/track/:kode (public)');
      console.log('   PUT    /api/orders/:id/status (auth)');
      console.log('   GET    /api/orders/partner/:id (auth)');
      console.log('=================================');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;