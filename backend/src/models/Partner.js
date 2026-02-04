const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Partner = sequelize.define('Partner', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  nama_toko: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  alamat: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  no_telepon: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  kota: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  }
}, {
  tableName: 'partners',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Partner;