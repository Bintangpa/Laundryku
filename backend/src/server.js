require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./database/connection');

// Import routes
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const trackingRoutes = require('./routes/trackingRoutes');
const partnerRoutes = require('./routes/partnerRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger middleware (optional, for development)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Health check endpoints
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'LaundryKu API Server',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', async (req, res) => {
  const dbConnected = await testConnection();
  res.json({
    success: true,
    message: 'Server is running',
    database: dbConnected ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`
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
      console.log('📋 Available Endpoints:');
      console.log('   POST   /api/auth/login');
      console.log('   POST   /api/auth/register');
      console.log('   GET    /api/auth/profile');
      console.log('   ');
      console.log('   GET    /api/orders');
      console.log('   POST   /api/orders');
      console.log('   GET    /api/orders/:id');
      console.log('   PATCH  /api/orders/:id/status');
      console.log('   PUT    /api/orders/:id');
      console.log('   DELETE /api/orders/:id');
      console.log('   ');
      console.log('   GET    /api/tracking/:code');
      console.log('   ');
      console.log('   GET    /api/partners');
      console.log('   POST   /api/partners');
      console.log('   GET    /api/partners/:id');
      console.log('   PUT    /api/partners/:id');
      console.log('   DELETE /api/partners/:id');
      console.log('   ');
      console.log('   GET    /api/dashboard/admin');
      console.log('   GET    /api/dashboard/mitra');
      console.log('=================================');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;