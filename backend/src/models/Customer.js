const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Customer = sequelize.define('Customer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nama: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  no_wa: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  alamat: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'customers'
});

module.exports = Customer;
