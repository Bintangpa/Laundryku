require('dotenv').config();
const { sequelize } = require('./connection');
const models = require('../models');

const migrate = async () => {
  try {
    console.log('🔄 Starting database migration...');
    
    // Test connection first
    await sequelize.authenticate();
    console.log('✅ Database connection successful');
    
    // Sync all models (create tables)
    await sequelize.sync({ force: false, alter: true });
    
    console.log('✅ All tables created successfully!');
    console.log('\n📋 Tables created:');
    console.log('   - users');
    console.log('   - partners');
    console.log('   - customers');
    console.log('   - orders');
    console.log('   - order_status_history');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

// Run migration
migrate();
