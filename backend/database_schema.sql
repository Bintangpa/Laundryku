-- LaundryKu Database Schema
-- MySQL Database
-- Generated for LaundryKu Laundry Tracking System

-- Create Database
CREATE DATABASE IF NOT EXISTS laundryku_db;
USE laundryku_db;

-- ================================================
-- Table: users
-- Purpose: Authentication for Admin and Mitra
-- ================================================
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'mitra') NOT NULL DEFAULT 'mitra',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Table: partners
-- Purpose: Store laundry shop details
-- ================================================
CREATE TABLE IF NOT EXISTS partners (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  nama_toko VARCHAR(100) NOT NULL,
  alamat TEXT NOT NULL,
  no_telepon VARCHAR(20) NOT NULL,
  kota VARCHAR(50),
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Table: customers
-- Purpose: Store customer data
-- ================================================
CREATE TABLE IF NOT EXISTS customers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nama VARCHAR(100) NOT NULL,
  no_wa VARCHAR(20) NOT NULL,
  alamat TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_no_wa (no_wa)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Table: orders
-- Purpose: Store laundry orders/transactions
-- ================================================
CREATE TABLE IF NOT EXISTS orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  kode_laundry VARCHAR(20) NOT NULL UNIQUE,
  partner_id INT NOT NULL,
  customer_id INT NOT NULL,
  jenis_layanan ENUM(
    'Laundry Kiloan',
    'Laundry Satuan',
    'Express 6 Jam',
    'Dry Cleaning',
    'Setrika Saja',
    'Deep Clean'
  ) NOT NULL,
  berat DECIMAL(5,2) COMMENT 'Berat dalam kilogram (untuk layanan kiloan)',
  jumlah_item INT COMMENT 'Jumlah item (untuk layanan satuan)',
  catatan TEXT,
  total_harga DECIMAL(10,2) NOT NULL,
  status ENUM(
    'Diterima',
    'Sedang Dicuci',
    'Sedang Dikeringkan',
    'Sedang Disetrika',
    'Siap Diambil',
    'Selesai'
  ) DEFAULT 'Diterima',
  tanggal_masuk TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  estimasi_selesai TIMESTAMP,
  tanggal_selesai TIMESTAMP,
  metode_pembayaran ENUM('Cash', 'Transfer', 'QRIS'),
  status_pembayaran ENUM('Belum Lunas', 'Lunas') DEFAULT 'Belum Lunas',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (partner_id) REFERENCES partners(id),
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  INDEX idx_kode_laundry (kode_laundry),
  INDEX idx_partner_id (partner_id),
  INDEX idx_customer_id (customer_id),
  INDEX idx_status (status),
  INDEX idx_tanggal_masuk (tanggal_masuk)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Table: order_status_history
-- Purpose: Track status changes for orders
-- ================================================
CREATE TABLE IF NOT EXISTS order_status_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  status ENUM(
    'Diterima',
    'Sedang Dicuci',
    'Sedang Dikeringkan',
    'Sedang Disetrika',
    'Siap Diambil',
    'Selesai'
  ) NOT NULL,
  keterangan TEXT,
  updated_by INT NOT NULL COMMENT 'User ID yang mengupdate status (mitra atau admin)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (updated_by) REFERENCES users(id),
  INDEX idx_order_id (order_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Sample Data Insert (Optional)
-- ================================================

-- Insert Admin User (password: admin123)
INSERT INTO users (email, password, role, is_active) VALUES
('admin@laundryku.com', '$2a$10$rT8YvKMxM.jxQYqxKoP0eu3p3pTRHKxEGDJBzRHWGQxh0fN8jGWZW', 'admin', TRUE);

-- Note: To insert actual dummy data, run: npm run seed
-- This will populate all tables with test data

-- ================================================
-- Useful Queries
-- ================================================

-- Get all orders with customer and partner info
-- SELECT o.*, c.nama as customer_name, c.no_wa, p.nama_toko 
-- FROM orders o
-- JOIN customers c ON o.customer_id = c.id
-- JOIN partners p ON o.partner_id = p.id
-- ORDER BY o.created_at DESC;

-- Get order status history
-- SELECT osh.*, u.email as updated_by_email
-- FROM order_status_history osh
-- JOIN users u ON osh.updated_by = u.id
-- WHERE osh.order_id = ?
-- ORDER BY osh.created_at ASC;

-- Get orders by partner
-- SELECT o.* FROM orders o
-- WHERE o.partner_id = ?
-- ORDER BY o.tanggal_masuk DESC;

-- Track order by code
-- SELECT o.*, c.nama as customer_name, c.no_wa, p.nama_toko
-- FROM orders o
-- JOIN customers c ON o.customer_id = c.id
-- JOIN partners p ON o.partner_id = p.id
-- WHERE o.kode_laundry = ?;
