/**
 * Generate Kode Laundry Otomatis
 * Format: LDY-YYYYMMDD-XXXXX
 * Contoh: LDY-20250204-00001
 */

const { Order } = require('../models');
const { Op } = require('sequelize');

/**
 * Generate kode laundry unik
 * @returns {Promise<string>} Kode laundry yang unik
 */
async function generateTrackingCode() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  
  const prefix = `LDY-${year}${month}${day}`;
  
  // Cari order terakhir hari ini
  const lastOrder = await Order.findOne({
    where: {
      kode_laundry: {
        [Op.like]: `${prefix}%`
      }
    },
    order: [['kode_laundry', 'DESC']]
  });
  
  let sequence = 1;
  
  if (lastOrder) {
    // Extract nomor urut dari kode terakhir
    const lastSequence = parseInt(lastOrder.kode_laundry.split('-')[2]);
    sequence = lastSequence + 1;
  }
  
  // Format nomor urut jadi 5 digit (00001, 00002, dst)
  const sequenceStr = String(sequence).padStart(5, '0');
  
  return `${prefix}-${sequenceStr}`;
}

/**
 * Validasi kode laundry
 * @param {string} kode - Kode laundry yang mau dicek
 * @returns {boolean} True jika format valid
 */
function validateTrackingCode(kode) {
  const regex = /^LDY-\d{8}-\d{5}$/;
  return regex.test(kode);
}

module.exports = {
  generateTrackingCode,
  validateTrackingCode
};