const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const OrderStatusHistory = sequelize.define('OrderStatusHistory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  status: {
    type: DataTypes.ENUM(
      'Diterima',
      'Sedang Dicuci',
      'Sedang Dikeringkan',
      'Sedang Disetrika',
      'Siap Diambil',
      'Selesai'
    ),
    allowNull: false
  },
  keterangan: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  updated_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'User ID yang mengupdate status (mitra atau admin)'
  }
}, {
  tableName: 'order_status_history',
  updatedAt: false
});

module.exports = OrderStatusHistory;
