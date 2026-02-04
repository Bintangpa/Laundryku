const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  kode_laundry: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  partner_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'partners',
      key: 'id'
    }
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'customers',
      key: 'id'
    }
  },
  jenis_layanan: {
    type: DataTypes.ENUM(
      'Laundry Kiloan',
      'Laundry Satuan',
      'Express 6 Jam',
      'Dry Cleaning',
      'Setrika Saja',
      'Deep Clean'
    ),
    allowNull: false
  },
  berat: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'Berat dalam kilogram (untuk layanan kiloan)'
  },
  jumlah_item: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Jumlah item (untuk layanan satuan)'
  },
  catatan: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  total_harga: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
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
    defaultValue: 'Diterima'
  },
  tanggal_masuk: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  estimasi_selesai: {
    type: DataTypes.DATE,
    allowNull: true
  },
  tanggal_selesai: {
    type: DataTypes.DATE,
    allowNull: true
  },
  metode_pembayaran: {
    type: DataTypes.ENUM('Cash', 'Transfer', 'QRIS'),
    allowNull: true
  },
  status_pembayaran: {
    type: DataTypes.ENUM('Belum Lunas', 'Lunas'),
    defaultValue: 'Belum Lunas'
  }
}, {
  tableName: 'orders'
});

module.exports = Order;
