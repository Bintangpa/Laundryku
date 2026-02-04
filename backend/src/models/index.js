const User = require('./User');
const Partner = require('./Partner');
const Customer = require('./Customer');
const Order = require('./Order');
const OrderStatusHistory = require('./OrderStatusHistory');

// Define relationships

// User - Partner (One to One)
User.hasOne(Partner, {
  foreignKey: 'user_id',
  as: 'partner'
});
Partner.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

// Partner - Order (One to Many)
Partner.hasMany(Order, {
  foreignKey: 'partner_id',
  as: 'orders'
});
Order.belongsTo(Partner, {
  foreignKey: 'partner_id',
  as: 'partner'
});

// Customer - Order (One to Many)
Customer.hasMany(Order, {
  foreignKey: 'customer_id',
  as: 'orders'
});
Order.belongsTo(Customer, {
  foreignKey: 'customer_id',
  as: 'customer'
});

// Order - OrderStatusHistory (One to Many)
Order.hasMany(OrderStatusHistory, {
  foreignKey: 'order_id',
  as: 'status_history'
});
OrderStatusHistory.belongsTo(Order, {
  foreignKey: 'order_id',
  as: 'order'
});

// User - OrderStatusHistory (for tracking who updated)
User.hasMany(OrderStatusHistory, {
  foreignKey: 'updated_by',
  as: 'status_updates'
});
OrderStatusHistory.belongsTo(User, {
  foreignKey: 'updated_by',
  as: 'updater'
});

module.exports = {
  User,
  Partner,
  Customer,
  Order,
  OrderStatusHistory
};
